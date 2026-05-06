import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../App';
import api from '../services/api';

const CartScreen = ({ navigation }) => {
  const { cart, setCart, walletBalance, setWalletBalance } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleIncrease = (item) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  const handleDecrease = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.name === item.name);
      if (existingItem.quantity === 1) {
        return prevCart.filter((cartItem) => cartItem.name !== item.name);
      }
      return prevCart.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const processOrder = async (paymentMethod) => {
    setLoading(true);
    try {
      const payload = {
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity
        })),
        order_type: "dine_in",
        payment_status: "paid", // or pending depending on logic, but since it's mock paid
        payment_method: paymentMethod
      };

      const response = await api.post('/orders', payload);
      
      if (response.data && response.data.qr_code) {
        setCart([]);
        setShowPaymentModal(false);
        navigation.navigate('QR', { qr_code: response.data.qr_code });
      } else {
        Alert.alert('Error', 'Order placed, but no QR code was returned.');
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Order Error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSelection = (method) => {
    const totalAmount = parseFloat(calculateTotal());

    if (method === 'wallet') {
      if (walletBalance < totalAmount) {
        Alert.alert('Insufficient Funds', 'You do not have enough balance in your wallet. Please top up or use UPI.');
        return;
      }
      // Deduct from wallet
      setWalletBalance(prev => prev - totalAmount);
      Alert.alert('Payment Successful', `₹${totalAmount} deducted from wallet.`, [
        { text: 'OK', onPress: () => processOrder('wallet') }
      ]);
    } else if (method === 'upi') {
      // Simulate UPI
      Alert.alert('Payment Successful', 'UPI Payment verified successfully.', [
        { text: 'OK', onPress: () => processOrder('upi') }
      ]);
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
      </View>
      
      <View style={styles.quantityController}>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleDecrease(item)}>
          <Ionicons name="remove" size={20} color="#FF0844" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={styles.controlButton} onPress={() => handleIncrease(item)}>
          <Ionicons name="add" size={20} color="#FF0844" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF9A44', '#FC6076', '#FF0844']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 28 }} /> 
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="rgba(255,255,255,0.7)" />
            <Text style={styles.emptyText}>Your cart is empty!</Text>
            <TouchableOpacity style={styles.startOrderingButton} onPress={() => navigation.goBack()}>
              <Text style={styles.startOrderingText}>Start Ordering</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cartContainer}>
            <FlatList
              data={cart}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={renderCartItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
            
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalPrice}>${calculateTotal()}</Text>
              </View>
              <TouchableOpacity 
                style={styles.checkoutButton} 
                onPress={() => setShowPaymentModal(true)}
              >
                <Text style={styles.checkoutText}>Proceed to Payment</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Modal */}
        <Modal
          visible={showPaymentModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => !loading && setShowPaymentModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>
                {!loading && (
                  <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                    <Ionicons name="close" size={28} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
              
              <View style={styles.modalAmountContainer}>
                <Text style={styles.modalAmountLabel}>Amount to Pay</Text>
                <Text style={styles.modalAmountValue}>${calculateTotal()}</Text>
              </View>

              {loading ? (
                <View style={styles.modalLoadingContainer}>
                  <ActivityIndicator size="large" color="#FF0844" />
                  <Text style={styles.modalLoadingText}>Processing Order...</Text>
                </View>
              ) : (
                <View style={styles.paymentOptions}>
                  <TouchableOpacity 
                    style={[styles.paymentButton, styles.walletButton]} 
                    onPress={() => handlePaymentSelection('wallet')}
                  >
                    <View style={styles.paymentButtonContent}>
                      <Ionicons name="wallet" size={24} color="#4CAF50" />
                      <Text style={styles.paymentButtonText}>Pay with Wallet</Text>
                    </View>
                    <Text style={styles.walletBalanceText}>(Bal: ₹{walletBalance.toFixed(2)})</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.paymentButton, styles.upiButton]} 
                    onPress={() => handlePaymentSelection('upi')}
                  >
                    <View style={styles.paymentButtonContent}>
                      <Ionicons name="qr-code" size={24} color="#2196F3" />
                      <Text style={styles.paymentButtonText}>Pay with UPI</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 24,
  },
  startOrderingButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  startOrderingText: {
    color: '#FF0844',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItemCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF0844',
  },
  quantityController: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 4,
  },
  controlButton: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 12,
  },
  footer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  totalPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#FF0844',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#FF0844',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  modalAmountContainer: {
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  modalAmountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modalAmountValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF0844',
  },
  paymentOptions: {
    gap: 16,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  walletButton: {
    borderColor: '#E8F5E9',
    backgroundColor: '#FAFAFA',
  },
  upiButton: {
    borderColor: '#E3F2FD',
    backgroundColor: '#FAFAFA',
  },
  paymentButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  walletBalanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  modalLoadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  modalLoadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default CartScreen;

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../App';

const WalletScreen = ({ navigation }) => {
  const { walletBalance, setWalletBalance } = useContext(CartContext);
  const [amount, setAmount] = useState('');

  const handleAddMoney = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to add.');
      return;
    }

    setWalletBalance(prev => prev + value);
    Alert.alert('Success', `₹${value.toFixed(2)} added to your wallet!`);
    setAmount('');
  };

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
          <Text style={styles.headerTitle}>My Wallet</Text>
          <View style={{ width: 28 }} /> 
        </View>

        <View style={styles.content}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₹{walletBalance.toFixed(2)}</Text>
          </View>

          <View style={styles.addMoneyCard}>
            <Text style={styles.addMoneyTitle}>Top Up Wallet</Text>
            <Text style={styles.addMoneySubtitle}>Add funds to speed up your checkout</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.quickAddContainer}>
              {[100, 200, 500].map((val) => (
                <TouchableOpacity 
                  key={val} 
                  style={styles.quickAddButton}
                  onPress={() => setAmount(val.toString())}
                >
                  <Text style={styles.quickAddText}>+₹{val}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddMoney}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.addButtonText}>ADD MONEY</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  balanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: '#4CAF50',
  },
  addMoneyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  addMoneyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  addMoneySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAddButton: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAddText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    borderRadius: 50,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    overflow: 'hidden',
  },
  gradientButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});

export default WalletScreen;

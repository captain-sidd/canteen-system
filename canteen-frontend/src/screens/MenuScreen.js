import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { CartContext } from '../../App';

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop';

const CATEGORIES = ['All', 'Snacks', 'Drinks', 'Meals', 'Desserts'];

const MenuCard = ({ item, index, onAddToCart }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: Math.min(index * 50, 500),
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        friction: 6,
        delay: Math.min(index * 50, 500),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <Image
        source={{ uri: item.image_url || DEFAULT_FOOD_IMAGE }}
        style={styles.cardImage}
      />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.itemPrice}>${parseFloat(item.price).toFixed(2)}</Text>
            <Text style={[styles.itemAvailability, { color: item.is_available ? '#4CAF50' : '#F44336' }]}>
              {item.is_available ? 'Available' : 'Out of stock'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, !item.is_available && styles.addButtonDisabled]} 
            disabled={!item.is_available}
            onPress={() => onAddToCart(item)}
          >
            <Text style={styles.addButtonText}>ADD +</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const MenuScreen = ({ route, navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { cart, setCart } = useContext(CartContext);

  // When coming from Home screen, route.params might have category
  useEffect(() => {
    if (route.params?.category) {
      setSelectedCategory(route.params.category);
    }
  }, [route.params?.category]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const menuRes = await api.get('/menu');
      setMenuItems(menuRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Could not load the menu right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { 
          id: item.id || item._id, 
          name: item.name, 
          price: item.price, 
          quantity: 1
        }];
      }
    });
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.topHeader}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Menu 🍔</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#FF9A44', '#FC6076']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.loadingText}>Fetching menu...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#FFF" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <FlatList
              data={[{ id: 'header' }, ...filteredItems]}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              stickyHeaderIndices={[0]} // Makes the header (search/categories) sticky
              renderItem={({ item, index }) => {
                if (item.id === 'header') return renderHeader();
                return <MenuCard item={item} index={index - 1} onAddToCart={handleAddToCart} />;
              }}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No food found 🍔</Text>
                </View>
              )}
            />

            {totalCartItems > 0 && (
              <TouchableOpacity 
                style={styles.floatingCartButton} 
                onPress={() => navigation.navigate('Cart')}
              >
                <Ionicons name="cart" size={24} color="#FFF" />
                <Text style={styles.floatingCartText}>Cart ({totalCartItems})</Text>
              </TouchableOpacity>
            )}
          </>
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 80,
  },
  headerSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255,154,68,0.95)', // matches top of gradient
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 40,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  filterButton: {
    backgroundColor: '#FF0844',
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  categoriesWrapper: {
    marginBottom: 10,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#FFF',
  },
  categoryChipText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryChipTextActive: {
    color: '#FF0844',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardImage: {
    width: 110,
    height: '100%',
    backgroundColor: '#F0F0F0',
  },
  cardContent: {
    flex: 1,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FF0844',
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemDescription: {
    fontSize: 13,
    color: '#777',
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
  },
  itemAvailability: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#FF512F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#FF512F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonDisabled: {
    backgroundColor: '#CCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#FF0844',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingCartText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default MenuScreen;

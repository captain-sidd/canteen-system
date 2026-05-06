import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const BANNER_IMAGE = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop';

const CATEGORIES = [
  { id: '1', name: 'Snacks', icon: 'pizza-outline' },
  { id: '2', name: 'Drinks', icon: 'cafe-outline' },
  { id: '3', name: 'Meals', icon: 'restaurant-outline' },
  { id: '4', name: 'Desserts', icon: 'ice-cream-outline' },
];

const SPECIALS = [
  { id: 's1', name: 'Deluxe Burger Combo', price: '$8.99', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop' },
  { id: 's2', name: 'Spicy Noodles', price: '$6.50', image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=500&auto=format&fit=crop' },
];

const TRENDING = [
  { id: 't1', name: 'Cheese Pizza', price: '$12.00', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop' },
  { id: 't2', name: 'Cold Coffee', price: '$4.00', image: 'https://images.unsplash.com/photo-1461023058943-07cb14c4e095?q=80&w=500&auto=format&fit=crop' },
  { id: 't3', name: 'Fries', price: '$3.50', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=500&auto=format&fit=crop' },
];

const OFFERS = [
  { id: 'o1', title: '20% OFF', subtitle: 'On all Combos', color1: '#FF512F', color2: '#DD2476' },
  { id: 'o2', title: 'Free Drink', subtitle: 'With any Burger', color1: '#43cea2', color2: '#185a9d' },
];

const HomeScreen = ({ navigation }) => {
  
  const handleCategoryPress = (categoryName) => {
    navigation.navigate('Menu', { category: categoryName });
  };

  const renderHeader = () => (
    <View style={styles.topHeader}>
      <View style={styles.titleRow}>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={() => navigation.openDrawer()}
        >
          <Ionicons name="menu" size={32} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>FoodFest 🍔</Text>
          <Text style={styles.subtitle}>What are you craving today?</Text>
        </View>
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
        {renderHeader()}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Hero Banner */}
          <View style={styles.bannerContainer}>
            <Image source={{ uri: BANNER_IMAGE }} style={styles.bannerImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.bannerOverlay}
            >
              <Text style={styles.bannerTitle}>Fresh & Delicious 🍔</Text>
              <Text style={styles.bannerSubtitle}>Order your favorite meals</Text>
            </LinearGradient>
          </View>

          {/* Quick Categories */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat.id} 
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(cat.name)}
                >
                  <View style={styles.categoryIconContainer}>
                    <Ionicons name={cat.icon} size={28} color="#FF0844" />
                  </View>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Offers Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Special Offers</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {OFFERS.map(offer => (
                <LinearGradient
                  key={offer.id}
                  colors={[offer.color1, offer.color2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.offerCard}
                >
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                </LinearGradient>
              ))}
            </ScrollView>
          </View>

          {/* Today&apos;s Special */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today&apos;s Special</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {SPECIALS.map(item => (
                <View key={item.id} style={styles.specialCard}>
                  <Image source={{ uri: item.image }} style={styles.specialImage} />
                  <View style={styles.specialInfo}>
                    <Text style={styles.specialName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.specialPrice}>{item.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Trending Items */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Trending Now 🔥</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {TRENDING.map(item => (
                <View key={item.id} style={styles.trendingCard}>
                  <Image source={{ uri: item.image }} style={styles.trendingImage} />
                  <View style={styles.trendingInfo}>
                    <Text style={styles.trendingName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.trendingPrice}>{item.price}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

        </ScrollView>
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
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  titleContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFEbee',
    fontWeight: '500',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 100, // Leave space for bottom tabs
  },
  bannerContainer: {
    height: 180,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
    marginLeft: 20,
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryName: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 13,
  },
  offerCard: {
    width: 260,
    height: 120,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  offerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  offerSubtitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  specialCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  specialImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#F0F0F0',
  },
  specialInfo: {
    padding: 16,
  },
  specialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF0844',
  },
  trendingCard: {
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  trendingImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F0F0F0',
  },
  trendingInfo: {
    padding: 12,
  },
  trendingName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  trendingPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF512F',
  },
});

export default HomeScreen;

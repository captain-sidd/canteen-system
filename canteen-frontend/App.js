import React, { createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import MenuScreen from './src/screens/MenuScreen';
import CartScreen from './src/screens/CartScreen';
import QRScreen from './src/screens/QRScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import WalletScreen from './src/screens/WalletScreen';
import CustomDrawer from './src/components/CustomDrawer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Export context to share state between screens
export const CartContext = createContext();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'fast-food' : 'fast-food-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF0844',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute',
          backgroundColor: '#ffffff',
          height: 60,
          paddingBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
    </Tab.Navigator>
  );
}

function MainApp() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: 'rgba(255, 8, 68, 0.1)',
        drawerActiveTintColor: '#FF0844',
        drawerInactiveTintColor: '#888',
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -10,
        },
      }}
    >
      <Drawer.Screen 
        name="HomeTabs" 
        component={HomeTabs} 
        options={{ 
          title: 'Home',
          drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'My Profile',
          drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />
        }} 
      />
      <Drawer.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ 
          title: 'Edit Profile',
          drawerIcon: ({ color }) => <Ionicons name="create-outline" size={22} color={color} />
        }} 
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [cart, setCart] = useState([]);
  const [walletBalance, setWalletBalance] = useState(500); // Mock wallet balance
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com'
  }); // Mock user profile

  return (
    <CartContext.Provider value={{ cart, setCart, walletBalance, setWalletBalance, userProfile, setUserProfile }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="QR" component={QRScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartContext.Provider>
  );
}

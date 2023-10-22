import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screen/Home';
import Foodrecommendation from './Screen/Foodrecommendation';
import TabBarIcon from './components/TabBarIcon';
import Calculator from './components/Calculator'; 

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define a custom header for the HomeStack
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="칼로리달력"
      component={Home}
      options={{
        headerShown: false, // Hide the header for this screen
      }}
    />
    <Stack.Screen name="Calculator" component={Calculator} /> 
  </Stack.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarLabel: route.name,
          tabBarIcon: ({ focused }) => TabBarIcon(focused, route.name),
          tabBarActiveTintColor: 'black',
          tabBarActiveBackgroundColor: '#F0F8FF',
          tabBarItemStyle: {
            flex: 1,
          },
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: {
            display: 'flex',
          },
        })}
      >
        <Tab.Screen name="메인" component={HomeStack} />
        <Tab.Screen name="칼로리검색" component={Foodrecommendation} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

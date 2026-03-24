import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import FamilyScreen from './src/screens/FamilyScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A90D9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: '家庭待办' }}
        />
        <Stack.Screen 
          name="TaskDetail" 
          component={TaskDetailScreen}
          options={{ title: '任务详情' }}
        />
        <Stack.Screen 
          name="Family" 
          component={FamilyScreen}
          options={{ title: '家庭成员' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

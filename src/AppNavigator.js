import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import Signup from './Screens/Signup';
import HomeScreen from './Screens/HomeScreen';
import Comments from './Screens/Comments';
import EditProfile from './Screens/EditProfile'
import Message from './Screens/Message';
const AppNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash}  options={{headerShown: false}} /> 
        <Stack.Screen name="Login" component={Login}  options={{headerShown: false}} /> 
        <Stack.Screen name="Signup" component={Signup}  options={{headerShown: false}} /> 
        <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{headerShown: false}} /> 
        <Stack.Screen name="Comments" component={Comments}  options={{headerShown: false}} /> 
        <Stack.Screen name="EditProfile" component={EditProfile}  options={{headerShown: false}} /> 
        <Stack.Screen name="Message" component={Message}  options={{headerShown: false}} /> 
        </Stack.Navigator>
        </NavigationContainer>
      );
}

export default AppNavigator

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Home from './screens/Home';
import Stats from './screens/Stats';
import Favorites from './screens/Favorites';
import Tabs from './navigation/tabs'

const Stack = createStackNavigator();

export default function App() {
  //console.disableYellowBox = true;
  return (

    <NavigationContainer>
      <StatusBar hidden={true} />
      <Stack.Navigator 
        screenOptions={{
          headerShown: false
        }}
        initialRouteName ={"Home"}
        >
        <Stack.Screen name ="Home" component = {Tabs} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  taskWrapper:{
    paddingTop: 46,
    paddingHorizontal: 32,
    
  },
  sectionTitle:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#F56334'
  },
});

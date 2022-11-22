import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import {createBottomTabNavigator, BottomTabBar} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home'
import Favorites from '../screens/Favorites'
import Stats from '../screens/Stats'

const Tab = createBottomTabNavigator();


const FavoriteStack = createStackNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = () => {
    return(
    <HomeStack.Navigator 
        initialRouteName = "Home"
        screenOptions={{
            headerShown: false
        }}>
        <HomeStack.Screen name='Home' component={Home} options={{animationEnabled: false}}/>
        <HomeStack.Screen name='Stats' component={Stats} options={{animationEnabled: false}}/>
    </HomeStack.Navigator>
    );
}

const FavoriteStackScreen = () => {
    return(
    <FavoriteStack.Navigator 
        initialRouteName = "Favorites"
        screenOptions={{
            headerShown: false
        }}>
        <HomeStack.Screen name='Favorites' component={Favorites} options={{animationEnabled: false}}/>
        <HomeStack.Screen name='Stats' component={Stats} options={{animationEnabled: false}}/>
    </FavoriteStack.Navigator>
    );
}


const Tabs = () => {
    return(
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style:{
                    borderTopWidth: 0,
                    backgroundColor: '#1E1E1E',
                    height:100
                },
                
            }}
        >
            <Tab.Screen 
                name="Home"
                component = {HomeStackScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image 
                            source = {require('../assets/symbols/home.png')}
                            resizeMode="contain"
                            style={{
                                width:37,
                                height:37,
                                tintColor: focused ? "#F56334" : "#6B6B6B"
                            }}
                        />
                    )
                }}
            />
            <Tab.Screen 
                name="Favorites"
                component = {FavoriteStackScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Image
                            source = {require('../assets/symbols/star.png')}
                            resizeMode="contain"
                            style={{
                                width:37,
                                height:37,
                                tintColor: focused ? "#F56334" : "#6B6B6B"
                            }}
                        />
                    )
                }}
            />
            
        </Tab.Navigator>
    )
}

export default Tabs;
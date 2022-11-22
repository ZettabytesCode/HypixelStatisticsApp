import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FavoriteUser from '../components/FavoritedUsers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { out } from 'react-native/Libraries/Animated/src/Easing';

let allUsers = []

const mcAPILink = "https://api.mojang.com/users/profiles/minecraft/";
const hypixelAPILink = "https://api.hypixel.net/player?key=9610131452544accbc5570f2a56b09d5&uuid=";

const Favorites = ({navigation, route}) => {

    const [favoriteUsers, setFavoriteUsers] = React.useState([])

    const getFavorites = (input) =>{
        let output = []
        for(let i = 0; i < input.length; i++){
            output.push(<FavoriteUser key ={i} text={input[i]} navigation = {navigation}/>)
        }
        return output
    }
    
    useEffect(() => {
        getList().then((value) =>{
            setFavoriteUsers(value)
        }).catch((error) =>{
            alert("here fail")
        })
    })

    return(
        <View style = {styles.container}>
            <View style = {styles.rectangle}>
                <Text style = {styles.headerText}>Favorites</Text>
            </View>
            <ScrollView>
                <View style = {styles.favorites}>
                    {getFavorites(favoriteUsers)}
                </View>
            </ScrollView>
        </View>
    )
}

function getFavorites2(input){
    let output = []
    for(let i = 0; i < input.length; i++){
        output.push(<FavoriteUser key ={i} text={input[i]} />)
    }
    return output
}

async function getList(){
    let keys = []
    try{
        keys = await AsyncStorage.getAllKeys()
        return keys
    }catch(error){
        console.log(error)
    }
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#000000'
    },
    rectangle:{
        width: '100%',
        height: 122,
        backgroundColor: '#1E1E1E',

    },
    headerText:{
        color: '#F56334',
        flex: 1,
        paddingTop: 55,
        paddingLeft: 32,
        fontSize: 30,
        fontWeight: 'bold'
    },
    favorites:{
        paddingTop: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    box:{
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 20,
        marginBottom: 20
    },
    leftPart:{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    face:{
        height: 48, 
        width: 48,
        backgroundColor: '#6B6B6B',
        borderRadius: 10,
        marginRight: 15
    },
    textStyle:{
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F56334',
        maxWidth: '80%'
    }
})

export default Favorites;
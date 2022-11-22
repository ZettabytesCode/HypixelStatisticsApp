import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';
import SearchBar from '../components/SearchBar';

const mcAPILink = "https://api.mojang.com/users/profiles/minecraft/";
const hypixelAPILink = "https://api.hypixel.net/player?key=9610131452544accbc5570f2a56b09d5&uuid=";


const Home = ({navigation}) => {
    const [input, setInput] = React.useState("");
    return(
        <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>

        <View style = {styles.container}>
            <View style = {styles.rectangle}>
                <Text style = {styles.headerText}>Hypixel Stats App</Text>
            </View>
            <View style = {styles.search}>
                <View style = {styles.searchBar}>
                    <TextInput style = {{fontSize: 20, color: '#6B6B6B'}} 
                    placeholder = 'Type username' 
                    placeholderTextColor = '#6B6B6B'
                    returnKeyType ="search"
                    keyboardAppearance = "dark"
                    autoCompleteType = "off"
                    autoCorrect ={false}
                    maxLength = {16}
                    onChangeText={(text) => setInput(text)}
                    onSubmitEditing = {() => {
                        fetch(mcAPILink + input).then((mcResponse) => {
                            console.log(mcResponse.status)
                            if(mcResponse.status >= 200 && mcResponse.status <= 299){
                                console.log(mcResponse.status)
                                return mcResponse.json()
                            }else{
                                console.log(mcResponse.status)
                                alert("mcAPI error")
                            }
                        }).then((mcJSON) => {
                            let id = mcJSON.id
                            console.log(id)
                            fetch(hypixelAPILink + id).then((response) =>{
                                if(response.status >= 200 && response.status <= 299){
                                    return response.json()
                                }else{
                                    console.log(response.status)
                                    alert("network error")
                                    throw Error("bruh")
                                }
                            }).then((responseJson) =>{
                                //console.log(responseJson)
                                if(responseJson.success === true && responseJson.player !== null){
                                    // console.log(responseJson)
                                    // console.log("we chilling")
                                    navigation.replace("Stats", {playerJSON: responseJson, from: "Home"})
                                }else{
                                    alert("Player does not exist")
                                }
                            }).catch((error) =>{
                                alert('here is fail')
                            })
                        }).catch((error2) =>{
                            alert('there is fail')
                        }) 
                    }}/>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>

    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#000000'
    },
    rectangle:{
        width: '100%',
        height: 122,
        backgroundColor: '#1E1E1E'
    },
    headerText:{
        color: '#F56334',
        flex: 1,
        paddingTop: 55,
        paddingLeft: 32,
        fontSize: 30,
        fontWeight: 'bold'
    },
    search:{
        paddingTop: 150,
        paddingLeft: 30,
        paddingRight: 30
    },
    searchBar:{
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 15
    }
})

export default Home;
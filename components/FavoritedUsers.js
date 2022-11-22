import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { color } from 'react-native-reanimated';


const mcAPILink = "https://api.mojang.com/users/profiles/minecraft/";
const hypixelAPILink = "https://api.hypixel.net/player?key=9610131452544accbc5570f2a56b09d5&uuid=";
const faceAPILink = "https://crafatar.com/avatars/"

const FavoriteUser = (props) => {

    const [uuid, setUUID] = React.useState("6e11c1ff7da74bbba135ff838dddff66")

    React.useEffect(() =>{
        getUUID(props.text).then((id) =>{
            console.log(id)
            setUUID(id)
        }).catch((err) =>{
            alert("welp i tried")
        })
    }, [])


    return(
        <TouchableOpacity style = {styles.box} onPress ={() =>{
            fetch(mcAPILink + props.text).then((mcResponse) => {
                //console.log(mcResponse.status)
                if(mcResponse.status >= 200 && mcResponse.status <= 299){
                    //console.log(mcResponse.status)
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
                        console.log(responseJson)
                        // console.log("we chilling")
                        props.navigation.navigate("Stats", {playerJSON: responseJson, from: "Favorites"})
                    }else{
                        alert("Player does not exist")
                    }
                }).catch((error) =>{
                    console.log(error)
                })
            }).catch((error2) =>{
                alert('there is fail')
            }) 
        }}>
            <View style = {styles.leftPart}>
                <Image style = {styles.face} source ={{uri: faceAPILink + uuid}}/>
                <Text style = {styles.textStyle}>{props.text}</Text>
            </View>
        </TouchableOpacity>
    )
}

async function getUUID(name){
    return await fetch(mcAPILink + name).then((mcResponse) =>{
        if(mcResponse.status >= 200 && mcResponse.status <= 299){
            //console.log(mcResponse.status)
            return mcResponse.json()
        }else{
            console.log(mcResponse.status)
            alert("mcAPI error")
        }
    }).then((mcJSON) =>{
        return mcJSON.id
    }).catch((error2) =>{
        alert('there is fail roight here')
    }) 
}

const styles = StyleSheet.create({
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
export default FavoriteUser;
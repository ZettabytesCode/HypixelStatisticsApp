import React from 'react'
import {View, StyleSheet, TextInput} from 'react-native'

const SearchBar = ({navigation}) => {
    const [input, setInput] = React.useState("");
    return(
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
                    navigation.navigate('Stats')
                }}/>
            </View>
    )
}

const styles = StyleSheet.create({
    searchBar:{
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        padding: 15
    }
})
export default SearchBar;
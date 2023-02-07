import React, {useEffect} from 'react';
import { View, Text,Image,StyleSheet } from 'react-native'

const Splash = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      }, []);
    return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor: '#9FC8D0'}}>
            <Image source={require('../images/picasa.png')} 
             style={[styles.boxSelected,{
              width:80, height:80, marginBottom:14
            }]}/>
            <Text style={{fontSize:30,fontWeight:800 ,color:'black'}}>SocialOse</Text>
            <Text style={{fontSize:16,fontWeight:700, color:'red'}}> Social Media App</Text>
        </View>
    )
}

export default Splash
const styles = StyleSheet.create({
 
  boxSelected: {
    width:100,
    height:100,
    backgroundColor:'red',
    borderRadius:10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .7)',
        shadowOffset: { height:0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android: {
        elevation: 15
      },
    }),
  },
  
});

import React,{useState,useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity,Image,ToastAndroid, ActivityIndicator,StyleSheet} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage';
 import uuid from 'react-native-uuid'
const Signup = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
    const [email,setEmail]=useState('')
    const [name,setName]=useState('')
    const [password,setPassword]=useState('')
    const [token,setToken]=useState('')
    const[error,setError]=useState('')
    const getFcmToken = async () => {
        const fcmToken = await messaging().getToken();
        if (fcmToken) {
           console.log(fcmToken);
           setToken(fcmToken)
        } 
       }
    useEffect(()=>{
        getFcmToken()
    },[])
    const showToast = () => {
      ToastAndroid.show('Registration Successful', ToastAndroid.SHORT);
    };
  const saveDate = async() => {
    setModalVisible(true)
    let id=uuid.v4();
      if(name&&email&&password){
        firestore()
        .collection('Users')
        .doc(id)
        .set({
          name:name,
          email:email ,
          password: password,
          token:token,
          userId:id,
          followers:[],
          following:[],
          posts:[],
          profilepic:'',
          bio:''


        })
        .then(() => {
          console.log('User added!');
          showToast();
          setModalVisible(false)
          saveLocalData()
        
        }).catch((err)=>{
          setModalVisible(false)
               console.log(err)
           })



           firestore()
           .collection('tokens')
           .add({
               token:token
           }).then(()=>{
            console.log('User added!');
            navigation.navigate('Login')
           })
      }
      else{
          setError('Please fill Credentials')
      }
   
  };

  const saveLocalData=async()=>{
    await AsyncStorage.setItem('NAME', name)
    await AsyncStorage.setItem('EMAIL', email)
  }
  return (
    <View style={{flex: 1, backgroundColor: '#9FC8D0'}}>
        <Image
        source={require('../images/picasa.png')}
        style={[styles.boxSelected,{
          width: 80,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 100,
          shadowColor: "red",
          shadowOffset: { height: 20},
          shadowOpacity: 1,
        }]}
      />
      <Text
        style={{
          alignSelf: 'center',
          marginTop: 20,
          fontSize: 30,
          fontWeight: '800',
          color: 'black',
          fontFamily:'serif'
        }}>
        SocialOse
      </Text>
      <TextInput
       value={name}
       onChangeText={(txt)=>{setName(txt)}}
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          padding: 15,
          marginTop: 60,
        }}
        placeholder="Enter Name"
      />
      <TextInput
       value={email}
       onChangeText={(txt)=>{setEmail(txt)}}
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          padding: 15,
          marginTop: 20,
        }}
        placeholder="Enter Email Id"
      />
      <TextInput

       value={password}
       onChangeText={(txt)=>{setPassword(txt)}}
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          padding: 15,
          marginTop: 20,
        }}
        placeholder="Enter Password"
      />
       {error&&
      <Text style={{alignSelf:'center', marginTop:10,color:'red'}}>{error}</Text>
      }
      <TouchableOpacity
        style={{
          width: '84%',
          height: 50,
          backgroundColor: 'orange',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
        }}
        onPress={()=>saveDate()}
        >
        {!modalVisible&&<Text style={{fontSize: 18, color: 'black',   fontFamily:'monospace'}}>Create Account</Text>}
        {modalVisible&&<ActivityIndicator size="large" color="blue" />}
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
          <Text style={{fontSize:14, alignSelf:'center', textDecorationLine:'underline', marginTop:20}}>Already have an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
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

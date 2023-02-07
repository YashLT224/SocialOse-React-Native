import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
let token = '';
const Login = ({navigation}) => {
    const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken);
    }
  };
  useEffect(() => {
    getFcmToken();
  }, []);
  const showToast = () => {
    ToastAndroid.show('Login Successful', ToastAndroid.SHORT);
  };
  const saveDate = async () => {
    setModalVisible(true)
    if (email && password) {
      firestore()
        .collection('Users')
        .where('email', '==', email)
        .get()
        .then(querySnapshot => {
          console.log(querySnapshot.docs);
          if (querySnapshot.docs.length > 0) {
            console.log(querySnapshot?.docs[0]?._data);
            if (
              querySnapshot?.docs[0]?._data.email === email &&
              querySnapshot?.docs[0]?._data.password === password
            ) {
              setModalVisible(false)
              showToast();
      
              goToHome(querySnapshot?.docs[0]._data.userId)
            } else {
              setModalVisible(false)
              setError('Invalid Credentials, Please try again !');
            }
          } else {
            setModalVisible(false)
            setError('Invalid Credentials, Please try again !');
            console.log('dkkldkldklmdlksmkl');
          }
        })
        .catch(err => {
          setModalVisible(false)
          console.log(err);
        });
    } else {
      setError('Please fill credentials');
    }
  };

  const goToHome=async(userId)=>{
    await AsyncStorage.setItem('USERID',userId)
    await AsyncStorage.setItem('PROFILE','')
    navigation.navigate('HomeScreen');
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
          fontFamily: 'serif',
        }}>
        SocialOse
      </Text>

      <TextInput
        value={email}
        onChangeText={txt => {
          setEmail(txt);
        }}
        style={{
          width: '90%',
          height: 50,
          borderRadius: 10,
          borderWidth: 0.5,
          alignSelf: 'center',
          padding: 15,
          marginTop: 80,
        }}
        placeholder="Enter EmailId"
      />
      <TextInput
        value={password}
        onChangeText={txt => {
          setPassword(txt);
        }}
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
      {error && (
        <Text style={{alignSelf: 'center', marginTop: 10, color: 'red'}}>
          {error}
        </Text>
      )}
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
        onPress={() => saveDate()}>
        {!modalVisible&&<Text style={{fontSize: 18, color: 'black', fontFamily: 'monospace'}}>
          LOGIN
        </Text>}
         {modalVisible&&<ActivityIndicator size="large" color="blue" />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text
          style={{
            fontSize: 14,
            alignSelf: 'center',
            textDecorationLine: 'underline',
            marginTop: 20,
          }}>
          Create New Account
          
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

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

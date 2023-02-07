import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
const EditProfile = ({navigation}) => {
  const [imageData, setImagedata] = useState(null);
  const [imagePicked, setImagePicked] = useState(false);
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [bio,setBio]=useState('')
  const openCamera = async () => {
    const result = await launchCamera({mediaType: 'photo'});
    setImagedata(result);
    console.log(result);
  };

  const requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Kinexx App Camera Permission',
          message:
            'Kinexx App needs access to your camera' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openCamera();
      } else {
        console.log('Camera permissions denied');
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    getUserData();
  },[])

  const getUserData=async()=>{
    const userId = await AsyncStorage.getItem('USERID');
    firestore()
    .collection('Users')
    .doc(userId)
    .get()
    .then((data)=>{
         console.log(data._data.profilepic,"dp")
         if(data._data.profilepic){
           console.log(true,"dp")
         }
         else{
          console.log(false,"dp")
         }
         setName(data._data.name)
         setEmail(data._data.email)
         setBio(data._data.bio)
         setImagedata(data._data.profilepic?data._data.profilepic:null)
    })
  }

  console.log(imageData,"dp")
  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    setImagedata(result);
  };

  const uploadProfilePic = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    let url=''
if(imagePicked){
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
     url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
}
    
    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        profilepic:imagePicked?url:imageData,
        bio:bio,
        name:name,
        email:email
      })
      .then(() => {
        console.log('post added!');
        navigation.goBack();
        //   getAllTokens();
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log(imageData,"imgdata")

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: 60,
          alignItems: 'center',
          paddingLeft: 20,
          backgroundColor: '#fff',
          borderBottomColor: '#8e8e8e',
          borderBottomWidth: 0.5,
        }}>
        <Image
          style={{width: 30, height: 30, marginRight: 10}}
          source={require('../images/picasamin.png')}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'black',
            fontFamily: 'serif',
          }}>
          SocialOse
        </Text>
      </View>

      <TouchableOpacity
        style={{
          width: 100,
          height: 100,
          alignSelf: 'center',
          marginTop: 50,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          openGallery();
          setImagePicked(true);
        }}>
        {imageData !== null ? (
          <Image
            style={{width: 150, height: 150, borderRadius: 80, margin: 10}}
            source={{uri: imageData?.assets?imageData?.assets[0]?.uri:imageData}}
          />
        ) : (
          <Image
            style={{width: 100, height: 100, borderRadius: 10, margin: 10}}
            source={require('../images/userdummy.png')}
          />
        )}
      </TouchableOpacity>
      
       <TextInput
         
          value={name}
          onChangeText={txt => setName(txt)}
          style={{width: '94%', marginLeft: 10,marginTop:20, borderColor:'gray', borderBottomWidth:0.5}}
          placeholder="Edit Name."
        />
         <TextInput
        
          value={email}
          onChangeText={txt => setEmail(txt)}
          style={{width: '94%', marginLeft: 10, borderColor:'gray', borderBottomWidth:0.5}}
          placeholder="Edit Email"
        />
         <TextInput
        
          value={bio}
          onChangeText={txt => setBio(txt)}
          style={{width: '94%', marginLeft: 10, borderColor:'gray', borderBottomWidth:0.5}}
          placeholder="Edit Bio"
        />
        
        <TouchableOpacity
          style={{
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 5,
            width: 180,
            alignSelf: 'center',
            marginTop: 40,
          }}
          onPress={() => {
            uploadProfilePic()
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 16,
              paddingLeft: 40,
              paddingVertical: 3,
            }}>
            update profile
          </Text>
        </TouchableOpacity>
     
    </View>
  );
};

export default EditProfile;

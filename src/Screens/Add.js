import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  Modal,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid'
let token = '';
let name = '';
let email = '';
const Add = ({setSelectedtab}) => {
  const [imageData, setImagedata] = useState(null);
  const [caption, setCaption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const getFcmToken = async () => {
    token = await messaging().getToken();
    name = await AsyncStorage.getItem('NAME');
    email = await AsyncStorage.getItem('EMAIL');
  };
  useEffect(() => {
    getFcmToken();
  }, []);

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

  const openGallery = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});
    setImagedata(result);
  };

  const uploadImage = async () => {
    setModalVisible(true)
    let id=uuid.v4()
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    const userId=await AsyncStorage.getItem('USERID')
    // uploads file
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);

    if (imageData !== null) {
      console.log('sd');
      firestore()
        .collection('Posts')
        .doc(id)
        .set({
          image: url,
          caption: caption,
          email: email,
          name: name,
          userId:userId,
          postId:id,
          likes:[],
          comments:[]
        })
        .then(() => {
          console.log('post added!');
        //   getAllTokens();
        setModalVisible(false);
        setSelectedtab('Home')
        })
        .catch(err => {
          setModalVisible(!modalVisible);
          console.log(err);
        });
    }
  };

  const getAllTokens=()=>{
      let tempTokens=[];
      firestore()
      .collection('tokens')
      .get()
      .then(querySnapshot=>{
          querySnapshot.forEach(documentSnapshot=>{

           // tempTokens.push(documentSnapshot.data().token)
            //   sendNotifications(documentSnapshot.data().token);
          });
        //   sendNotifications(tempTokens)
      })
  }

//   const sendNotifications=async (token)=>{
    // var axios = require('axios');
    // var data = JSON.stringify({
    // data: {},
    // notification: {
    // body: 'click to open check Post',
    // title: 'New Post Added',
    // },
    // to: token,
    // });
    // var config = {
    // method: 'post',
    // url: 'https://fcm.googleapis.com/fcm/send',
    // headers: {
    // Authorization:
    // 'key=BJxCXqbz_VD8DDY05bn72g9HASt54mZqT-4tvYg0zrJqQ3SoM2N-pGAw802pMbP1641jfK3cmOImtNgQ7lfogyA,
    // 'Content-Type': 'application/json',
    // },
    // data: data,
    // };
    // axios(config)
    // .then(function (response) {
    // console.log(JSON.stringify(response.data));
    // })
    // .catch(function (error) {
    // console.log(error);
    // });
//   }

  return (
    <View style={{flex: 1}}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
          <ActivityIndicator size="large" color="blue" />
             
          </View>
        </View>
      </Modal>
      <View
        style={{
          width: '100%',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          borderBottomWidth: 0.5,
          borderBottomColor: '#8e8e8e',
        }}>
        <Text style={{marginLeft: 20, fontSize: 20}}>Add Post</Text>
        <TouchableOpacity
          style={{
            backgroundColor: imageData !== null ? '#25a9f5' : '#999999',
            marginRight: 10,
          }}
          onPress={() => {
            if (imageData !== null && caption !== '') {
              uploadImage();
            } else {
              Alert.alert('Please fill all the details');
            }
          }}>
          <Text
            style={{
              paddingHorizontal: 12,
              paddingVertical: 9,
              fontSize: 16,
              color: imageData !== null ? '#fff' : 'black',
            }}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          width: '90%',
          height: 150,
          borderWidth: 1,
          borderRadius: 10,
          alignSelf: 'center',
          marginTop: 20,
          flexDirection: 'row',
          borderColor: '#8e8e8e',
        }}>
        {imageData !== null ? (
          <Image
            style={{width: 50, height: 50, borderRadius: 10, margin: 10}}
            source={{uri: imageData.assets[0].uri}}
          />
        ) : (
          <Image
            style={{width: 50, height: 50, borderRadius: 10, margin: 10}}
            source={require('../images/imageplaceholder.png')}
          />
        )}

        <TextInput
          value={caption}
          onChangeText={txt => {
            setCaption(txt);
          }}
          placeholder="type caption here.."
          style={{width: '70%'}}
        />
      </View>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderBottomWidth: 0.2,
          borderBottomColor: '#8e8e8e',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={() => requestPermission()}>
        <Image
          source={require('../images/camera.png')}
          style={{width: 24, height: 24, marginLeft: 20}}
        />
        <Text style={{marginLeft: 10}}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderBottomWidth: 0.2,
          borderBottomColor: '#8e8e8e',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={() => openGallery()}>
        <Image
          source={require('../images/Gallery.png')}
          style={{width: 24, height: 24, marginLeft: 20}}
        />
        <Text style={{marginLeft: 10}}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Add;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    width:'100%',
    backgroundColor:'gray',
    opacity:0.8
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  
  
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
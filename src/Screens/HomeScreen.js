import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import Home from './Home';
import Search from './Search';
import Add from './Add';
import Chat from './Chat';
import Profile from './Profile';
import HomeMain from './HomeMain'
const HomeScreen = () => {
  const [selectedTab, setSelectedtab] = useState('Home');
  const [imageData, setImagedata] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
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

  const uploadImage = async () => {
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    // uploads file
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
  };
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //         {imageData!==null&&
  //         <Image source={{uri:imageData.assets[0].uri}}
  //         style={{width:200,height:200,marginBottom:30}}
  //         />
  //         }
  //       <TouchableOpacity
  //         style={{
  //           width: 200,
  //           height: 50,
  //           borderRadius: 10,
  //           borderWidth: 0.5,
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}
  //         onPress={()=>requestPermission()}>

  //         <Text>Open Camera</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={{
  //           width: 200,
  //           height: 50,
  //           borderRadius: 10,
  //           borderWidth: 0.5,
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //         }}
  //         onPress={()=>uploadImage()}>
  //         <Text>Upload Image</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  return (
    <View style={{flex: 1}}>
      {selectedTab === 'Home' ? (

        <HomeMain setSelectedtab={setSelectedtab} />
      ) : selectedTab === 'Search' ? (
        <Search setSelectedtab={setSelectedtab} />
      ) : selectedTab === 'Add' ? (
        <Add setSelectedtab={setSelectedtab} />
      ) : selectedTab === 'Chat' ? (
        <Chat setSelectedtab={setSelectedtab} />
      ) : (
        <Profile setSelectedtab={setSelectedtab} />
      )}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: 70,
          width: '100%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: 10,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setSelectedtab('Home')}>
          <Image
            style={{width: 26, height: 26}}
            source={
              selectedTab === 'Home'
                ? require('../images/homefilled.png')
                : require('../images/home.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setSelectedtab('Search')}>
          <Image
            style={{width: 26, height: 26}}
            source={require('../images/search.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setSelectedtab('Add')}>
          <Image
            style={{width: 26, height: 26}}
            source={
              selectedTab === 'Add'
                ? require('../images/addfilled.png')
                : require('../images/add.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setSelectedtab('Chat')}>
          <Image
            style={{width: 26, height: 26}}
            source={
              selectedTab === 'Chat'
                ? require('../images/chatfilled.png')
                : require('../images/chat.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '20%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setSelectedtab('Profile')}>
          <Image
            style={{width: 26, height: 26}}
            source={
              selectedTab === 'Profile'
                ? require('../images/userfilled.png')
                : require('../images/user.png')
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

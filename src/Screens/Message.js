import {useRoute} from '@react-navigation/native';
import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
const Message = ({navigation}) => {
  const route = useRoute();
  const [messages, setMessages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  console.log(route);
  useEffect(() => {
    const queryChats = firestore()
      .collection('chats')
      .doc('123456789')
      .collection('messages')
      //   .where('senderId', '==', route.params?.myId)
      //   .where('receiverId', '==', route.params?.userId)
      //   .where('receiverId', '==', route.params?.myId)
      //   .where('senderId', '==', route.params?.userId)
      .orderBy('createdAt', 'desc');
    queryChats.onSnapshot(snapshot => {
      const allMessages = snapshot.docs.map(snap => {
        return {
          //   ...snap.data(),
          //  createdAt: firestore.FieldValue.serverTimestamp(),
          ...snap.data(),
          createdAt: new Date(),
        };
      });
      setMessages(allMessages);
    });


  }, []);

 

  const onSend = messageArray => {
    console.log('fsfsf');
    let myMsg = null;
    if (imageUrl !== '') {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.myId,
        receiverId: route.params.userId,
        image: imageUrl,
        user: {
            _id: route.params.myId,
            name: route.params.name,
            avatar: route.params.profile||'https://placeimg.com/140/140/any',
          },
      };
    } else {
      const msg = messageArray[0];
      myMsg = {
        ...msg,
        senderId: route.params.myId,
        receiverId: route.params.userId,
        image: '',
        user: {
            _id: route.params.myId,
            name: route.params.name,
            avatar: route.params.profile||'https://placeimg.com/140/140/any',
          },
      };
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));
    firestore()
      .collection('chats')
      .doc('123456789')
      .collection('messages')
      .add({
        ...myMsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    setImageUrl('');
    setImageData(null);
  };
  const openCamera = async () => {
    // const result = await launchCamera({mediaType: 'photo'});
    // if (result.didCancel && result.didCancel == true) {
    // } else {
    //   setImageData(result);
    // //   uplaodImage(result);
    // }
    const result = await launchImageLibrary({mediaType: 'photo'});
    console.log(result)
    setImageData(result);
    uplaodImage(result);
  };
  const uplaodImage = async imageDataa => {

    const reference = storage().ref(imageData?.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    // uploads file
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
    setImageUrl(url);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
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
            <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Image
          style={{width: 25, height: 25, marginRight: 10}}
          source={require('../images/arrow-left.png')}
        />
            </TouchableOpacity>
       
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'black',
            fontFamily: 'serif', 
            textTransform: 'capitalize',
          }}>
          {route.params.name}
        </Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params?.myId,
        }}
        alwaysShowSend={true}
        renderSend={props => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
   {imageUrl&&<TouchableOpacity  onPress={() => {
                    openCamera();
                    }}
                 >
                <Image
                  style={{
                    width: 37,
                    height: 37,
                    marginRight: 10,
                    marginBottom: 3,
                 
                  }}   
                  source={{uri:imageData?.assets[0].uri}}
                />
              </TouchableOpacity>}
                  
              <TouchableOpacity  onPress={() => {
                    openCamera();
                    }}
                  source={require('../images/Gallery.png')}>
                <Image
                  style={{
                    width: 27,
                    height: 27,
                    marginRight: 10,
                    marginBottom: 3,
                    tintColor: 'gray',
                  }}
                 
                  source={require('../images/Gallery.png')}
                />
              </TouchableOpacity>
              <Send {...props}>
                <Image
                  style={{
                    width: 34,
                    height: 34,
                    marginRight: 10,
                    marginBottom: 5,
                  }}
                  source={require('../images/send.png')}
                />
              </Send>
            </View>
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{
                backgroundColor: '#f0f1f2',
                borderRadius: 10,
              }}></InputToolbar>
          );
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{right: {backgroundColor: 'purple'}}}
            />
          );
        }}
       />
    </View>
  );
};

export default Message;

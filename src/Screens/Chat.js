import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, Text,TouchableOpacity,Image,FlatList, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore';
let userId
const Chat = () => {
    const navigation=useNavigation();
    const [users, setUsers] = useState([]);
    const [loader,setLoader]=useState(true)
    useEffect(() => {
        getUsers();
      }, []);
    
      const getUsers = async () => {
        userId = await AsyncStorage.getItem('USERID');
        firestore()
          .collection('Users')
          .where('userId', '!=', userId)
          .get()
          .then(querySnapShot => {
            
            if (querySnapShot._docs.length > 0) {
              let k = [];
              for (let i = 0; i < querySnapShot._docs.length; i++) {
                k.push(querySnapShot._docs[i]._data);
              }
              setLoader(false)
              setUsers(k);
            }
          })
          .catch(err => {
            console.log(err);
          });
      };



    return (
        <View style={{flex:1}}>
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'black',
            fontFamily: 'serif',
          }}>
          Messages
        </Text> 
      </View>
     { loader?<ActivityIndicator style={{marginTop:20}} size="large" color="blue" />:users.length>0? <FlatList
        contentContainerStyle={{margin: 10}}
        showsVerticalScrollIndicator={false}
        data={users}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: '100%',
                height: 60,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal:10,
              }}>
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginHorizontal: 10,
                  }}
                  source={
                    item?.profilepic === ''
                      ? require('../images/userdummy.png')
                      : {uri: item.profilepic}
                  }
                />
                <Text style={{fontSize: 17, textTransform: 'capitalize'}}>
                  {item.name}
                </Text>
              </View> */}
               <View
                    style={{
                      height: 60,
                      width:'100%',
                      flexDirection: 'row',
                      alignItems:'center',
                      justifyContent:'space-between',
                    
                     
                    }}>
                      <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image
                      style={{width: 30, height: 30, marginRight: 20}}
                      source={
                        item?.profilepic === ''
                          ? require('../images/userdummy.png')
                          : {uri: item.profilepic}
                      }
                    />
                    <Text
                      style={{
                        color: 'black',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        fontSize: 16,
                      }}>
                      {item.name}
                    </Text>
                    </View>
                    <View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Message',{myId:userId,userId:item.userId,name:item.name,profile:item.profile})}>
                     <Image style={{width:30, height:30,}} source={require('../images/chatmsg.png')}/>
                    </TouchableOpacity>
                    </View>
                  </View>
            
            </View>
          );
        }}
      />:<View style={{marginTop:25}}>
          <Text style={{color:'black', fontSize:18}}>Nothing Found</Text>
          </View>}
    </View>
    )
}

export default Chat

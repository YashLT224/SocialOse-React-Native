import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
 
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

let userId = '';
const Search = () => {
  const [users, setUsers] = useState([]);
  const [currentuser, setCurrentUser] = useState({});
  const [keyword,setKeyword]=useState('')
  const [onFollowClick, setOnFollowClick] = useState(false);
  useEffect(() => {
    getCurrentuser();
    getUsers();
  }, [onFollowClick]);

  useEffect(()=>{
 
    getUsers();
  },[keyword])
  const getCurrentuser=async()=>{
    userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      .where('userId', '==', userId)
      .get()
      .then(querySnapShot => {
        setCurrentUser(querySnapShot._docs[0]._data);
         
      })
      .catch(err => {
        console.log(err);
      });
  }

  const getUsers = async () => {
    userId = await AsyncStorage.getItem('USERID');
   
    if(keyword){
     
      firestore()
      .collection('Users')
      .where('name', '==', keyword)
      .get()
      .then(querySnapShot => {
        
        if (querySnapShot._docs.length > 0) {
          let k = [];
          for (let i = 0; i < querySnapShot._docs.length; i++) {
            k.push(querySnapShot._docs[i]._data);
          }
         
          setUsers(k);
        }
        else{
          setUsers([])
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
     
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
         
          setUsers(k);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  
  };


  const followUser = async (item) => {
      
    let tempFollowers = item.followers;
    let tempFollowing = [];
    const snapShot = await firestore().collection('Users').doc(userId).get();
    tempFollowing = snapShot._data.following;
    

    if(tempFollowing.length>0){
        let index=-1;
        for(let i=0;i<tempFollowing.length;i++){
                if(tempFollowing[i].userId===item.userId){
                    index=i;
                    break;
                }
        }
        
        if(index>-1){
            tempFollowing.splice(index, 1);
        }
        else{
            tempFollowing.push({
                userId: item.userId,
                name: item.name,
                profile: item.profilepic,
              });
        }

    }else{
         tempFollowing.push({
            userId: item.userId,
            name: item.name,
            profile: item.profilepic,
          });
    }

    // if (tempFollowing.length > 0) {
    //   tempFollowing.map(item2 => {
    //     if (item2.userId === item.userId) {
    //         console.log('........')
    //       let index = tempFollowing.map((x, i) => {
    //         if (x.userId === item.userId) {
    //           index = i;
    //         }
    //       });
    //       if (index > -1) {
    //         tempFollowing.splice(index, 1);
    //       } else {
    //         // tempFollowing.push({
    //         //   userId: item.userId,
    //         //   name: item.name,
    //         //   profile: item.profilepic,
    //         // });
    //       }
    //     } else {
    //         console.log("scnm cnb mndbnmcbdmn")
    //         // tempFollowing.push({
    //         //     userId: item.userId,
    //         //     name: item.name,
    //         //     profile: item.profilepic,
    //         //   });
    //     }
    //   });
    // } else {
    //     // tempFollowing.push({
    //     //     userId: item.userId,
    //     //     name: item.name,
    //     //     profile: item.profilepic,
    //     //   });
    // }

    
    firestore()
      .collection('Users')
      .doc(userId)
      .update({
        following: tempFollowing,
      })
      .then(data => {
        
      })
      .catch(Err => {
        console.log(Err);
      });
    if (tempFollowers.length > 0) {
      tempFollowers.map(item1 => {
        if (item1.userId === userId) {

        //   let index = tempFollowers.indexOf(userId);
          let index = tempFollowers.map((x, i) => {
            if (x.userId ===userId) {
              index = i;
            }
          });
          if (index > -1) {
            tempFollowers.splice(index, 1);
          } else {
          }
        } else {
          tempFollowers.push({
            userId: currentuser.userId,
            name: currentuser.name,
            profile: currentuser.profilepic,
          });
        }
      });
    } else {
      tempFollowers.push({
        userId: currentuser.userId,
        name: currentuser.name,
        profile: currentuser.profilepic,
      });
    }
    firestore()
      .collection('Users')
      .doc(item.userId)
      .update({
        followers: tempFollowers,
      })
      .then(data => {
        
      })
      .catch(Err => {
        console.log(Err);
      });
    setOnFollowClick(!onFollowClick);
    getUsers();
  };
  const getFollowStatus = followers => {
    let status = false;
    if (followers.length > 0) {
      followers.map(item => {
        if (item.userId === userId) {
          status = true;
        } else {
          status = false;
        }
      });
    }

    return status;
  };
  return (
    <View style={{flex: 1}}>
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
      <TextInput
          value={keyword}
          onChangeText={txt => {
            setKeyword(txt);
          }}
          placeholder="Search friends.."
          style={{width: '100%', borderRadius:1, borderBottomWidth:1, borderColor:'lightgray'}}
        />
      <FlatList
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
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
              </View>
              <TouchableOpacity
                style={{
                  marginRight: 20,
                  backgroundColor: '#0099ff',
                  height: 40,
                  borderRadius: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => followUser(item)}>
                <Text style={{color: 'white', marginHorizontal: 10}}>
                  {getFollowStatus(item.followers) ? 'Unfollow' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Search;

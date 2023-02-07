import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
let userId=''
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [profile, setProfile] = useState(false);
  const [activebtn, setActiveBtn] = useState('posts');
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    getUserData();
    getAllPosts();
  }, []);

  const getUserData = async () => {
     userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(data => {
        console.log(data._data);
        setUserData(data._data);
        if (data._data.profilepic !== '') {
          setProfile(true);
        }
      });
  };

  const getAllPosts = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    console.log(userId)
    firestore()
      .collection('Posts')
      .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        console.log(querySnapshot)
        if (querySnapshot._docs.length > 0) {
          let p = [];
          for (let i = 0; i < querySnapshot._docs.length; i++) {
            p.push(querySnapshot._docs[i]._data.image);
          }
          setPosts(p);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log(posts,"post")
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
        <TouchableOpacity
          style={{position: 'absolute', right: 10}}
          onPress={() => navigation.navigate('Login')}>
          <Text>LOG OUT</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 20,
            marginLeft: 10,
            marginBottom: 10,
            borderRadius: 50,
          }}>
          {profile ? (
            <Image
              source={{uri: userData.profilepic}}
              style={{width: 90, height: 90, borderRadius: 50}}
            />
          ) : (
            <Image
              source={require('../images/userdummy.png')}
              style={{width: 90, height: 90, marginLeft: 10, borderRadius: 50}}
            />
          )}
        </TouchableOpacity>
        <View style={{marginHorizontal: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 17, color: 'black', fontWeight: 600}}>
            Followers
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontWeight: 600,
              marginTop: 15,
            }}>
            {userData?.followers.length}
          </Text>
        </View>
        <View style={{marginHorizontal: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 17, color: 'black', fontWeight: 600}}>
            Following
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontWeight: 600,
              marginTop: 15,
            }}>
            {userData?.following.length}
          </Text>
        </View>
        <View style={{marginHorizontal: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 17, color: 'black', fontWeight: 600}}>
            Posts
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontWeight: 600,
              marginTop: 15,
            }}>
            {posts.length}
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginLeft: 10,
          color: 'black',
          fontSize: 16,
          textTransform: 'capitalize',
          fontWeight: 600,
        }}>
        {userData?.name}
      </Text>
      <Text
        style={{marginLeft: 10, color: 'black', fontSize: 14, fontWeight: 400}}>
        {userData?.bio}
      </Text>

      <TouchableOpacity
        style={{
          width: '95%',
          height: 30,
          backgroundColor: '#08c7fc',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginLeft: 10,
          marginTop: 20,
        }}
        onPress={() => navigation.navigate('EditProfile')}>
        <Text style={{color: '#fff', fontSize: 15}}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginLeft: 14, marginTop: 10}}>
        <TouchableOpacity
          style={{
            backgroundColor: activebtn === 'posts' ? 'gray' : 'lightgray',
            borderRadius: 8,
            marginRight: 15,
          }}
          onPress={() => setActiveBtn('posts')}>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 28,
              fontSize: 16,
              paddingVertical: 7,
            }}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: activebtn === 'followers' ? 'gray' : 'lightgray',
            borderRadius: 8,
            marginRight: 15,
          }}
          onPress={() => setActiveBtn('followers')}>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 25,
              fontSize: 16,
              paddingVertical: 7,
            }}>
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: activebtn === 'following' ? 'gray' : 'lightgray',
            backgroundColor: 'lightgray',
            borderRadius: 8,
          }}
          onPress={() => setActiveBtn('following')}>
          <Text
            style={{
              color: 'black',
              paddingHorizontal: 25,
              fontSize: 16,
              paddingVertical: 7,
            }}>
            Following
          </Text>
        </TouchableOpacity>
      </View>
      {activebtn === 'posts' && (
        <View>
          {posts.length >0? (
            <View>
              <FlatList
                contentContainerStyle={{margin: 10}}
                numColumns={3}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                data={posts}
                renderItem={({item, index}) => {
                  return (
                    <View style={{margin: 6}}>
                      <Image
                        style={{width: 118, height: 118}}
                        source={{uri: item}}
                      />
                    </View>
                  );
                }}
              />
            </View>
          ) : (
            <Text style={{marginTop: 50, alignSelf: 'center'}}>
              You Have 0 Posts
            </Text>
          )}
        </View>
      )}
      {activebtn === 'followers' && (
        <View>
          {userData.followers.length > 0 ? (
            <FlatList
              contentContainerStyle={{margin: 20}}
              showsVerticalScrollIndicator={false}
              data={userData.followers}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      height: 60,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent:'space-between'
                    }}>
                     <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image
                      style={{width: 30, height: 30, marginRight: 20}}
                      source={
                        item?.profile === ''
                          ? require('../images/userdummy.png')
                          : {uri: item.profile}
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
                );
              }}
            />
          ) : (
            <Text style={{marginTop: 50, alignSelf: 'center'}}>
              You Have 0 Followers
            </Text>
          )}
        </View>
      )}

      {activebtn === 'following' && (
        <View>
          {userData.following.length > 0 ? (
            <FlatList
              contentContainerStyle={{margin: 20}}
              showsVerticalScrollIndicator={false}
              data={userData.following}
              renderItem={({item, index}) => {
                return (
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
                        item?.profile === ''
                          ? require('../images/userdummy.png')
                          : {uri: item.profile}
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
                );
              }}
            />
          ) : (
            <Text style={{marginTop: 50, alignSelf: 'center'}}>
              You Have 0 Followers
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default Profile;

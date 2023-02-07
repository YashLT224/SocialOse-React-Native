import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity,ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let userId = '';
const Home = ({setSelectedtab}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [postData, setPostData] = useState([]);
  const [onLikeClick, setOnLikeClick] = useState(false);

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
  };

  const getLikesStatus = likes => {
    let status = false;
    if (likes.length > 0) {
      likes.map(item => {
        if (item === userId) {
          status = true;
        } else {
          status = false;
        }
      });
    }

    return status;
  };

  const onLike = item => {
    let tempLikes = item.likes;
    if (tempLikes.length > 0) {
      tempLikes.map(item1 => {
        if (item1 == userId) {
          let index = tempLikes.indexOf(item1);
          if (index > -1) {
            tempLikes.splice(index, 1);
          }
        } else {
          tempLikes.push(userId);
        }
      });
    } else {
      tempLikes.push(userId);
    }

    firestore()
      .collection('Posts')
      .doc(item.postId)
      .update({
        likes: tempLikes,
      })
      .then(() => {
        console.log('like added!');
        setOnLikeClick(!onLikeClick);
        //   getAllTokens();
      })
      .catch(err => {
        console.log(err);
      });
  };
  useEffect(() => {
    getUserId();
    getData();
  }, [onLikeClick]);
  const getData = () => {
  setModalVisible(true)
    console.log('dbj');
    let tempData = [];
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total posts:', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
        });
        setModalVisible(false)
        setPostData([...tempData]);
      })
      .catch(err => {
        setModalVisible(false)
        console.log(err);
      });
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
      { modalVisible?<ActivityIndicator style={{marginTop:20}} size="large" color="blue" />: postData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={postData}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '97%',
                  height: 490,
                  alignSelf: 'center',
                  marginTop: 20,
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  marginBottom: postData.length - 1 === index ? 90 : 0,
                }}>
                {/* <Image
                  source={{uri: item.image}}
                  style={{width: '100%', height: '100%'}}
                /> */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                    paddingBottom: 5,
                    borderBottomColor: 'grey',
                    borderBottomWidth: 0.4,
                  }}>
                  <Image
                    source={require('../images/userdummy.png')}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginLeft: 12,
                    }}
                  />
                  <Text
                    style={{
                      marginLeft: 12,
                      textTransform: 'capitalize',
                      fontWeight: 700,
                      color: 'black',
                      fontSize: 18,
                    }}>
                    {item.name}
                  </Text>
                </View>
                <Image
                  source={{uri: item.image}}
                  style={{width: '100%', height: 300, alignSelf: 'center'}}
                  
                />
                <View style={{flexDirection: 'row', margin: 10}}>
                  <TouchableOpacity onPress={() => onLike(item)}>
                    {getLikesStatus(item.likes) ? (
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../images/heartred.png')}
                      />
                    ) : (
                      <Image
                        style={{width: 25, height: 25}}
                        source={require('../images/heart.png')}
                      />
                    )}
                    {/* <Image
                      style={{width: 25, height: 25}}
                      source={require('../images/heart.png')}
                    /> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('Comments', {post: item})
                    }>
                    <Image
                      style={{width: 25, marginLeft: 10, height: 25}}
                      source={require('../images/comment.png')}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      color: 'black',
                      fontWeight: 700,
                    }}>
                    {item.likes.length} likes
                  </Text>
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      color: 'gray',
                      fontWeight: 700,
                    }}>
                    {item.comments.length} comments
                  </Text>
                </View>

                <View style={{flexDirection: 'row', margin: 10}}>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      marginRight: 4,
                      fontSize: 16,
                    }}>
                    {item.name} :
                  </Text>
                  <Text style={{fontSize: 16}}>{item.caption}</Text>
                </View>
                <TouchableOpacity
                  style={{marginLeft: 10}}
                  onPress={() => navigation.navigate('Comments', {post: item})}>
                  <Text>View all {item.comments.length} comments</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 16}}>No Post Found</Text>
          <Text style={{fontSize: 16}}>Please Add Posts on Your Feed</Text>
          <TouchableOpacity
            style={{
              marginTop: 25,
              borderRadius: 6,
              borderColor: 'black',
              borderWidth: 3,
              paddingVertical: 6,
              paddingHorizontal: 20,
            }}
            onPress={() => setSelectedtab('Add')}>
            <Text style={{fontSize: 16, color: 'black', fontWeight: 700}}>
              Add Post
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Home;

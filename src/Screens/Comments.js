import React, {useState, useEffect,useRef} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {TextInput} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
let userId = '';
let comments = [];
const Comments = ({navigation}) => {
  const route = useRoute();
  const inputRef=useRef();
  const post = route.params.post;
  comments = post.comments;
  const [comment, setComment] = useState('');
  const [commentlist, setCommentlist] = useState(post.comments);
  console.log(post);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID');
  };
  const postComment = () => {
    let temComments = comments;
    temComments.push({
      userId: userId,
      comment: comment,
      postId: post.postId,
      userName: post.name,
    });
    firestore()
      .collection('Posts')
      .doc(post.postId)
      .update({
        comments: temComments,
      })
      .then(() => {
        console.log('comment added!');
        // navigation.goBack();
        getAllComments();
      })
      .catch(err => {
        console.log(err);
      });
      inputRef.current.clear();
  };

  const getAllComments=()=>{
    firestore()
    .collection('Posts')
    .doc(post.postId)
    .get()
    .then((doc)=>{
        setCommentlist(doc.data().comments)
    }) .catch(err => {
      console.log(err);
    });
  }
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
      {post.comments.length < 1 ? (
        <Text style={{alignSelf: 'center', fontSize: 15, marginTop: '70%'}}>
          Add your Comment on the Post
        </Text>
      ) : (
        <View>
            <FlatList
          showsVerticalScrollIndicator={false}
          data={commentlist}
          renderItem={({item, index}) => {
            return (<View style={{width:'100%', flexDirection:'row', alignItems:'center', marginHorizontal:10, marginVertical:5}}>
                <Image style={{width:35, height:35}} source={require('../images/userdummy.png')}/>
                <Text style={{fontSize:16, marginHorizontal:10, textTransform:'capitalize', color:'black', fontWeight:700}}>{item.userName} : </Text>
                <Text>{item.comment}</Text>
                 </View>)
          }}/>
        </View>
      )}
      <View
        style={{
          backgroundColor: 'white',
          height: 60,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TextInput
        ref={inputRef}
          value={comment}
          onChangeText={txt => setComment(txt)}
          style={{width: '85%', marginLeft: 10}}
          placeholder="type comment here.."
        />
        <TouchableOpacity onPress={() => postComment()}>
          <Image
            style={{width: 40, height: 40, marginRight: 10}}
            source={require('../images/send.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Comments;

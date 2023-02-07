import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Home = ({setSelectedtab}) => {
  const [postData, setPostData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    let tempData = [];
    firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total posts:', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
        });
        setPostData([...tempData]);
      })
      .catch(err => {
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
      {postData.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={postData}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  width: '97%',
                  height: 300,
                  alignSelf: 'center',
                  marginTop: 20,
                  backgroundColor:'#fff',
                  borderRadius:10
                }}>
                {/* <Image
                  source={{uri: item.image}}
                  style={{width: '100%', height: '100%'}}
                /> */}
                <View style={{flexDirection:'row', alignItems:'center',marginTop:10 ,paddingBottom:5, borderBottomColor:'grey', borderBottomWidth:0.4}}>
                    <Image source={require('../images/userdummy.png')} style={{width:40, height:40, borderRadius:20, marginLeft:12}}/>
                    <Text style={{marginLeft:12, fontWeight:700, color:'black', fontSize:16}}>{item.name}</Text>
                </View>
                <Image
                  source={{uri: item.image}}
                  style={{width: '100%', height:200, alignSelf:'center'}}
                />
                    <Text style={{margin:10}}>{item.caption}</Text>
                    
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

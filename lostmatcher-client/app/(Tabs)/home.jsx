import { View, Text,Image, ScrollView, Pressable, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState,useRef } from 'react'
import { Link } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing'
import { uploadFile } from '../../lib/appWrite';
import { createNewItem } from '../../lib/items';
import backendBaseURL from '../../utils/backendBaseURL';
import handleApiError from '../../utils/handleApiError';
import Navbar from '../../components/navbar.jsx';

import { storage } from '../../lib/firebaseConfig.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useGlobalContext } from '../../context/globalContext.js';

const Home = () => {
  const refScrollView = useRef(null);

  const {userData}=useGlobalContext()

  const [uploadmessage, setUploadMessage]=useState('')
  const [searchMessage, setSearchMessage]=useState('')

  const [missingLocation, setMissingLocation] = useState('');
  const [missingDescription, setMissingDescription] = useState('');
  const [missingTime, setMissingTime] = useState('');
  const [missingName, setMissingName] = useState('');

  const [foundLocation, setFoundLocation] = useState('');
  const [foundDescription, setFoundDescription] = useState('');
  const [foundTime, setFoundTime] = useState('');
  const [foundName, setFoundName] = useState('');

  const [currentLocationTown, setCurrentLocationTown] = useState('');
  const [currentLocationQuarter, setCurrentLocationQuarter] = useState('');
  const [currentLocationActual, setCurrentLocationActual] = useState('');
  const [currentLocationContactPersonTel, setCurrentLocationContactPersonTel] = useState('');

  const [uploadSelectedImage, setuploadSelectedImage] = useState(null);
  const [searchSelectedImage, setSearchSelectedImage]=useState(null);

  const [match, setMatch]=useState(false)
  const [imageUrl,setImageUrl]=useState('');
  const [matchImageURLs,setMatchImageURL]=useState([]);
  const [foundUploadResponse, setFoundUploadResponse]=useState(null)

  const [results, setResults] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [itemDescArray,setItemsDescArray]=useState([]);

  const searchPickImage= async()=> {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setSearchSelectedImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setuploadSelectedImage(result.assets[0]);
    }
  };

  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setuploadSelectedImage(result.assets[0]);
      console.log(result)
    }
  };
  const shareImage = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert('Sharing is not available on this platform');
      return;
    }

    await Sharing.shareAsync(searchSelectedImage.uri);
  };

  const handleUploadFound=async(event)=>{
    event.preventDefault();
    try {
      if (uploadSelectedImage == null) {
        setUploadMessage('please select an image')
        setError(true)
        return
      };
      setLoading(true)

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uploadSelectedImage.uri, true);
        xhr.send(null);
      });
  
      const storageRef = ref(storage, 'images/' + uploadSelectedImage.fileName);
      const snapshot = await uploadBytes(storageRef, blob);
  
      // We're done with the blob, close and release it
      blob.close();
      const url = await getDownloadURL(snapshot.ref);
      console.log('Download URL: ', url);
      // const imageurl=await uploadFile(uploadSelectedImage,'image');
      if (!url) {
        setUploadMessage("Couldn't get image url, try again");
        setError(true)
        return
      }
      else{
        setImageUrl(url)
      }
      try {
        const createItemResponse = await createNewItem({
          imageURL: url,
          description: foundDescription.toLowerCase(),
          type: "found",
          contactPersonContact: currentLocationContactPersonTel,
          missingLocation: foundLocation.toLowerCase(),
          name:foundName,
          currentLocation: {
            townOrVillage: currentLocationTown.toLowerCase(),
            quarter: currentLocationQuarter.toLowerCase(),
            specificPlace: currentLocationActual.toLowerCase()
          }
        },setUploadMessage,setError);
        if (createItemResponse) {
          setFoundUploadResponse(createItemResponse);
          setFoundDescription('');
          setFoundLocation('');
          setFoundTime('');
          setuploadSelectedImage(null);
          setCurrentLocationActual('');
          setCurrentLocationContactPersonTel('');
          setCurrentLocationQuarter('');
          setCurrentLocationTown('');
          alert('Item upload successful');
          setError(false)
          setUploadMessage('Item upload successful')
          setTimeout(() => {
            setUploadMessage('')
          }, 5000);
          
        } else {
          throw Error
        }
    
      } catch (error) {
        setUploadMessage( handleApiError(error,setError));
      }
      
    } catch (error) {
      setUploadMessage(handleApiError(error, setError))
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await backendBaseURL.get('/items');
        const descriptionArray = response.data.map(item => item.description); // Extracting description strings
        setItemsDescArray(descriptionArray); // Setting state to array of descriptions
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getItems();
  }, [searchSelectedImage]);

  const handleSearchMissingItem = async () => {
        try {
          const matchResponse = await backendBaseURL.post('/match', {
            targetimage: missingDescription, 
            matchArray: itemDescArray
          });
          console.log(matchResponse.data.rating);
           // Process the response to filter matches with rating >= 0.6 and sort them
        const filteredMatches = matchResponse.data.ratings.filter(item => item.rating >= 0.5);
        const sortedMatches = filteredMatches.sort((a, b) => b.rating - a.rating);


        const targets = sortedMatches.map(match => match.target);
        // Initialize an array to hold the image URLs
        const imageurls = new Array(targets.length).fill(null);
        
        // Fetch image URLs for each target using map and Promise.all
        console.log('TARGETS: ', targets);
        await Promise.all(
          targets.map(async (description, index) => {
            try {
              const response = await backendBaseURL.get(`/items/itemdescription?description=${encodeURIComponent(description)}`);
              imageurls[index] = response.data.imageURL;
            } catch (error) {
              console.error('Error fetching image URL for target:', description, error);
              setSearchMessage(handleApiError(error, setError));
              imageurls[index] = null;
            }
          })
        );
        
        console.log('Image URLs: ', imageurls);
        setMatchImageURL(imageurls);
        // Prepare the final sorted array with image URLs
        const processedResults = {
          ratings: sortedMatches.map((match, index) => ({
            target: match.target,
            rating: match.rating,
            imageUrl: imageurls[index]
          })),
          bestMatch: matchResponse.data.bestMatch,
          bestMatchIndex: matchResponse.data.bestMatchIndex
        };
        
        // Set the results state to display in your component
        setResults(processedResults);
        setMatch(true);
          // Set the results state to display in your component
          console.log(processedResults.ratings); 
        } catch (error) {
          console.error(error.message);
        }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
          <Navbar/>
        <ScrollView className="flex-col" contentContainerStyle={{alignItems:'center'}} ref={refScrollView}>
            <View className="flex-row relative z-0 gap-2 mt-2 ml-0 mr-3 z-0 py-3 px-4 justify-evenly items-center" style={{width:'100%',height:130}} >
                {/* Home Tab */}
                <Pressable className=" flex-1 items-center border-2 rounded-md border-gray-300" style={{height:'100%'}} onPress={()=>refScrollView.current.scrollTo({ x: 0, y: 130 })} title="Go to Found Item section">
                    <Text className="text-blue-500 text-4xl p-2">😊</Text>
                    <Text className="text-sm">Upload Found Object</Text>
                </Pressable>

                {/* Report Tab */}
                <Pressable className="items-center flex-1 border-2 rounded-md border-gray-300" style={{height:'100%'}} onPress={()=>refScrollView.current.scrollTo({ x: 0, y: 850 })}>
                    <Text className="text-blue-500 text-4xl p-2">🔍</Text>
                    <Text className="text-sm">Search Missing Object</Text>
                </Pressable>
            </View>
            <View className="w-full px-6 py-1">{/** Upload found Item */}
                <Text className="font-mRoboto text-2xl bg-bgsecondary p-2 rounded-md shadow-md shadow-black">Upload Found Object</Text>
                {!uploadSelectedImage &&(
                  <View className="w-full gap-y-2 flex-col justify-center items-center border-bgsecondary border-2 mb-2 p-2 rounded-lg bg-slate-50 " style={{height:200}}>
                    <TouchableOpacity onPress={takePicture} className="flex-col justify-center items-center gap-y-1 bg-slate-100 p-2 w-full rounded-md">
                      <FontAwesome name="camera" size={20} />
                        <Text>Take picture</Text>
                    </TouchableOpacity>
                    <Text className='font-rRougeScript text-2xl text-primary'>Or</Text>
                    <TouchableOpacity onPress={pickImage} className="flex-col justify-center items-center gap-y-1 bg-slate-100 p-2 w-full rounded-md  mb-4">
                      <FontAwesome name="image" size={20}/>
                      <Text>Choose From Gallery</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {uploadSelectedImage &&(
                  <View className="w-full gap-y-2 flex-col justify-center items-center border-bgsecondary border-2 mb-2 p-2 rounded-lg bg-slate-50 " style={{height:200}}>
                    <Image 
                    source={{ uri: uploadSelectedImage.uri,width:'100%',height:'100%' }}
                    className='object-cover rounded-lg'  
                    />
                  </View>
                )}
              <View className='w-full'>{/** About Item */}
                  <View className='flex-row gap-2'>
                    <TextInput
                      className="flex-1 rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      placeholder="Picked At what time?"
                      onChangeText={(text)=>{setFoundTime(text)}}
                      value={foundTime}
                    />
                    <TextInput
                      className="flex-1 rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      placeholder="where ?..."
                      onChangeText={(text)=>{setFoundLocation(text)}}
                      value={foundLocation}
                    />
                  </View>
                  <View className='flex-row gap-2'>
                      <TextInput
                      className="flex-1 text-center text-xs rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      multiline={true}
                      numberOfLines={2}
                      placeholder="what is the item in one word ?"
                      onChangeText={(text)=>{setFoundName(text)}}
                      value={foundName}
                      />
                      <TextInput
                      className="rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      multiline={true}
                      numberOfLines={2}
                      placeholder="briefly describe the object..."
                      onChangeText={(text)=>{setFoundDescription(text)}}
                      value={foundDescription}
                      />
                  </View>
              </View>
              <View className=' w-full border border-gray-300 p-3 rounded-lg mt-4'>{/** Current item location */}
                  <View className='w-full flex justify-center items-center mb-4'>
                      <Text className='font-mRoboto text-center text-sm'>Fill information on item's Current Location</Text>
                      <Text className='text-xs text-center text-gray-400'>The information help the owner track the item online</Text>
                  </View>
                  <View className='w-full flex-col items-center'>
                      <View className='flex-row w-full'>
                          <View className='flex-1 mr-2 rounded-md p-2'>
                              <Text className='mb-2'>Town or Locality *</Text>
                              <View>
                                <TextInput
                                  placeholder='eg. molyko'
                                  className='text-xs border p-1 border-gray-200 rounded-md'
                                  onChangeText={(text)=>{setCurrentLocationTown(text)}}
                                  value={currentLocationTown}
                                />
                              </View>
                          </View>
                          <View className='flex-1 p-2'>
                            <View>
                                <Text className='mb-2'>Quarter *</Text>
                                <View>
                                  <TextInput
                                    className='text-xs border p-1 border-gray-200 rounded-md'
                                    placeholder='e.g.dirty South'
                                    onChangeText={(text)=>{setCurrentLocationQuarter(text)}}
                                    value={currentLocationQuarter}
                                  />
                                </View>
                            </View>
                          </View>
                      </View>
                      <View className='flex-row w-full'>
                          <View className='flex-1 mr-2 rounded-md p-2'>
                              <Text className='mb-2'>actual Location *</Text>
                              <View>
                                <TextInput
                                  placeholder='e.g. Veras City'
                                  className='text-xs border p-1 border-gray-200 rounded-md'
                                  onChangeText={(text)=>{setCurrentLocationActual(text)}}
                                  value={currentLocationActual}
                                />
                              </View>
                          </View>
                          <View className='flex-1 p-2'>
                            <View>
                                <Text className='mb-2'>Contact person *</Text>
                                <View>
                                  <TextInput
                                    className='text-xs border p-1 border-gray-200 rounded-md'
                                    placeholder='phone number'
                                    onChangeText={(text)=>{setCurrentLocationContactPersonTel(text)}}
                                    value={currentLocationContactPersonTel}
                                  />
                                </View>
                            </View>
                          </View>
                      </View>
                  </View>
              </View>
              {(uploadmessage && error) &&(
                <View className='mt-2 mb-2 p-3 w-full'>
                  <Text className='text-amber-700 text-justify'>
                      {uploadmessage}
                  </Text>
                </View>
              )}
              {(uploadmessage && !error) && (
                <View className='mt-2 mb-2 p-3 w-full'>
                  <Text className=' text-green-700 text-justify'>
                      {uploadmessage}
                  </Text>
                </View>
              )}
              <View className="w-full flex-row mt-3">{/** upload */}
                 <TouchableOpacity className="flex-1 mr-2  p-3 rounded-lg border-2 border-bgsecondary"><Text className="font-mRoboto text-center text-lg">Cancel</Text></TouchableOpacity>
                 <TouchableOpacity className=" bg-primary ml-2 rounded-lg flex-1 p-3"><Text className="font-mRoboto text-[#ffffff] text-center text-lg" onPress={handleUploadFound}>Upload</Text></TouchableOpacity>
              </View>
            </View>
            <View className="w-full px-6 py-1 mt-8">{/** search missing item */}
              <Text className="font-mRoboto text-2xl bg-bgsecondary p-2 rounded-md shadow-md shadow-black">Search Missing Object</Text>
              <Text className="text-slate-300 mb-4">we use AI to help you Find similar Objects</Text>
              {!searchSelectedImage &&(
                <TouchableOpacity onPress={searchPickImage} className="w-full flex-col justify-center items-center bg-slate-100 border-bgsecondary border-2 mb-2 p-2 rounded-lg " style={{height:150}}>
                  <View className="flex-col justify-center items-center gap-y-1  mb-4">
                    <FontAwesome name="image" size={20} />
                    <Text className="text-sm font-mRoboto">Choose From Gallery</Text>
                  </View>
                </TouchableOpacity>
              )}
              {searchSelectedImage &&(
                <TouchableOpacity onPress={searchPickImage} className="w-full flex-col justify-center items-center bg-slate-100 border-bgsecondary border-2 mb-2 p-2 rounded-lg " style={{height:200}}>
                  <Image
                    source={{uri:searchSelectedImage.uri,width:'100%',height:'100%'}}
                    className='rounded-lg object-cover'
                  />
                </TouchableOpacity>
              )}
              <View className='w-full'>{/**about missing item*/}
              <View className='flex-row gap-2'>
                    <TextInput
                      className="flex-1 rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      placeholder="Lost At what time?"
                      onChangeText={(text)=>{setMissingTime(text)}}
                      value={missingTime}
                    />
                    <TextInput
                      className="flex-1 rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      placeholder="where ?..."
                      onChangeText={(text)=>{setMissingLocation(text)}}
                      value={missingLocation}
                    />
                  </View>
                  <View className='flex-row gap-2'>
                      <TextInput
                      className="flex-1 text-center text-xs rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      multiline={true}
                      numberOfLines={2}
                      placeholder="what is the item in one word ?"
                      onChangeText={(text)=>{setFoundName(text)}}
                      value={foundName}
                      />
                      <TextInput
                      className="rounded-lg border-2 p-2 mb-2 border-bgsecondary"
                      style={{  }}
                      multiline={true}
                      numberOfLines={2}
                      placeholder="briefly describe the object..."
                      onChangeText={(text)=>{setMissingDescription(text)}}
                      value={missingDescription}
                      />
                  </View>
              </View>
                <View className="flex-row w-100 rounded-md justify-center items-center">
                  {searchSelectedImage && (
                    <TouchableOpacity className="flex-row gap-2 my-4 rounded-md bg-bgsecondary w-20 ml-0.5 p-0" onPress={shareImage}>
                      <Image
                        source={require('../../assets/icons/Share.png')}
                      />
                      <Text className="font-mRoboto mb-2">Share</Text>
                    </TouchableOpacity>
                  )

                  }
                </View>
                <Text className="font-mRoboto text-lg mb-4 mt-4">Max Result</Text>
                <View className="flex-row gap-x-2 box-border w-full">
                  <TouchableOpacity className="flex-1 ml-0 bg-bgsecondary p-2 rounded-md"><Text className="text-center text-lg font-bold">1</Text></TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-bgsecondary p-2 rounded-md"><Text className="text-center text-lg font-bold">3</Text></TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-bgsecondary p-2 rounded-md"><Text className="text-center text-lg font-bold">5</Text></TouchableOpacity>
                  <TouchableOpacity className="flex-1 p-2 bg-bgsecondary rounded-md"><Text className="text-center text-lg font-bold text-primary">All</Text></TouchableOpacity>
                </View>
                {(searchMessage && error) &&(
                <View className='mt-2 mb-2 p-3 w-full'>
                  <Text className='text-amber-700 text-justify'>
                      {searchMessage}
                  </Text>
                </View>
              )}
              {(searchMessage && !error) && (
                <View className='mt-2 mb-2 p-3 w-full'>
                  <Text className=' text-green-700 text-justify'>
                      {searchMessage}
                  </Text>
                </View>
              )}
                <View className="w-full flex-row mt-4 mb-6">
                 <TouchableOpacity className="flex-1 mr-2  p-3 rounded-lg border-2 border-bgsecondary"><Text className="font-mRoboto text-center text-lg">Cancel</Text></TouchableOpacity>
                 <TouchableOpacity className=" bg-primary ml-2 rounded-lg flex-1 p-3"><Text className="font-mRoboto text-[#ffffff] text-center text-lg" onPress={handleSearchMissingItem}>Search</Text></TouchableOpacity>
                </View>             
                  {match && (
                    <View className="container mx-au rounded-lg">
                    <Text className="text-2xl font-bold mb-4 mt-3">Search Results</Text>
                    <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {results.ratings.map((result, index) => (
                        <View key={index} className="shadow-sm shadow-zinc-800 rounded-xlg p-4 bg-bgsecondary">
                          <Image
                            source={{uri:result.imageUrl || 'https://via.placeholder.com/300x200?text=Image+Not+Found'}}
                            alt={result.target}
                            resizeMode="contain"
                            style={{borderRadius:20}}
                            className="w-full h-60 object-cover rounded-lg mb-4"
                          />
                          <View className="p-4 bg-slate-200 rounded-md">
                            <Text className="text-xl font-semibold">{result.target}</Text>
                            <Text className="text-gray-600">Rating: {result.rating.toFixed(2)}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View className="mt-8 p-4 bg-green-100 rounded-lg">
                      <Text className="text-xl font-bold">Best Match</Text>
                      <Text className="text-gray-800">Target: {results.bestMatch.target}</Text>
                      <Text className="text-gray-800">Rating: {results.bestMatch.rating.toFixed(2)}</Text>
                    </View>
                  </View>
                    
                  )}
                  {!match && (
                      <View className="flex-col gap-y-2 bg-bgsecondary p-6 items-center rounded-lg">
                      <Image
                      className="w-full rounded-lg"
                      source={require('../../assets/images/no found.jpg')}
                        style={{height:100, width:100}}
                      />
                      <Text className='opacity-40 font-bold'>We will notify you in case of any Match</Text>
                     
                    </View>
                  )}
              
            </View>
            <View className="w-full flex-col justify-center items-center  mt-0 p-6" style={{height:200}}>{/** Track on map */}
                <View className="flex-col justify-center items-center rounded-lg border-bgsecondary gap-y-1 w-full h-full">
                  <Image
                    className="w-full h-full"
                    source={require('../../assets/images/map.jpg')}
                    resizeMode='cover'
                  />
                </View>
                
            </View>
            <View className='w-full px-6'>{/**track button */}
              <TouchableOpacity className="w-full mb-2 rounded-lg p-3 bg-bgsecondary"><Text className="text-primary text-center text-lg font-bold">Track Location</Text></TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default Home
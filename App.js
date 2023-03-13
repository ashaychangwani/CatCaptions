import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Share } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Clipboard from '@react-native-community/clipboard';
import { ActivityIndicator } from 'react-native-paper';
const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CatCaptions"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      return;
    }
    let formData = new FormData();
    formData.append('image', {
      uri: selectedImage,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      setIsLoading(true); // Set loading to true before API call
      let response = await axios.post('http://128.122.49.69:20438/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      setCaptions(response.data.captions);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading to false after API call, regardless of success or failure
    }
  };

  const copyToClipboard = (caption) => {
    Clipboard.setString(caption);
    alert('Caption copied to clipboard!');
  };

  const shareCaption = (caption) => {
    // implement share functionality
    alert(`Share caption: ${caption}`);
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.header}>Welcome to CatCaptions!</Text>
        <Text style={styles.subheader}>Please upload an image to generate some captions</Text>
      </View>
      {selectedImage && (
        <Card containerStyle={{ padding: 0, width: '70%' }}>
          <Card.Image source={{ uri: selectedImage }} />
          <TouchableOpacity style={styles.buttonContainer} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </Card>
      )}
      {!selectedImage && (
        <TouchableOpacity style={styles.buttonContainer} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
      {captions.length > 0 && (
        <View style={styles.captionContainer}>
          <Text style={styles.captionHeader}>Captions:</Text>
          {captions.map((caption, index) => (
            <View style={styles.captionItem} key={index}>
              <Text style={styles.captionText}>{caption}</Text>
              <View style={styles.captionButtons}>
                <TouchableOpacity onPress={() => copyToClipboard(caption)}>
                  <Text style={styles.captionButton}>Copy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => shareCaption(caption)}>
                  <Text style={styles.captionButton}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
      {isLoading && <ActivityIndicator size="large" color="red" style={styles.activityIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
    borderWidth: 0,
    padding: 10,
  },
  button: {
    backgroundColor: '#008080',
    borderRadius: 10,
    width: 10,
    height: 10,
    margin: 10
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
  },
  subheader: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  captionContainer: {
    marginTop: 20,
  },
  captionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  captionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  captionText: {
    marginRight: 10,
    fontSize: 14,
    color: 'red',
    width: 200,
    marginBottom: 20
  },
  captionButtons: {
    flexDirection: 'row',
  },
  captionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#eaeaea',
    borderRadius: 5,
    marginLeft: 10,
  },
  activityIndicator: {
    marginTop: 20,
  }
});

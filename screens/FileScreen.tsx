import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';

const FileScreen = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const route = useRoute();
  const {month, date} = route.params as {month: string; date: string};

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const storageRef = storage().ref();
        const filesRef = storageRef.child(`months/${month}/${date}`);
        const filesList = await filesRef.listAll();
        // filter files based on extensions
        const pngFiles = filesList.items.filter(item =>
          item.name.endsWith('.png'),
        );
        // Store the files urls
        const imgUrls = await Promise.all(
          pngFiles.map(async file => {
            const url = await file.getDownloadURL();
            return url;
          }),
        );

        const textItem = filesList.items.find(item =>
          item.name.endsWith('.txt'),
        );
        if (textItem) {
          const responce = await fetch(await textItem.getDownloadURL());
          const content = await responce.text();
          setTextContent(content);
        }
        setImageUrls(imgUrls);
        console.log('imageUrls', imageUrls);
        console.log('textContent', textContent);
      } catch (error) {
        console.error('Error while fetching files:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const renderItem = ({item}: {item: string}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: item}} style={styles.image} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="gray" style={styles.loader} />
      ) : imageUrls.length > 0 ? (
        <View>
          <FlatList
            data={imageUrls}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          {textContent && <Text style={styles.text}>{textContent}</Text>}
        </View>
      ) : (
        <Text style={styles.noDataText}>No files available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent:'center',
    // alignItems:'center',
    backgroundColor: 'lightblue',
    height: '100%',
  },
  imageContainer: {
    // borderWidth:3,
    margin: 7,
    borderColor: '#edf4f5',
    borderRadius: 7,
  },
  image: {
    height: 300,
    width: 'auto',
  },
  loader: {
    justifyContent: 'center',
    marginTop: '85%',
  },
  text: {
    textAlign: 'center',
    padding: 15,
    // backgroundColor:'#edf4f5',
    borderRadius: 7,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  noDataText: {
    height: '100%',
    textAlign: 'center',
    marginTop: '85%',
  },
});
export default FileScreen;

import {
  StyleSheet,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';

const DateScreen = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const route = useRoute();
  const {month} = route.params as {month: string};

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const storageRef = storage().ref();
        const dateRef = storageRef.child(`months/${month}`);
        const dateItems = await dateRef.listAll();
        const dateNames = dateItems.prefixes.map(prefix => prefix.name);
        setDates(dateNames);
      } catch (error) {
        console.error('Error while fetching dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, []);

  const handleDatePressed = (month: string, date: string) => {
    navigation.navigate('Files', {month, date});
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="gray" style={styles.loader} />
      ) : dates.length > 0 ? (
        <FlatList
          data={dates}
          renderItem={({item}: {item: string}) => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDatePressed(month, item)}>
              <Text style={styles.text}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item}
        />
      ) : (
        <Text style={styles.noDataText}>No dates available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    height: '100%',
  },
  button: {
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    paddingVertical: 15,
    marginHorizontal: 8,
    backgroundColor: '#edf4f5',
  },
  text: {},
  noDataText: {
    height: '100%',
    textAlign: 'center',
    marginTop: '85%',
  },
  loader:{
    justifyContent:'center',
    marginTop: '85%',
  }
});
export default DateScreen;

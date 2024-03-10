import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { SafeAreaView } from 'react-native-safe-area-context';


const MonthScreen = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [loading, setLoading]=useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMonths = async () => {
      try {
        const storageRef = storage().ref();
        const monthsRef = storageRef.child('months');
        const monthsItems = await monthsRef.listAll();
        const monthsNames = monthsItems.prefixes.map(prefix => prefix.name);
        setMonths(monthsNames);
      } catch (error) {
        console.error('Error while fetching months:', error);
      }finally{
        setLoading(false)
    }
    };
    fetchMonths();
  }, []);

  const handleMonthPressed = (month: string) => {
    navigation.navigate('Dates', {month});
  };

  return (
    <SafeAreaView style={styles.container}>
      {months.length>0 ? (
        <FlatList 
        data={months}
        renderItem={({item}: {item:string})=>(
          <TouchableOpacity 
          style={styles.button}
          onPress={()=>handleMonthPressed(item)}>
            <Text style={styles.text}>{item}</Text>
          </TouchableOpacity>
      )}
        keyExtractor={(item)=> item}
        />
      ):(
        <Text style={styles.noDataText}>No months available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    backgroundColor:'lightblue',
    height:'100%'
  },
  button:{
    borderRadius:7,
    justifyContent:"center",
    alignItems:'center',
    marginVertical:5,
    paddingVertical:15,
    marginHorizontal:8,
    backgroundColor:'#edf4f5',
  },
  text:{
  },
  noDataText:{
    height:'100%',
    textAlign:'center',
    marginTop:'85%'
  }
});
export default MonthScreen;

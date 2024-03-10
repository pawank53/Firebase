import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Image, Text, FlatList, View } from 'react-native';
import storage from '@react-native-firebase/storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MonthScreen from './screens/MonthScreen';
import DateScreen from './screens/DateScreen';
import FileScreen from './screens/FileScreen';

const Stack = createNativeStackNavigator();

interface RouteParams {
  month: string;
  date:string
}


function App(): React.JSX.Element {
 

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Months' screenOptions={{headerTitleAlign:'center'}}>
        <Stack.Screen name='Months' component={MonthScreen}/>
        <Stack.Screen name='Dates' component={DateScreen} options={({route})=>({title:(route.params as RouteParams)?.month|| 'Dates'})} />
        <Stack.Screen name='Files' component={FileScreen} options={({route})=>({title:(route.params as RouteParams)?.date|| 'Files'})}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;

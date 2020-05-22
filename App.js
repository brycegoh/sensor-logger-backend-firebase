import axios from 'axios';
import React, { useState,useEffect  } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TextInput,
  Button
} from 'react-native';
import {
  Accelerometer,
  Gyroscope,
} from 'expo-sensors';
import Label from './components/Label.js'
import Graph from './components/Graph.js'

Gyroscope.setUpdateInterval(500);
Accelerometer.setUpdateInterval(500);



export default function App() {
  // const SERVER_URL = "http://192.168.0.118:8080"
  // useEffect(() => {
  //   return () => {
  //     _unsubscribe();
  //   };
  // }, []);
  const [  SERVER_URL, setServerUrl ] = useState("192.168.0.118")
  const [currentToggle, updateToggle] = useState(false)
  const [ gyroArray , setGyro ] = useState( [] )
  const [ accArray, setAcc ] = useState( [] )
  const [ gyroTime , setGyroTime ] = useState( [] )
  const [ accTime , setAccTime ] = useState( [] )
  useKeepAwake()
  // console.log("GYRO"+" " + JSON.stringify(gyroArray[0]))
  // {"x":-0.030834078788757324,"y":-0.023252591490745544,"z":-0.0013800500892102718}
  // console.log('Refresh')
  
  
  const _subscribe = () => {
    Gyroscope.addListener(gyroscopeData => {
      let time
      gyroArray.push(gyroscopeData)
      
      if(gyroTime.length === 0){
        gyroTime.push(0)
        time = 0
      }else{
        gyroTime.push(gyroTime[ gyroTime.length - 1 ] + 500)
        time = gyroTime[ gyroTime.length - 1 ] + 500
      }
      setGyro(gyroArray)
      setGyroTime( gyroTime )
      uploadToServer("Gyroscope",gyroscopeData.x,gyroscopeData.y,gyroscopeData.z,time)
      // console.log("---------------------------------")
      // console.log("GYRO"+" " + gyroArray[accTime.length - 1])
      // console.log("TIME"+" " +gyroTime[accTime.length - 1])
      // console.log("---------------------------------")
    });
    Accelerometer.addListener(accelerometerData => {
      accArray.push(accelerometerData)
      let time
      if(accTime.length === 0){
        accTime.push(0)
        time = 0
      }else{
        accTime.push(accTime[ accTime.length - 1 ] + 500)
        time = accTime[ accTime.length - 1 ] + 500
      }
      setAcc(accArray)
      setAccTime(accTime)
      uploadToServer("Accelerometer",accelerometerData.x,accelerometerData.y,accelerometerData.z,time)
      // console.log("---------------------------------")
      // console.log("ACC"+" " + accArray[accTime.length - 1])
      // console.log("TIME"+" " + accTime[accTime.length - 1])
      // console.log("---------------------------------")
    });
    
    
  };
  const _unsubscribe = () => {
    Gyroscope.removeAllListeners()
    Accelerometer.removeAllListeners()
  };
  const changeToggle = () => {
    if (currentToggle === false){
      _subscribe()
      updateToggle(true)
    }else{
      _unsubscribe()
      updateToggle(false)
    }
  }


  const clearState = () => {
    console.log("CLEAR STATE----")
    setGyro([])
    setAccTime([])
    setGyroTime([])
    setAcc([])
    updateToggle(false)
    setServerUrl("192.168.0.118")
  }

  const uploadToServer = (dataType,dataX,dataY,dataZ,dataTime) => {
    let x = {
      dataType: dataType,
      dataX: dataX,
      dataY: dataY,
      dataZ: dataZ,
      dataTime: dataTime
    }
    console.log(JSON.stringify(x))
    axios.post(`http://${SERVER_URL}:8080`, {
      data: x,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const updateServerUrl = (text) => {
    setServerUrl(text)
  }



  return (
    <View style={styles.mainContainer}>
      
      <View
        style={{
          flexDirection:'row',
          justifyContent:'space-around',
          alignItems:'center',
          fontSize:30
        }}
      >
        <TextInput
        style={{
          height:50,
          fontSize:30 
        }}
        placeholder={SERVER_URL}
        onChangeText = {updateServerUrl}
        keyboardType = 'numeric'
        value = {SERVER_URL}
      />

      </View>

      <View
        style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          marginBottom: 20,
          width:200,
          height:"20%",
          fontSize:30
        }}
      >
         <Button
         style={{
           width:"100%",
           fontSize:30
         }}
          onPress={ clearState }
          title="clear"
        />

      </View>
       
     

      <Button
        styles={{
          width:'100%',
          height:"30%",
          fontSize:30
          
        }}
        onPress={ changeToggle }
        title="TOGGLE"
      />
      

    </View>
  );
}

const styles = StyleSheet.create({
  flexColCenterStart: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: "flex-start",
    alignItems: 'center',
    marginTop: 10,
  },
  mainContainer:{
    margin: 30,
    height:"100%",
    width:"80%",
    flexDirection: 'column',
    alignItems:"center",
    justifyContent:"flex-start"
  }
})
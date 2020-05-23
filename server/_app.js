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


const interval = 3000
Gyroscope.setUpdateInterval(interval);
Accelerometer.setUpdateInterval(interval);



export default function App() {

  const [  SERVER_URL, setServerUrl ] = useState("192.168.0.118")
  const [ serverToggle, updateServerToggle ] = useState(false)


  const [ gyroArray , setGyro ] = useState( [] )
  const [ accArray, setAcc ] = useState( [] )
  const [ gyroTime , setGyroTime ] = useState( [] )
  const [ accTime , setAccTime ] = useState( [] )
  const [ gyroDisplay ,updateGyroDisplay ] = useState( [] )
  const [ numLoop, setNumLoop ] = useState([])

  const _subscribe = () => {

    Gyroscope.addListener(gyroscopeData => {
      
      let time
      gyroArray.push(gyroscopeData)
  
      if( serverToggle === true ){
        if(gyroTime.length === 0){
          gyroTime.push(0)
          time = 0
        }else{
          gyroTime.push(gyroTime[ gyroTime.length - 1 ] + interval)
          time = gyroTime[ gyroTime.length - 1 ] + interval
        }
        setGyro(gyroArray)
        setGyroTime( gyroTime )
        uploadToServer("Gyroscope",gyroscopeData.x,gyroscopeData.y,gyroscopeData.z,time)
      }
      updateGyroDisplay([gyroscopeData.x,gyroscopeData.y,gyroscopeData.z])
    });
  
    Accelerometer.addListener(accelerometerData => {
  
      if( serverToggle === true ){
        accArray.push(accelerometerData)
        let time
        if(accTime.length === 0){
          accTime.push(0)
          time = 0
        }else{
          accTime.push(accTime[ accTime.length - 1 ] + interval)
          time = accTime[ accTime.length - 1 ] + interval
        }
        setAcc(accArray)
        setAccTime(accTime)
        uploadToServer("Accelerometer",accelerometerData.x,accelerometerData.y,accelerometerData.z,time)
      }
      
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
    if (serverToggle === false){
      updateServerToggle(true)
      _subscribe()
      console.log("SEND TO SERVER------------------------")
    }else{
      _unsubscribe()
      updateServerToggle(false)
      console.log("STOP TO SERVER------------------------")
    }
  }
  
  
  const clearState = () => {
    console.log("CLEAR STATE----")
    _unsubscribe()
    setGyro([])
    setAccTime([])
    setGyroTime([])
    setAcc([])
    updateServerToggle(false)
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
      console.log("DONE");
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  const updateServerUrl = (text) => {
    setServerUrl(text)
  }
  
  useKeepAwake()
  useEffect(()=>{
    _subscribe()
  },[])
  useEffect(()=>{
    _subscribe()
  },[serverToggle])

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

  useEffect(()=>{
   if(serverToggle === "false"){

   } 
  })

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

      <View>
        {
          gyroDisplay.map((x,i)=>
            <Text key={i} >{x}</Text>
          )
        }
      </View>
      

    </View>
  );
  
}


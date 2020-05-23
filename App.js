import axios from 'axios';
import React, { useState,useEffect  } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import {
  StyleSheet,
  Dimensions ,
  SafeAreaView ,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import {
  Accelerometer,
  Gyroscope,
} from 'expo-sensors';
import addData from './firebaseApi'

export default function App() {
    
    
    const axisLabels = ["X", "Y", "Z"]

    const [ipv4Address , setIpv4Address] = useState("192.168.0.118")
    const [portNum , setPortNum] = useState("8080")
    const [displayGyro , setDisplayGyro] = useState(["0","0","0"])
    const [displayAcc , setDisplayAcc] = useState(["0","0","0"])
    const [numLoop, setNumLoop] = useState(0)
    const numLoopRef = React.useRef(numLoop)
    const setNumLoopRef = data => {
        numLoopRef.current = data;
        setNumLoop(data);
      };
    // const [interval , setInterval] = useState("500")
    const [sendToServerStatus , setSendToServerStatus]=useState(false)

    const interval = 100
    Gyroscope.setUpdateInterval(interval)
    Accelerometer.setUpdateInterval(interval)

    const resetApp = () => {
        setIpv4Address("192.168.0.118")
        setPortNum("8080")
        setNumLoopRef(0)
        setSendToServerStatus(false)
    }
    const changeIpv4Address = (text) => {
        setIpv4Address(text)
    }
    const changePortNum = (text) => {
        setPortNum(text)
    }
    const changeSentToServerStatus = ()=>{
        if (sendToServerStatus === true){
            setSendToServerStatus(false)
        }else{
            setSendToServerStatus(true)
        }
    }
    // const changeInterval = (num) => {
    //     unsubscribeToSensors()
    //     setInterval(num)
    //     if(num.length>=3){
    //         let intInterval = parseInt(interval)
    //         Gyroscope.setUpdateInterval( intInterval )
    //         Accelerometer.setUpdateInterval( intInterval )
    //         subscribeToSensors()
    //     }
        
    // }
    const unsubscribeToSensors = () => {
        // this._gyroSubscription && this._gyroSubscription.remove()
        // this._gyroSubscription = null;
        // this._accSubscription && this._accSubscription.remove()
        // this._accSubscription = null;
        Gyroscope.removeAllListeners()
        Accelerometer.removeAllListeners()
      };
    const subscribeToSensors = ()=>{
        let dp = 5
        Gyroscope.addListener(gyroscopeData => {
            if( sendToServerStatus === true){
                let time = (numLoopRef.current) * interval * 10**(-3)
                uploadToServer("Gyroscope",gyroscopeData.x.toFixed(dp),gyroscopeData.y.toFixed(dp),gyroscopeData.z.toFixed(dp),time.toFixed(12) )
            }
            setDisplayGyro([gyroscopeData.x.toFixed(dp),gyroscopeData.y.toFixed(dp),gyroscopeData.z.toFixed(dp)])
        })
        Accelerometer.addListener(AccelerometerData => {
            if( sendToServerStatus === true){
                let time = (numLoopRef.current) * interval * 10**(-3)
                uploadToServer("Accelerometer",AccelerometerData.x.toFixed(dp),AccelerometerData.y.toFixed(dp),AccelerometerData.z.toFixed(dp), time.toFixed(12))
                setNumLoopRef(numLoopRef.current+1)
            }
            setDisplayAcc([AccelerometerData.x.toFixed(dp),AccelerometerData.y.toFixed(dp),AccelerometerData.z.toFixed(dp)])
        })
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
          addData( dataType,dataX,dataY,dataZ,dataTime )
    }

    useEffect(()=>{
        // Gyroscope.setUpdateInterval( 500 )
        // Accelerometer.setUpdateInterval( 500 )
        subscribeToSensors()
    },[])

    useEffect(()=>{
        subscribeToSensors()
        return()=>{unsubscribeToSensors()}
    },[sendToServerStatus])
    

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            flexDirection: "column",
            justifyContent:"flex-start",
            alignContent:"center",
            paddingTop:40
        },
        wrapperRow:{
            flexDirection: 'row',
            justifyContent:'center',
            alignContent:'center',
            backgroundColor:'yellow',
            height:"10%",
            paddingBottom: 10,
            paddingLeft:20,
            paddingRight: 5,
            borderWidth: 1,
            borderColor :"black"
        },
        textInput:{
            fontSize:30,
        },
        sensorDisplayRow:{
            flexDirection: 'row',
            justifyContent:'flex-start',
            alignContent:'flex-start',
            backgroundColor:'grey',
            paddingTop:10,
            paddingBottom:10
        },
        sensorDisplayColumn:{
            flexDirection:"column",
            justifyContent:"space-around",
            alignContent:"space-between",
        },
        displayRow:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignContent:"flex-start",
            paddingLeft:10
        },
        displayText:{
            fontSize:20,
        },
        intervalRow:{
            flexDirection:"row",
            justifyContent:"space-around",
            alignItems:"center"
        },
        buttonRow:{
            flexDirection:"row",
            justifyContent:"space-around",
            alignContent:"center",
            height:"30%"
        },
        button:{
            textAlign:"center",
            height: 10,
            height: "30%", 
            width: "40%",
            marginTop: 30,
            backgroundColor:"grey",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center"
        },
        startButton:{
            textAlign:"center",
            height: 10,
            height: "30%", 
            width: "40%",
            marginTop: 30,
            backgroundColor:"grey",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor: sendToServerStatus ? "red" : "green"
        },
        span:{
            height:"5%"
        }
        
    })

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.wrapperRow}>
            <TextInput
                style={styles.textInput}
                value={ipv4Address}
                onChangeText={changeIpv4Address}
            />
        </View>
        <View style={styles.wrapperRow}>
            <TextInput
                style={styles.textInput}
                value={portNum}
                onChangeText={changePortNum}
            />
        </View>

        <View style={styles.sensorDisplayRow}>
            <View style={styles.sensorDisplayColumn}>
                {
                    displayGyro.map((data,i)=>
                    <View style={styles.displayRow} key={20+i} >
                        <Text style={styles.displayText}>{`Gyro - ${axisLabels[i]}:   ${data}`}</Text>
                    </View>
                    )
                }
                <View style={styles.span}></View>
                {
                    displayAcc.map((data,i)=>
                    <View style={styles.displayRow} key={50+i} >
                        <Text style={styles.displayText}>{`Accel - ${axisLabels[i]}:   ${data}`}</Text>
                    </View>
                    )
                }
            </View>
        </View>
        {/* <View style={styles.intervalRow}>
            <Text style={styles.textInput}>{`Interval(ms): `}</Text> 
            <TextInput style={styles.textInput} onChangeText={changeInterval} value={`${interval}`}/>
        </View> */}

        <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.startButton}>
            <Text style={styles.textInput} onPress={changeSentToServerStatus}>{sendToServerStatus ? "STOP" : "START"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Text onPress={resetApp} style={styles.textInput}>CLEAR</Text>
        </TouchableOpacity>
        </View>
    </SafeAreaView>
    
  );
  
}


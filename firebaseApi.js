import firebaseConfig from './firebaseConfig.js'
import * as firebase from 'firebase'
import firestore from 'firebase/firestore'


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const sendToFirebase = (collectionName,xValue,yValue,zValue,dataTime ) => {
    console.log(typeof xValue)
    console.log(typeof dataTime)
    return firebase.firestore().collection(collectionName).add({
        dataTime: dataTime,
        xtime: {
            time: dataTime,
            value: xValue.toFixed(3)
        },
        ytime: {
            time: dataTime,
            value: yValue.toFixed(3)
        },
        ztime: {
            time: dataTime,
            value: zValue.toFixed(3)
        },
    })
}

export const sendPacketToFirestore = ({accelerometer,gyroscope}) => {
    // accelerometer = [{x,y,z,time}]
    accelerometer.map(dataObj=>{
        firebase.firestore().collection("sensor").doc("Accelerometer").collection(new Date().toJSON().slice(0,10).replace(/-/g,'')).add(dataObj)
    })

    gyroscope.map(dataObj=>{
        firebase.firestore().collection("sensor").doc("Gyroscope").collection(new Date().toJSON().slice(0,10).replace(/-/g,'')).add(dataObj)
    })
}

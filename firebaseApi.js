import firebaseConfig from './serverConfig.js'
import * as firebase from 'firebase'
import firestore from 'firebase/firestore'


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const sendToFirebase = (collectionName,xValue,yValue,zValue,dataTime ) => {
    const timeStamp = Date.now()
    return firebase.firestore().collection("sensor").doc(collectionName).collection(new Date().toJSON().slice(0,10).replace(/-/g,'')).add({
        xValue,yValue,zValue,dataTime
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

import firebaseConfig from './serverConfig.js'
import * as firebase from 'firebase'
import '@firebase/firestore';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const addData = ( collectionName,xValue,yValue,zValue,timeValue ) => {
    const timeStamp = Date.now()
    firebase.firestore().collection("sensor").doc(collectionName).collection("data").add({
        xValue,yValue,zValue,timeValue
    })
    .then((data)=>{
        console.log("STORED")
        return data
    })
    .catch(e=>console.log(e))
}

export default addData
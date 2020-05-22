import React from 'react';
import { 
  View,
} from 'react-native';


export default function FlexColCenterStart() {
  return (
        <View
          style={{
            width: '100%',
            flexDirection:'column',
            justifyContent:"flex-start",
            alignItems:'center'
          }}
        >
        </View>
    );
        
}


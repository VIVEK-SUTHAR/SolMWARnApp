import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import ImageBackGround from '../components/UI/ImageBackGround';
const Loader = ({navigation}) => {
  return (
    <ImageBackGround>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    </ImageBackGround>
  );
};

export default Loader;

const styles = StyleSheet.create({});

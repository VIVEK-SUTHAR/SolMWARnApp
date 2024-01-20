import {
    ImageBackground as RNImageBackGround,
    StyleSheet
} from 'react-native';
import React, { PropsWithChildren } from 'react';


const ImageBackGround = ({children}: PropsWithChildren) => {
  return (
    <RNImageBackGround
      style={styles.mainContainer}
      source={require("../../assets/onboard.png")}
      blurRadius={80}
      resizeMode="cover">
      {children}
    </RNImageBackGround>
  );
};

export default ImageBackGround;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
    gap: 8,
  },
});

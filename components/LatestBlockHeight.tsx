import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import useLatestBlock from '../hooks/useLatestBlock';
import { RPC_ENDPOINT } from '../constants';

const AnimatedText = Animated.createAnimatedComponent(Text);

function LatestBlock() {
  const {latestBlockHeight} = useLatestBlock();
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      opacity.setValue(1);
    });
  }, [latestBlockHeight, opacity]);

  return (
    <View style={styles.container}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={styles.label}>Blockheight :</Text>
        <AnimatedText style={[styles.blockHeight, {opacity}]}>
          {' '}
          {latestBlockHeight}
        </AnimatedText>
      </View>
      <View>
        <Text style={styles.label}>Cluster: {RPC_ENDPOINT}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    padding: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  blockHeight: {
    fontSize: 16,
    color: '#14F195',
  },
});

export default LatestBlock;

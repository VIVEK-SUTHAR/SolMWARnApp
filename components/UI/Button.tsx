import React, {ComponentProps} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

interface IButton {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  loadingLabel?: string;
  onPress: () => void;
}

export default function Button({
  children,
  variant = 'filled',
  size = 'medium',
  style,
  textStyle,
  icon,
  iconPosition = 'right',
  loadingLabel = undefined,
  isLoading = false,
  onPress,
}: IButton) {
  return (
    <TouchableOpacity
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal:
            size === 'small' ? 36 : size === 'medium' ? 48 : 60,
          paddingVertical: size === 'small' ? 12 : size === 'medium' ? 16 : 20,
          borderRadius: 50,
          backgroundColor: variant === 'filled' ? '#fff' : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
        },
        style,
      ]}
      onPress={() => {
        if (isLoading === true) {
          return;
        }
        onPress();
      }}>
      {isLoading ? (
        <View style={{flexDirection: 'row',gap:2}}>
          <ActivityIndicator size={'small'} animating={true} color={'black'} />
          <Text
            style={{
              color: variant === 'filled' ? '#000' : '#fff',
              fontSize: size === 'small' ? 12 : size === 'medium' ? 14 : 18,
              textAlign: 'center',
            }}>
            {loadingLabel ? loadingLabel : ''}
          </Text>
        </View>
      ) : (
        <>
          {icon && iconPosition === 'left' ? icon : null}
          <Text
            style={[
              {
                color: variant === 'filled' ? '#000' : '#fff',
                fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 20,
                textAlign: 'center',
              },
              textStyle,
            ]}>
            {children}
          </Text>
          {icon && iconPosition === 'right' ? icon : null}
        </>
      )}
    </TouchableOpacity>
  );
}

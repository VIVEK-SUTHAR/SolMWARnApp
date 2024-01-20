import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  ConnectWallet: undefined;
  SignMessage: undefined;
  Home: undefined;
};

/**
 *
 * RootStackScreenProps defines the props received by Evey screen in Stack
 * They will be type of Native Screen props
 */

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

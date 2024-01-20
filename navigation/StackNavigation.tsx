import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SignMessage from '../screens/SignMessage';
import Home from '../screens/Home';
import ConnectWallet from '../screens/ConnectWalletScreen';

const Stack = createNativeStackNavigator();

function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ConnectWallet" component={ConnectWallet} />
        <Stack.Screen name="SignMessage" component={SignMessage} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default StackNavigation;

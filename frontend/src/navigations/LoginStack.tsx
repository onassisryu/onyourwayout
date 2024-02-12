import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '@/screens/Login';
import Signup0 from '@/screens/Signup/Signup0';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup5a from '@/screens/Signup/Signup5a';
import Signup6 from '@/screens/Signup/Signup6';
import Signup7 from '@/screens/Signup/Signup7';
import Signup8 from '@/screens/Signup/Signup8';
import Signup9 from '@/screens/Signup/Signup9';
import Main from '@/screens/Main';
const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'Login'}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup0" component={Signup0} />
      <Stack.Screen name="Signup1" component={Signup1} />
      <Stack.Screen name="Signup2" component={Signup2} />
      <Stack.Screen name="Signup3" component={Signup3} />
      <Stack.Screen name="Signup4" component={Signup4} />
      <Stack.Screen name="Signup5" component={Signup5} />
      <Stack.Screen name="Signup5a" component={Signup5a} />
      <Stack.Screen name="Signup6" component={Signup6} />
      <Stack.Screen name="Signup7" component={Signup7} />
      <Stack.Screen name="Signup8" component={Signup8} />
      <Stack.Screen name="Signup9" component={Signup9} />
    </Stack.Navigator>
  );
};
export default LoginStack;

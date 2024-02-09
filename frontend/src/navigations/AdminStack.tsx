import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AdminMain from '@/screens/Admin/AdminMain';

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'AdminMain'}>
      <Stack.Screen name="AdminMain" component={AdminMain} />
    </Stack.Navigator>
  );
};
export default AdminStack;

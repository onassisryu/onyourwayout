/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//recoil&react-query
import {RecoilRoot} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ThemeProvider} from '@emotion/react';
import theme from '@/Theme';
import Home from '@screens/Home';
import Location from '@screens/Location';
import Chat from '@screens/Chat';
import Apart from '@screens/Apart';
import My from '@screens/My';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {NavigationContainer} from '@react-navigation/native';

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const queryClient = new QueryClient();
  const BottomTab = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
            fontweight: 'bold',
          },
          tabBarActiveTintColor: '#27D894',
          tabBarLabelStyle: {
            fontWeight: 'bold', // 글씨 두께 설정
          },
          tabBarInactiveLabelStyle: {
            color: 'black', // 선택되지 않은 탭의 글씨 색상
            fontWeight: 'normal', // 선택되지 않은 탭의 글씨 두께 설정
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName!: string;

            if (route.name === '홈') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '위치') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === '채팅') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            } else if (route.name === '아파트') {
              iconName = focused ? 'office-building' : 'office-building-outline'; // Material 아이콘 사용
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === '내정보') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionic name={iconName!} size={size} color={color} />;
          
          },

          
        })}>
        <Tab.Screen name="홈" component={Home} />
        <Tab.Screen name="위치" component={Location} />
        <Tab.Screen name="아파트" component={Apart} />
        <Tab.Screen name="채팅" component={Chat} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };
  return (
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <ThemeProvider theme={theme}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Bottom" component={BottomTab} />
              </Stack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default App;

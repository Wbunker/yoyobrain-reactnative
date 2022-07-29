import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Auth, Hub} from 'aws-amplify';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import SignInScreen from './screens/authentication/SignInScreen';
import SignUpScreen from './screens/authentication/SignUpScreen';
import ConfirmEmailScreen from './screens/authentication/ConfirmEmailScreen';
import NewPasswordScreen from './screens/authentication/NewPasswordScreen';
import ForgotPasswordScreen from './screens/authentication/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

const Navigation = () => {
  const [user, setUser] = useState(undefined);

  const checkUser = () => {
    Auth.currentAuthenticatedUser({bypassCache: true})
      .then(authUser => {
        setUser(authUser);
      })
      .catch(() => {
        setUser(null);
      });
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      if (['signIn', 'signOut'].includes(data.payload.event)) {
        checkUser();
      }
    };

    Hub.listen('auth', listener);
    
    return () => {
      Hub.remove('auth', listener);
    }
    
  }, []);

  if (user === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user === null ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          </>
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

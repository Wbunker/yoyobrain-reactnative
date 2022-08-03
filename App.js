import { LogBox, SafeAreaView, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
// Get the aws resources configuration parameters
import awsconfig from './src/aws-exports'; // if you are using Amplify CLI
import Navigation from './src/Navigation';
import {  useEffect, useState } from 'react';
import { darkTheme, theme } from './src/styles/theme';
import { ThemeContext } from './src/styles/theme-context';
import useAuth, {AuthProvider } from './src/hooks/useAuth';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
window.LOG_LEVEL = 'DEBUG'





const App = () => {

  const {setLoading} = useAuth();

  const isLocalhost = Boolean(
    window?.location?.hostname === "localhost" ||
      // [::1] is the IPv6 localhost address.
      window?.location?.hostname === "[::1]" ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window?.location?.hostname?.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
  );

  const urlOpener = async (url, redirectUrl) => {
    const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(
        url,
        redirectUrl
    );
  
    if (type === 'success' && Platform.OS === 'ios') {
        WebBrowser.dismissBrowser();
        return Linking.openURL(newUrl);
    }
  }

  const redirectSignIn = () => {
    const [
        webLocalRedirectSignIn,
        webProductionRedirectSignIn
      ] = awsconfig.oauth.redirectSignIn.split(",");
      
    if (Platform.OS === 'web') {
      console.log(isLocalhost ? webLocalRedirectSignIn : webProductionRedirectSignIn)
      return isLocalhost ? webLocalRedirectSignIn : webProductionRedirectSignIn;
    }
  
    return  Linking.createURL('/signin') //phoneLocalRedirectSignIn;
  }
  const redirectSignOut = () => {
    const [
        webLocalRedirectSignOut,
        webProductionRedirectSignOut
      ] = awsconfig.oauth.redirectSignOut.split(",");
          
    if (Platform.OS === 'web') {
      return isLocalhost ? webLocalRedirectSignOut : webProductionRedirectSignOut;
    }
  
    return Linking.createURL('/signout') // phoneLocalRedirectSignOut
  
  }
  


  useEffect(() => {

    if (window?.LOG_LEVEL === 'DEBUG') {
      console.log('******************************************************')
      console.log('redirectSignIn', redirectSignIn())
      console.log('redirectSignOut', redirectSignOut())  
      console.log('******************************************************')
    }

    let updatedAwsConfig = {
      ...awsconfig,
      oauth: {
        ...awsconfig.oauth,
        redirectSignIn: redirectSignIn(),
        redirectSignOut: redirectSignOut(),
      },
      Analytics: {
        disabled: true,
      },
    
    }
    
    if (Platform.OS !== 'web') {
      updatedAwsConfig = {
        ...updatedAwsConfig,
        oauth: {
          ...updatedAwsConfig.oauth,
          urlOpener,
        },
      }  
    }
    
    Amplify.configure(updatedAwsConfig);
  }, [])
  const [darkMode, setDarkMode] = useState(false)

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <AuthProvider>
        <SafeAreaView style={styles.root}>
          <Navigation />
        </SafeAreaView>
      </AuthProvider>
    </ThemeContext.Provider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});

export default App;

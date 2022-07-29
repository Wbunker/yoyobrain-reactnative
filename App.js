import { SafeAreaView, StyleSheet } from 'react-native';
import { Amplify } from 'aws-amplify';
// Get the aws resources configuration parameters
import awsconfig from './src/aws-exports'; // if you are using Amplify CLI
import Navigation from './src/Navigation';
import { useState } from 'react';
import { darkTheme, theme } from './src/styles/theme';
import { ThemeContext } from './src/styles/theme-context';
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});


const App = () => {

  const [darkMode, setDarkMode] = useState(false)

  return (
    <ThemeContext.Provider value={darkMode ? darkTheme : theme}>
      <SafeAreaView style={styles.root}>
        <Navigation />
      </SafeAreaView>
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

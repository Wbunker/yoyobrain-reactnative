import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Auth} from 'aws-amplify';

const HomeScreen = () => {
  const signOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }    
  };

  return (
    <View>
      <Text style={styles.text}>Home Sweet Home</Text>
      <Text onPress={signOut} style={styles.signout}>
        Sign out
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    alignSelf: 'center',
  },
  signout: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
    marginTop: 'auto',
    marginVertical: 20,
    fontSize: 20,
  },
});

export default HomeScreen;

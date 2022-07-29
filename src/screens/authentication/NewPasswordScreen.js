import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import React from 'react';
import {useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Text, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const NewPasswordScreen = () => {
  const {control, handleSubmit} = useForm();
  const navigation = useNavigation();

  const onSubmitPressed = async data => {
    try {
      await Auth.forgotPasswordSubmit(data.username, data.code, data.password);
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
    navigation.navigate('Home');
  };

  const onBackToSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset Your Password</Text>
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{required: 'Username is required'}}
        />
        <CustomInput
          name="code"
          placeholder="Enter the code"
          control={control}
          rules={{required: 'Code is required'}}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be a minimum of 8 characters',
            },
          }}
          secureTextEntry
        />
        <CustomButton onPress={handleSubmit(onSubmitPressed)} text="Submit" />

        <CustomButton
          onPress={onBackToSignInPressed}
          text="Back to Sign In"
          type="Tertiary"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051c60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default NewPasswordScreen;

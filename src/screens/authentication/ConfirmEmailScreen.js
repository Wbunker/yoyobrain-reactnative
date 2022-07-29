import {useNavigation, useRoute} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import React from 'react';
import {useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Text, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const ConfirmEmailScreen = () => {
  const route = useRoute();
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      username: route?.params?.username,
    },
  });
  const username = watch('username');

  const navigation = useNavigation();

  const onConfirmPressed = async data => {
    try {
      await Auth.confirmSignUp(data.username, data.code);
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };

  const onResendCodePressed = async () => {
    try {
      await Auth.resendSignUp(username);
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };

  const onBackToSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your email</Text>
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Username should be max 24 characters long',
            },
          }}
        />
        <CustomInput
          name="code"
          placeholder="Enter your confirmation code"
          control={control}
          rules={{required: 'Code is required'}}
        />
        <CustomButton onPress={handleSubmit(onConfirmPressed)} text="Confirm" />

        <CustomButton
          onPress={onResendCodePressed}
          text="Resend Code"
          type="Secondary"
        />

        <CustomButton
          onPress={onBackToSignInPressed}
          text="Back to Sign In"
          type="Secondary"
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

export default ConfirmEmailScreen;

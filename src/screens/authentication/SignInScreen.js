import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, Image, StyleSheet, ScrollView, Alert} from 'react-native';
import Logo from '../../../assets/images/Logo.gif';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SocialSigninButtons from '../../components/SocialSigninButtons';

const SignInScreen = () => {
  const navigation = useNavigation();
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }
    setLoading(true);

    // validate user
    console.log(data);
    try {
      const response = await Auth.signIn(data.username, data.password);
    } catch (e) {
      Alert.alert('Oops', e.message);
    }

    setLoading(false);
  };

  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image source={Logo} style={styles.logo} risizeMode="contain" />
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{required: 'Username is required'}}
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
        <CustomButton
          onPress={handleSubmit(onSignInPressed)}
          text={loading ? 'Loading....' : 'Sign in'}
        />
        <CustomButton
          onPress={onForgotPasswordPressed}
          text="Forgot password?"
          type="Tertiary"
        />
        <SocialSigninButtons />
        <CustomButton
          onPress={onSignUpPressed}
          text="Don't have an account? Create one"
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
  logo: {
    width: '65%',
    maxWidth: 346,
  },
});

export default SignInScreen;

import {useNavigation} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {View, StyleSheet, ScrollView, Text, Alert} from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import SocialSigninButtons from '../../components/SocialSigninButtons';

const SignUpScreen = () => {
  const {control, handleSubmit, watch} = useForm();
  const pwd = watch('password');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onRegisterPressed = async data => {
    const {username, password, email, name} = data;
    if (loading) {
      return;
    }
    setLoading(true);

    // validate user
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
          name,
          prefered_username: username,
        },
      });
      navigation.navigate('ConfirmEmail', {username});
    } catch (e) {
      Alert.alert('Oops', e.message);
    }

    setLoading(false);
    // ;
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };

  const termsOfUsePressed = () => {
    console.warn('TermsofUse');
  };

  const privacyPolicyPressed = () => {
    console.warn('Privacy Policy');
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an account</Text>
        <CustomInput
          name="name"
          placeholder="Name"
          control={control}
          rules={{
            required: 'Name is required',
            minLength: {
              value: 3,
              message: 'Name should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Name should be max 24 characters long',
            },
          }}
        />
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{required: 'Email is required'}}
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
        <CustomInput
          name="passwordRepeat"
          control={control}
          rules={{
            required: 'You must type in password twice',
            validate: value => value === pwd || 'The passwords must match',
          }}
          placeholder="Repeat Password"
          secureTextEntry
        />
        <CustomButton
          onPress={handleSubmit(onRegisterPressed)}
          text="Register"
        />
        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={termsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={privacyPolicyPressed}>
            Privacy Policy
          </Text>
        </Text>
        <SocialSigninButtons />
        <CustomButton
          onPress={onSignInPressed}
          text="Have an account? Sign In"
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

export default SignUpScreen;

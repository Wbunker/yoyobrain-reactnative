import React from 'react';
import CustomButton from './CustomButton';

function SocialSigninButtons() {
  const onSignInFacebookPressed = () => {
    console.warn('Sign In Facebook');
  };

  const onSignInGooglePressed = () => {
    console.warn('Sign In Google');
  };

  const onSignInApplePressed = () => {
    console.warn('Sign In Apple');
  };

  return (
    <>
      <CustomButton
        onPress={onSignInFacebookPressed}
        text="Sign In with Facebook"
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />
      <CustomButton
        onPress={onSignInGooglePressed}
        text="Sign In with Google"
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />
      <CustomButton
        onPress={onSignInApplePressed}
        text="Sign In with Apple"
        bgColor="#E3E3E3"
        fgColor="#363636"
      />
    </>
  );
}

export default SocialSigninButtons;

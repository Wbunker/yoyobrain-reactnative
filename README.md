# Documentation of Software installation

## Create an expo backed project
1. npx create-expo-app yoyobrain-reactnative

## Add Amplify
1. amplify init

## Add Cognito Auth to Amplify
1. amplify add auth
2. amplify push

## Add Navigation to project
1. expo install @react-navigation/native
2. expo install react-native-screens react-native-safe-area-context
3. expo install @react-navigation/native-stack react-native-gesture-handler @react-navigation/stack

## Add Google Authentication
1. expo install expo-auth-session expo-random expo-application expo-web-browser expo-constants expo-linking
2. expo install react-native-dotenv
3. Add Apps outlined in : https://docs.expo.dev/guides/authentication/#google
	1. expoClientId: Proxy client ID for use in the Expo Go on iOS and Android.
	2. iosClientId: iOS native client ID for use in standalone and bare workflow.
	3. androidClientId: Android native client ID for use in standalone, bare workflow.
	4. webClientId: Expo web client ID for use in the browser.
4. add environment variables to .env and add this to .gitignore
5. Add secrets to Expo build environment https://docs.expo.dev/build-reference/variables/#adding-secrets-with-eas-cli
```
eas secret:create
```

https://docs.amplify.aws/lib/auth/social/q/platform/js/#setup-your-auth-provider
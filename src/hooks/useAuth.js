import React, {
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
  } from "react";
  import * as Google from "expo-auth-session/providers/google";
  import Constants from "expo-constants";
import { Auth,  Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import * as Linking from 'expo-linking';
import { ResponseType } from 'expo-auth-session';


  const AuthContext = createContext({});
  
  const secrets = Constants?.manifest?.extra || Constants?.manifest2?.extra;

  export const AuthProvider = ({ children }) => {
  
    const responseType = ResponseType.Token
    const [error, setError] = useState(null);
    const [user, setUser] = useState(undefined);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);
  
    const [_request, googleLoginResult, promptGoogle] = Google.useAuthRequest({
      androidClientId: secrets?.androidClientId ?? process.env.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: secrets?.iosClientId ?? process.env.GOOGLE_IOS_CLIENT_ID,
      expoClientId: secrets?.expoClientId ?? process.env.GOOGLE_EXPO_CLIENT_ID,
      webClientId: secrets?.webClientId ?? process.env.GOOGLE_WEB_CLIENT_ID,
      scopes: ["profile", "email", "openid"],
      responseType: responseType,
    });
          

    const logout = () => {
      setLoading(true);
      Auth.signOut()
        .catch((error) => setError(error))
        .finally(() => {
          setLoading(false);
        });
    };

    const _handleUrl = ({ url }) => {

        let { hostname, path, queryParams } = Linking.parse(url);
        console.log(
          `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
            queryParams
          )}`
        );
      };
      Linking.addEventListener('url', _handleUrl)
  

     
    const signInWithGoogle = () => {
        setLoading(true);
        Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google})
        .then(credentials => {
          console.log('get aws credentials', credentials);
        }).catch(e => {
          console.log(e);
        });
      // promptGoogle()
      //   .then(async (loginResult) => {
      //     console.log(`Response for responseType: ${responseType}`);
      //     console.log(loginResult)
      //     console.log('What is returned by googleLoginResult')
      //     console.log(googleLoginResult)
      //     if (loginResult?.type === "success") {
      //       console.log('We had a type of success*****************************')
      //       // const idToken = loginResult.params.id_token;
      //       if (responseType === ResponseType.Token) {
      //         const authToken = loginResult.authentication.accessToken;
      //         const expires = parseInt(loginResult.authentication.expiresIn,10) * 1000 + new Date().getTime();

      //         const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      //           method: 'GET',
      //           headers: {
      //             Accept: 'application/json',
      //             Authorization: `Bearer ${authToken}`,
      //             'Content-Type': 'application/json'
      //           },
      //         });


      //         userInfo =  await response.json();
      //         console.log(`Going to try to login with accessToken: ${authToken} that expires: ${expires}`)
      //         // console.log('*********************************************************')
      //         // const signInInfo = {
      //         //   provider: CognitoHostedUIIdentityProvider.Google, 
      //         //   response: {token: authToken,  expires_at: expires }, 
      //         //   user: {email: userInfo.email, name: userInfo.name}
      //         // }
      //         // console.log(signInInfo)
      //         // console.log('*********************************************************')
      //         Auth.federatedSignIn('google', {token: accessToken, expires_at: expires}, {name: userInfo.id})
      //         .then(credentials => {
      //           console.log('get aws credentials', credentials);
      //         }).catch(e => {
      //           console.log(e);
      //         });
      //       }

      //       if (responseType === ResponseType.IdToken) {
      //         const idToken = loginResult.params.id_token;
      //         const expires = 3599 * 1000 + new Date().getTime();
      //         console.log(`Going to try to login with id token: ${idToken}`)
      //         const signInInfo = {
      //           provider: 'google', 
      //           response: {token: idToken,  expires_at: expires }
      //         }
      //         console.log(signInInfo)
      //         Auth.federatedSignIn(signInInfo)
      //         .then(credentials => {
      //           console.log('get aws credentials', credentials);
      //         }).catch(e => {
      //           console.log(e);
      //         });

      //       }
      //       // Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google }).then(() => {
      //       // }).catch(err => {
      //       //     console.log('error signing in', err);
      //       //     setLoading(false);
      //       // })
      //       // Auth.federatedSignIn(CognitoHostedUIIdentityProvider.Google, {token: idToken})
      //       // .then(credentials => {
      //       //   console.log('get aws credentials', credentials);
      //       // }).catch(e => {
      //       //   console.log(e);
      //       // });
        
      //     } else {
      //       throw new Error("Google login failed");
      //     }
      //   })
      //   .catch((error) => setError(error))
      //   .finally(() => setLoading(false));
    };
  
    const checkUser =  () => {
        Auth.currentAuthenticatedUser({bypassCache: true})
        .then(authUser => {
            setUser(authUser);
        })
        .catch(error => {
            console.log('currentAuthenticatedUser error');
            console.log(error)
            setUser(null);
        }).finally(() => {
            setLoadingInitial(false);
            setLoading(false)
        });
  
    };
      
      useEffect(() => {
        checkUser();
      }, []);
      
      useEffect(() => {
        const listener = ({payload}) => {
          const {event} = payload;
          console.log('event', event);
          if (['signIn', 'signOut'].includes(event)) {
            checkUser();
          } else if (event === 'autoSignIn') {
            setUser(payload.data)            
          }
        };
      
        Hub.listen('auth', listener);
        
        return () => {
          Hub.remove('auth', listener);
        }
        
      }, []);
        
    const memoedValue = useMemo(
      () => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
        setLoading,
      }),
      [user, loading, error]
    );
  
    return (
      <AuthContext.Provider value={memoedValue}>
        {!loadingInitial && children}
      </AuthContext.Provider>
    );
  };
  
  export default function useAuth() {
    return useContext(AuthContext);
  }
  
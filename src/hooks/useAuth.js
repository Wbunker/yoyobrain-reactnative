import React, {
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
  } from "react";
  import * as Google from "expo-auth-session/providers/google";
  import Constants from "expo-constants";
import { Auth, Hub } from "aws-amplify";
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import * as Linking from 'expo-linking';


  const AuthContext = createContext({});
  
  const secrets = Constants?.manifest?.extra || Constants?.manifest2?.extra;

  export const AuthProvider = ({ children }) => {
  
    const [error, setError] = useState(null);
    const [user, setUser] = useState(undefined);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);
  
    console.log('******************************************************')
    console.log(secrets?.androidClientId)
    console.log(secrets?.androidClientId ?? process.env.GOOGLE_ANDROID_CLIENT_ID)
    const [_request, _loginResult, promptGoogle] = Google.useAuthRequest({
      androidClientId: secrets?.androidClientId ?? process.env.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: secrets?.iosClientId ?? process.env.GOOGLE_IOS_CLIENT_ID,
      expoClientId: secrets?.expoClientId ?? process.env.GOOGLE_EXPO_CLIENT_ID,
      webClientId: secrets?.webClientId ?? process.env.GOOGLE_WEB_CLIENT_ID,
      scopes: ["profile", "email", "openid"],
      responseType: "id_token",
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
        Auth.federatedSignIn({provider: CognitoHostedUIIdentityProvider.Google }).then(() => {
        }).catch(err => {
            console.log('error signing in', err);
            setLoading(false);
        })
    //   setLoading(true);
    //   promptGoogle()
    //     .then((loginResult) => {
    //       if (loginResult?.type === "success") {
    //         const idToken = loginResult.params.id_token;
    //         const credential = GoogleAuthProvider.credential(idToken);
    //         signInWithCredential(auth, credential).then(() => {
    //           console.log("Logged in");
    //         });
    //       } else {
    //         throw new Error("Google login failed");
    //       }
    //     })
    //     .catch((error) => setError(error))
    //     .finally(() => setLoading(false));
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
  
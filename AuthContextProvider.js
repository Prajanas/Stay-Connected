import React, { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { database } from "../other/firebase.config";
import { onValue, ref } from "firebase/database";

export const AuthContext = React.createContext();
function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [user, setUser] = useState(null);

  GoogleSignin.configure({
    webClientId:
      "215283414590-km5e5kphnh11m8ucdmi9cpkagpafdnm2.apps.googleusercontent.com",
  });

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((userAuthSnap) => {
      setUserAuth(userAuthSnap);
      if (userAuthSnap) {
        onValue(ref(database, `users/${userAuthSnap.uid}`), (snapshot) => {
          setUser(snapshot.val());
          setLoading(false);
        });
      } else {
        setUser(null);
        setUserAuth(null);
        setLoading(false);
      }
    });
    return () => {
      subscriber();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{ userAuth, setUserAuth, user, setUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;

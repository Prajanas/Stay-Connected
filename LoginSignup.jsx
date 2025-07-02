import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import logo from "../assets/img/icon.png";
import bg from "../assets/img/bg.jpg";
import google from "../assets/img/google.png";
import { TouchableOpacity } from "react-native";
import { getUser } from "../utils/user_functions/get_user";
import { createUser } from "../utils/user_functions/create_user";

const LoginSignup = () => {
  const [loading, setLoading] = useState(false);

  async function onGoogleButtonPress() {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userData = await auth().signInWithCredential(googleCredential);

      // save to database
      const isUserExist = await getUser(userData.user.uid);
      if (!isUserExist) {
        const userCreated = await createUser(
          userData.user.displayName,
          userData.user.email,
          userData.user.photoURL,
          userData.user.uid
        );
      }
    } catch (error) {
      alert("Login failed, try again later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ImageBackground
      source={bg}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={logo}
        style={{ width: 150, height: 150, marginBottom: 20 }}
      />
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "white",
          marginBottom: 10,
        }}
      >
        Welcome to Stay Connect
      </Text>
      <Text
        style={{
          fontSize: 16,
          color: "white",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        Bridges Beyond Distance
      </Text>

      {loading ? (
        <ActivityIndicator color="white" size="large" />
      ) : (
        <TouchableOpacity
          onPress={onGoogleButtonPress}
          className="bg-btnText flex-row items-center space-x-3 p-3 rounded-md py-2"
        >
          <Image source={google} className="w-8 h-8 rounded-full" />
          <Text>Sign in with Google</Text>
        </TouchableOpacity>
      )}
    </ImageBackground>
  );
};

export default LoginSignup;

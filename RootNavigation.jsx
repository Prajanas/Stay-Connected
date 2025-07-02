import React, { useContext, useState } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import bg from "../assets/img/bg.jpg";
import * as SecureStore from "expo-secure-store";

import MainNavigation from "./MainNavigation";
import LoginSignup from "../pages/LoginSignup";
import { AuthContext } from "../context/AuthContextProvider";
import { ActivityIndicator } from "react-native";
import { ImageBackground } from "react-native";
import { StatusBar } from "react-native";
import BoardingScreen from "../pages/BoardingScreen";

const RootNavigation = () => {
  const { user, loading } = useContext(AuthContext);
  const [firstVisit, setFirstVisit] = useState(false);

  React.useEffect(() => {
    const getFirstVisit = async () => {
      const firstVisit = await SecureStore.getItemAsync("firstVisit");
      if (!firstVisit) {
        setFirstVisit(true);
      }
    };
    getFirstVisit();
  }, []);

  if (loading) {
    return (
      <ImageBackground
        source={bg}
        className="flex-1 justify-center items-center"
      >
        <ActivityIndicator size="large" color="white" />
      </ImageBackground>
    );
  }

  if (firstVisit) {
    return <BoardingScreen setFirstVisit={setFirstVisit} />;
  }

  if (!user || !user.user_id) {
    return (
      <View className="flex-1">
        <LoginSignup />
      </View>
    );
  }

  return (
    <>
      <StatusBar backgroundColor={"#FF4081"} />

      <NavigationContainer>
        <MainNavigation />
      </NavigationContainer>
    </>
  );
};

export default RootNavigation;

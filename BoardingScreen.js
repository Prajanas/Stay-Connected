import React from "react";
import { View, Image } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import * as SecureStore from "expo-secure-store";
import s1 from "../assets/anim/s1.gif";
import s2 from "../assets/anim/s2.gif";
import s3 from "../assets/anim/s3.gif";
import s4 from "../assets/anim/s4.gif";

const OnboardingScreen = ({ setFirstVisit }) => {
  const pages = [
    {
      backgroundColor: "#FF4081",
      image: <Image source={s1} style={{ width: 200, height: 200 }} />,
      title: "Welcome to Stay Connect",
      subtitle: "Track live of friends, family and delivery boy.",
    },
    {
      backgroundColor: "#FF4081",
      image: <Image source={s2} style={{ width: 200, height: 200 }} />,
      title: "Real-Time Tracking",
      subtitle: "Stay updated with real-time location information.",
    },
    {
      backgroundColor: "#FF4081",
      image: <Image source={s3} style={{ width: 200, height: 200 }} />,
      title: "Easy to Use",
      subtitle: "Simple and intuitive interface for effortless tracking.",
    },
    {
      backgroundColor: "#FF4081",
      image: <Image source={s4} style={{ width: 200, height: 200 }} />,
      title: "Stay Connected",
      subtitle: "Never lose sight of your valuables.",
    },
  ];

  const handleBoardingComplete = async () => {
    await SecureStore.setItemAsync("firstVisit", "true");
    setFirstVisit(false);
  };

  return (
    <Onboarding
      pages={pages}
      onDone={handleBoardingComplete}
      containerStyles={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      titleStyles={{ fontSize: 24 }}
      subTitleStyles={{ fontSize: 16 }}
    />
  );
};

export default OnboardingScreen;

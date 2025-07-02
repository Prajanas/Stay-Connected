import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  DrawerContent,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContextProvider";
import { Share } from "react-native";

const Custom_Main_Drawer_Navigator = (props) => {
  const { userAuth, setUserAuth, user, setUser } = useContext(AuthContext);
  const logOutHandler = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await auth().signOut();
    setUserAuth(false);
    setUser({});
  };
  const shareAppHandler = () => {
    Share.share({
      message:
        "Hey! I am using this app to get location of people/bus/deliveries. You can also download this app from unknown source",
    });
  };
  return (
    <View className="flex-1">
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#FF4081" }}
      >
        {/* profile section */}
        <View className="p-5 space-y-2">
          <Image
            source={{
              uri: user.user_photo,
            }}
            className="w-14 h-14 rounded-full"
          />
          <Text className="text-btnText text-lg">{user.user_name}</Text>
        </View>

        <View className="bg-appBg">
          <DrawerContent {...props} />
        </View>
      </DrawerContentScrollView>
      <View className="p-3 pl-4 pb-4 border-t border-t-gray-300 bg-appBg gap-3">
        <TouchableOpacity
          onPress={shareAppHandler}
          className="flex-row items-center space-x-4 py-2"
        >
          <Ionicons name="share-social-outline" size={24} color="#666666" />
          <Text className="font-semibold text-paragraph">Tell a friend</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logOutHandler}
          className="flex-row items-center space-x-4 py-2"
        >
          <SimpleLineIcons name="logout" size={24} color="#666666" />
          <Text className="font-semibold text-paragraph">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Custom_Main_Drawer_Navigator;

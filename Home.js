import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Share,
  Alert,
} from "react-native";
import useLocation from "../hooks/useLocation";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import ghost from "../assets/anim/ghost.gif";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { NumberDictionary, uniqueNamesGenerator } from "unique-names-generator";
import { createGroup } from "../utils/group_functions/create_group";
import { AuthContext } from "../context/AuthContextProvider";
import { ActivityIndicator } from "react-native";
import { get, onValue, query, ref } from "firebase/database";
import { database } from "../other/firebase.config";
import { deleteGroup } from "../utils/group_functions/delete_group";
import { TextInput } from "react-native";
import { joinGroup } from "../utils/group_functions/join_group";
import { leaveGroup } from "../utils/group_functions/leave_group";
import { Clipboard } from "react-native";
import { updateLocationInGroup } from "../utils/group_functions/update_location";
import { updateLocation as updateLocationForUserFunc } from "../utils/user_functions/update_location";
import Map from "../components/Map";
import MapView from "react-native-maps";

const Home = () => {
  const navigation = useNavigation();
  const { userData } = useLocation();
  const mapRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [joiningGroupCode, setJoiningGroupCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [groupJoined, setGroupJoined] = useState(false);
  const [groupData, setGroupData] = useState({
    group_id: "",
    admin_id: "",
    group_name: "",
    group_members: [],
  });

  const showConfirmDialog = (func, title, message) => {
    Alert.alert(
      title || "Confirm Action",
      message || "Are you sure you want to perform this action?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            await func();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleMapPressed = () => {
    navigation.navigate("Map");
  };

  const handleCreateGroup = async () => {
    try {
      setLoading(true);
      const groupId = uniqueNamesGenerator({
        dictionaries: [NumberDictionary.generate({ min: 100000, max: 999999 })],
        length: 1,
      });
      const response = await createGroup(
        user.user_name + "'s group",
        user.user_id,
        groupId
      );
    } catch (error) {
      alert("Oops! Something went wrong");
    }
    setLoading(false);
  };

  const updateLocationForUser = async () => {
    try {
      if (!userData) return;
      if (!user) return;
      const response = await updateLocationForUserFunc(user.user_id, userData);
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation = async () => {
    try {
      if (!userData) return;
      if (!user) return;
      if (!user.joined_group) return;

      const response = await updateLocationInGroup(
        user.joined_group,
        user.user_id,
        userData
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDismissGroup = async () => {
    try {
      const response = await deleteGroup(groupData.group_id);
      if (response) {
        setGroupJoined(false);
        setGroupData({
          group_id: "",
          group_name: "",
          group_members: [],
          admin_id: "",
        });
      }
    } catch (error) {
      alert("Oops! Something went wrong");
    }
  };

  const joinGoupUsingCode = async () => {
    try {
      const response = await joinGroup(joiningGroupCode, user.user_id);
    } catch (error) {
      alert(error?.message || "Oops! Something went wrong");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await leaveGroup(groupData.group_id, user.user_id);
      if (response) {
        setGroupJoined(false);
        setGroupData({
          group_id: "",
          group_name: "",
          group_members: [],
          admin_id: "",
        });
      }
    } catch (error) {
      Alert.alert(error?.message || "Oops! Something went wrong");
    }
  };

  const handleKickUser = async (userId) => {
    try {
      const response = await leaveGroup(groupData.group_id, userId);
    } catch (error) {
      Alert.alert(error?.message || "Oops! Something went wrong");
    }
  };

  const shareGroupDetail = () => {
    Share.share({
      message: `Lets track live location with this group. Join using this group id: ${groupData.group_id}. Download the Candle Connect and get connect with your friends.`,
      title: "Join my group",
    });
  };

  const copyToClipboard = () => {
    Clipboard.setString(groupData.group_id);
  };

  useEffect(() => {
    if (userData && userData?.latitude && mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: userData.latitude,
            longitude: userData.longitude,
          },
          zoom: 15,
        },
        { duration: 1000 }
      );
    }
  }, [userData?.latitude, userData?.longitude]);

  useEffect(() => {
    if (user?.joined_group) {
      async function getGroupData() {
        const groupRef = ref(database, `groups/${user.joined_group}`);
        onValue(groupRef, async (snapshot) => {
          const data = await snapshot.val();
          setGroupData({
            group_id: user.joined_group,
            group_name: data.group_name,
            group_members: data.group_members || [],
            admin_id: data.admin_id,
          });
          setGroupJoined(true);
        });
      }
      getGroupData();
    }
  }, [user?.joined_group]);

  useEffect(() => {
    updateLocationForUser();
    updateLocation();
  }, [userData]);

  return (
    <ScrollView className="bg-blue-300">
      {/* Map */}
      <Map
        myLocation={userData}
        groupMembersLocations={groupData.group_members}
      />

      <View className="rounded-t-3xl bg-appBg flex-1">
        {/* h1 */}
        {!groupJoined && (
          <View className="flex items-center justify-center p-3">
            <View className="flex items-center justify-center mb-3">
              <Text className="text-2xl font-semibold text-heading">
                No one is here
              </Text>
              <Text className="text-lg text-paragraph mt-1">
                Create a group and invite your friends
              </Text>
            </View>
            <Image source={ghost} className="w-48 h-48" />
          </View>
        )}

        {/* h2 */}
        {groupJoined && (
          <View className="flex items-center justify-center flex mb-3 p-3">
            <Text className="text-2xl font-semibold text-heading">
              {groupData.group_name}
            </Text>
            <Text className="text-lg text-paragraph mt-1">
              Your location is shared with members of this group
            </Text>

            {/* copy and share */}
            <View className="p-4 flex-row items-center justify-center gap-4">
              <TouchableOpacity
                onPress={() => copyToClipboard()}
                className="bg-white w-full p-4 rounded-md shadow-md flex items-center flex-1"
              >
                <Entypo name="copy" size={24} color="#333" />
                <Text className="text-heading text-lg mx-2 mt-2">
                  {groupData.group_id}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={shareGroupDetail}
                className="bg-white w-full p-4 rounded-md shadow-md flex items-center flex-1"
              >
                <FontAwesome name="share" size={24} color="#333" />
                <Text className="text-heading text-lg mx-2 mt-2">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Create Group or Join Group */}
        {!groupData.group_id && (
          <View className="p-6 bg-white rounded-lg shadow-md">
            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                showConfirmDialog(
                  handleCreateGroup,
                  "Create Group",
                  "Are you sure you want to create a new group? You will be the admin of this group and you can add/remove members from this group."
                );
              }}
              className="bg-btnBg rounded-md p-3 flex items-center justify-center mb-4"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-btnText font-semibold">Create Group</Text>
              )}
            </TouchableOpacity>

            <Text className="text-center text-gray-500 mb-2">
              Or join a group using group code
            </Text>
            <View className="flex flex-row items-center justify-center gap-4">
              <TextInput
                placeholder="Enter Group Code"
                placeholderTextColor="#999"
                className="border border-gray-300 rounded-md px-5 py-2 flex-1"
                onChangeText={(text) => setJoiningGroupCode(text)}
                value={joiningGroupCode}
              />

              <TouchableOpacity
                onPress={() => {
                  if (joiningGroupCode.length < 6) {
                    alert("Group code must be 6 characters long");
                    return;
                  }
                  showConfirmDialog(
                    () => joinGoupUsingCode(),
                    "Join Group",
                    "Are you sure you want to join this group? You will be able to see the location of all the members of this group."
                  );
                }}
                className="bg-btnBg rounded-md px-5 py-3"
              >
                <Text className="text-btnText font-semibold">Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* group info */}
        <View className="border-t border-gray-300 my-4" />
        <View className="p-4">
          <Text className="text-xl font-semibold mb-3 text-heading">
            Recent Activity
          </Text>
          <View className="flex flex-row items-center mb-2 gap-5">
            <Entypo name="user" size={24} color="#e3e3e3" />
            <View>
              <Text className="text-heading">User 1 joined Group A</Text>
              <Text className="text-paragraph text-sm">2 hours ago</Text>
            </View>
          </View>
        </View>

        {/* recommended groups */}
        <View className="border-t border-gray-300 my-4" />
        <View className="p-4">
          <Text className="text-xl font-semibold mb-3 text-heading">
            Recommended Groups
          </Text>
          <View className="flex flex-row items-center mb-2 gap-5">
            <FontAwesome name="group" size={24} color="#e3e3e3" />
            <View>
              <Text className="text-heading">Group B</Text>
              <Text className="text-paragraph text-sm">Created by User 2</Text>
            </View>
          </View>
        </View>

        {/* current group */}
        {groupData.group_id && (
          <>
            <View className="border-t border-gray-300 my-4" />
            <View className="p-4">
              <Text className="text-xl font-semibold mb-3 text-heading">
                Current Group Members
              </Text>

              {/* users with "-" btn to remove */}
              {groupData?.group_members.length > 0 &&
                groupData.group_members.map((member, i) => {
                  if (member) {
                    return (
                      <View
                        key={i}
                        className="flex flex-row items-center justify-between mb-2 border-b border-gray-300 pb-2"
                      >
                        <View className="flex flex-row items-center">
                          <Image
                            source={{ uri: member.user_photo }}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <Text className="text-heading">
                            {member.user_name}
                          </Text>
                        </View>
                        {member.user_id !== user.user_id &&
                          user.user_id === groupData.admin_id && (
                            <TouchableOpacity
                              onPress={() => {
                                showConfirmDialog(
                                  () => {
                                    handleKickUser(member.user_id);
                                  },
                                  "Remove User",
                                  "Are you sure you want to remove this user from the group? This action cannot be undone."
                                );
                              }}
                              className="bg-red-500 rounded-full w-10 h-10 items-center justify-center"
                            >
                              <Entypo
                                name="circle-with-cross"
                                size={24}
                                color="white"
                              />
                            </TouchableOpacity>
                          )}
                      </View>
                    );
                  }
                })}
            </View>
          </>
        )}

        {/* dismiss group btn */}
        {groupData.group_id && user.user_id === groupData.admin_id && (
          <View className="p-3">
            <TouchableOpacity
              onPress={() => {
                showConfirmDialog(
                  () => handleDismissGroup(),
                  "Dismiss Group",
                  "Are you sure you want to dismiss this group? This action cannot be undone."
                );
              }}
              className="bg-btnBg rounded-md p-3 flex items-center justify-center mb-4"
            >
              <Text className="text-white text-center font-semibold">
                Dismiss Group
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Leave Group Button */}
        {groupData.group_id && user.user_id != groupData.admin_id && (
          <View className="p-3">
            <TouchableOpacity
              onPress={() => {
                showConfirmDialog(
                  () => handleLeaveGroup(),
                  "Leave Group",
                  "Are you sure you want to leave this group? You will no longer be able to see the location of the members of this group."
                );
              }}
              className="bg-btnBg rounded-md p-3 flex items-center justify-center mb-4"
            >
              <Text className="text-white text-center font-semibold">
                Leave Group
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;

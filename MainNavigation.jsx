import { createDrawerNavigator } from "@react-navigation/drawer";
import Custom_Main_Drawer_Navigator from "./Custom_Main_Drawer_Navigator";
import Home from "../pages/Home";
import Map from "../pages/Map";

const Drawer = createDrawerNavigator();

function MainNavigation() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Custom_Main_Drawer_Navigator {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF4081",
        },
        headerTintColor: "#fff",
        drawerItemStyle: {
          backgroundColor: "#F9F9F9",
        },
        drawerActiveTintColor: "#FF4081",
      }}
    >
      <Drawer.Screen name="Lock Room" component={Home} />
      <Drawer.Screen
        name="Map"
        component={Map}
        options={{
          drawerItemStyle: {
            display: "none",
          },
        }}
      />
    </Drawer.Navigator>
  );
}

export default MainNavigation;

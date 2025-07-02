import "expo-dev-client";
import "react-native-gesture-handler";
import React from "react";
import AuthContextProvider from "./src/context/AuthContextProvider";
import RootNavigation from "./src/navigations/RootNavigation";

function App() {
  return (
    <AuthContextProvider>
      <RootNavigation />
    </AuthContextProvider>
  );
}

export default App;

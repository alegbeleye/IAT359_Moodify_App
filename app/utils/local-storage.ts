import AsyncStorage from "@react-native-async-storage/async-storage";

// marks whether onboarding is completed
export async function sethasOnboarded(){
    await AsyncStorage.setItem("hasOnboarded", "true");
}

// reads whether the user has completed onboards, which returns true or false and determines if the app should show the mood prompt screen
export async function getHasOnboarded() {
  const value = await AsyncStorage.getItem("hasOnboarded");
  return value === "true";
}
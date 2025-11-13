import { StyleSheet, View } from "react-native";

export const ThemedView = ({ children, style, ...props }: any) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 12,
    boxShadow: "2px 2px",
  },
});

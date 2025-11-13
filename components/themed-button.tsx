import { Button, StyleSheet, TouchableOpacity } from "react-native";

function ThemedButton({ style, title, children, ...props }: any) {
  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      {children}
    </TouchableOpacity>
  );
}

export default ThemedButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 6,
    paddingTop: 10,
    paddingRight: 16,
    paddingBottom: 10,
    paddingLeft: 16,
    backgroundColor: "#F9E8E9",
    marginVertical: 12,
    boxShadow: "2px 2px",
    minHeight: 46,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
});

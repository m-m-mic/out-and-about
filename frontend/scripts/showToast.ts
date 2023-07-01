import { ToastAndroid } from "react-native";

export const showToast = (text: string, duration = ToastAndroid.SHORT, position = ToastAndroid.TOP) => {
  ToastAndroid.showWithGravity(text, duration, position);
};

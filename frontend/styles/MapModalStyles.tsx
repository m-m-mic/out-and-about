import { StyleSheet } from "react-native";

export const MapModalStyles = StyleSheet.create({
  modal: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 100,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mapContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    height: "100%",
    elevation: 2,
  },
  closeButton: {
    zIndex: 5,
    position: "absolute",
    top: 15,
    right: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  map: { width: "100%", height: "100%" },
});

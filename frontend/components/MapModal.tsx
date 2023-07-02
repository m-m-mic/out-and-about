import { ActivityType } from "../scripts/types";
import { Modal, View } from "react-native";
import { Dispatch, SetStateAction } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { primary } from "../styles/StyleAttributes";
import * as React from "react";
import { MapModalStyles as styles } from "../styles/MapModalStyles";
import { OaaIconButton } from "./OaaIconButton";

interface MapModalProps {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  activities: ActivityType[];
}

export function MapModal({ visible, setVisible, activities }: MapModalProps) {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={() => setVisible(false)}>
      <View style={styles.modal}>
        <View style={styles.mapContainer}>
          <View style={styles.closeButton}>
            <OaaIconButton name="close" variant="transparent" onPress={() => setVisible(false)} />
          </View>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: activities.length > 0 ? activities[0].location.coordinates[1] : 1,
              longitude: activities.length > 0 ? activities[0].location.coordinates[0] : 1,
              latitudeDelta: 0.01,
              longitudeDelta: 0.00001,
            }}>
            {activities.length > 0 &&
              activities.map((activity: ActivityType) => (
                <Marker
                  key={activity._id}
                  pinColor={primary["400"]}
                  coordinate={{ longitude: activity.location.coordinates[0], latitude: activity.location.coordinates[1] }}
                />
              ))}
          </MapView>
        </View>
      </View>
    </Modal>
  );
}

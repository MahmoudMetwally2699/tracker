import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Button, TextInput, Modal } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { addPointToTrack, resetCurrentTrack, saveCurrentTrack } from '../../../redux/tracker';
import { Stack } from 'expo-router';

const Index = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackName, setTrackName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const locationSubscription = useRef(null);
  const dispatch = useDispatch();
  const routeCoordinates = useSelector((state) => state.tracks.currentTrack);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const startTracking = async () => {
    setIsTracking(true);
    locationSubscription.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
      (loc) => {
        dispatch(addPointToTrack({
          coords: {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          },
          timestamp: loc.timestamp,
        }));
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    );
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setModalVisible(true);
  };

  const saveTrack = () => {
    const trackData = {
      name: trackName || `Track on ${new Date().toLocaleString()}`,
      locations: routeCoordinates,
    };
    dispatch(saveCurrentTrack(trackData));
    dispatch(resetCurrentTrack());
    setTrackName('');
    setModalVisible(false);
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Tracker',
          headerStyle: { backgroundColor: '#82A0AA' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
      >
        <Marker coordinate={location} title="Your Location" />
        <Polyline coordinates={routeCoordinates.map((loc) => loc.coords)} strokeColor="#000" strokeWidth={6} />
      </MapView>
      <View style={styles.buttonContainer}>
        {isTracking ? (
          <Button title="Stop Tracking" onPress={stopTracking} />
        ) : (
          <Button title="Start Tracking" onPress={startTracking} />
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter Track Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTrackName}
            value={trackName}
            placeholder="Track Name"
          />
          <Button title="Save Track" onPress={saveTrack} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default Index;

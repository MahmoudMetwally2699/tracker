import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Text, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';

const TrackDetails = () => {
  const [track, setTrack] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const locationSubscription = useRef(null);
  const route = useRoute();
  const trackId = route.params?.trackId;
  const tracks = useSelector((state) => state.tracks.tracks);

  useEffect(() => {
    const selectedTrack = tracks.find((t) => t._id === trackId);
    setTrack(selectedTrack);
  }, [trackId, tracks]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
        (loc) => {
          setCurrentLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      );
    })();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  if (!track || !currentLocation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const navigateToStart = () => {
    Alert.alert('Navigate to Start', 'Follow the path to reach the starting point');
  };

  const routeCoordinates = [
    ...track.locations.map(loc => loc.coords),
    currentLocation
  ];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        followsUserLocation
      >
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF0000" // red for visibility
          strokeWidth={6}
        />
        <Marker coordinate={currentLocation} title="Your Location" pinColor="red" />
        <Marker
          coordinate={track.locations[0].coords}
          title="Start Location"
          pinColor="green"
        />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Navigate to Start" onPress={navigateToStart} />
      </View>
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
});

export default TrackDetails;

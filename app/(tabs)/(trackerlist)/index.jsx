import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracks } from '../../../redux/tracker'; // Ensure correct path
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native'; // Import useColorScheme
import Colors from '../../../constants/Colors'; // Make sure to define your color constants
import { Stack } from 'expo-router';
const TracksList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tracks = useSelector((state) => state.tracks.tracks);
  const isLoading = useSelector((state) => state.tracks.isLoading);
  const [refreshing, setRefreshing] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    dispatch(fetchTracks());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchTracks());
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
          <Stack.Screen
        options={{
          title: 'Tracker List',
          headerStyle: { backgroundColor: '#82A0AA' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
        <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text }}>Loading...</Text>
      </View>
    );
  }

  if (tracks.length === 0 && !isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}>
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
        <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text }}>No tracks available.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, { borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border }]}
      onPress={() => navigation.navigate('trackDetails', { trackId: item._id })}
    >
      <Text style={{ color: isDarkMode ? Colors.dark.text : Colors.light.text }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={tracks}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={[styles.list, { backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={isDarkMode ? Colors.dark.text : Colors.light.text} // Loader color
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
  },
});

export default TracksList;

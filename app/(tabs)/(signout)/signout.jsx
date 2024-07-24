// app/(tabs)/user.jsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/authSlice';
import { useRouter,Stack } from 'expo-router';

export default function UserScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await dispatch(logout());
    router.replace('/');
  };

  return (
    <View style={styles.container}>
        <Stack.Screen
        options={{
          title: 'Profile',
          headerStyle: { backgroundColor: '#82A0AA' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      />
      <Text style={styles.text}>User Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});

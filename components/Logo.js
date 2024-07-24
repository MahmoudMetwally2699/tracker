import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return <Image source={require('../assets/images/Tracker By Mahmoud (2).png')} style={styles.image} />
}

const styles = StyleSheet.create({
  image: {
    width: 220,
    height: 180,
    marginBottom: 8,
  },
})

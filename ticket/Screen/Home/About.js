import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const MapScreen = () => {
  const initialRegion = {
    latitude: -0.9981503862838385,
    longitude: 109.76655640880851,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const markerCoordinate = {
    latitude: -0.9981503862838385,
    longitude: 109.76655640880851,
  };

  const radiusAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(radiusAnimation, {
        toValue: 100,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Syarat dan Ketentuan:</Text>
        <Text style={styles.text}>
          - Pembelian tiket harus dilakukan secara online melalui aplikasi ini.
        </Text>
        <Text style={styles.text}>
          - Harga tiket yang tertera adalah harga per orang dan tidak termasuk biaya tambahan lainnya.
        </Text>
        <Text style={styles.text}>
          - Tiket yang sudah dibeli tidak dapat diubah atau dibatalkan kecuali ada ketentuan khusus.
        </Text>
        <Text style={styles.text}>
          - Tiket hanya dapat dipesan sehari sebelum keberangkatan.
        </Text>
        <Text style={styles.text}>
          - Pembayaran hanya dilakukan secara online.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Deskripsi Tiket Speedboat:</Text>
        <Text style={styles.text}>
          Tiket Speedboat memberikan akses transportasi cepat dan nyaman melalui perairan untuk mencapai tujuan Anda.
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          <Marker coordinate={markerCoordinate} />
          <AnimatedCircle
            center={markerCoordinate}
            radius={radiusAnimation}
            fillColor="rgba(62, 133, 240, 0.2)"
            strokeColor="rgba(62, 133, 240, 0.5)"
            strokeWidth={1}
          />
        </MapView>
      </View>
    </ScrollView>
  );
};

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  mapContainer: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});

export default MapScreen;

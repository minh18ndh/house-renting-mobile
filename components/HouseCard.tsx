import { Property, STATIC_URL } from '@/services/api';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface HouseCardProps {
  property: Property;
  onPress?: (property: Property) => void;
}

export const HouseCard: React.FC<HouseCardProps> = ({ property, onPress }) => {
  const {
    images,
    price,
    address,
    bedroom,
    area,
    isRented
  } = property;

  const handlePress = () => {
    router.push(`/property/${property.id}`);
  };

  const imageUrl = images?.[0]?.baseUrl
    ? `${STATIC_URL}/${images[0].baseUrl}`
    : 'https://via.placeholder.com/400x250?text=House+Image';

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            contentFit="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.locationPrice}>
            <View style={styles.location}>
              <Text style={styles.address} numberOfLines={1}>{address}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${price.toLocaleString()}</Text>
              <Text style={styles.priceUnit}>per month</Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🛏️</Text>
              <Text style={styles.detailText}>{bedroom} Beds</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📐</Text>
              <Text style={styles.detailText}>{area} m²</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>{isRented ? '🔴' : '🟢'}</Text>
              <Text style={styles.detailText}>{isRented ? 'Rented' : 'Available'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewButton} onPress={handlePress}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  typeTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#12A89E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  photoCount: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  photoCountText: {
    color: '#fff',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  locationPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  location: {
    flex: 1,
    marginRight: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cityState: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#12A89E',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#12A89E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

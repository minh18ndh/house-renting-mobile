import { HouseCard } from '@/components/HouseCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import type { Property } from '@/services/api';
import { getAllPosts } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyListingScreen() {
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const [myListings, setMyListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      loadMyListings();
    }
  }, [isLoggedIn]);

  const loadMyListings = async () => {
    try {
      setLoading(true);

      if (!user?.id) {
        console.warn('No user ID found, skipping fetch.');
        return;
      }

      const myProperties = await getAllPosts({ userId: user.id });
      setMyListings(myProperties);
    } catch (error) {
      console.error('Error loading my listings:', error);
      Alert.alert('Error', 'Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyListings();
    setRefreshing(false);
  };

  const handleAddProperty = () => {
    Alert.alert('Add Listing', `You can add a new listing on the web version.`);
  };

  const handleEditProperty = () => {
    Alert.alert('Edit/Delete Listing', `You can edit/delete your listing on the web version.`);
  };

  const handlePropertyPress = (property: Property) => {
    router.push(`/property/${property.id}`);
  };

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <View style={styles.propertyContainer}>
      <TouchableOpacity onPress={() => handlePropertyPress(item)}>
        <HouseCard property={item} />
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditProperty()}
        >
          <Ionicons name="create-outline" size={20} color="#12A89E" />
          <Text style={styles.editButtonText}>Edit/Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!isLoggedIn) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.centerContainer}>
          <Ionicons name="home-outline" size={64} color="#ccc" />
          <ThemedText type="title" style={styles.title}>
            My Listings
          </ThemedText>
          <Text style={styles.subtitle}>
            Please login to view and manage your property listings
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          My Listings
        </ThemedText>

        <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Manage your property listings
      </Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#12A89E" />
          <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
      ) : myListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="home-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No listings yet</Text>
          <Text style={styles.emptySubtext}>
            Start by adding your first property listing to attract potential tenants
          </Text>

          <TouchableOpacity style={styles.addPropertyButton} onPress={handleAddProperty}>
            <Ionicons name="add-circle-outline" size={24} color="#12A89E" />
            <Text style={styles.addPropertyButtonText}>Add Your First Property</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myListings}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#12A89E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  addPropertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#12A89E',
  },
  addPropertyButtonText: {
    color: '#12A89E',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loginButton: {
    backgroundColor: '#12A89E',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  propertyContainer: {
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  editButton: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#12A89E',
  },
  editButtonText: {
    color: '#12A89E',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});

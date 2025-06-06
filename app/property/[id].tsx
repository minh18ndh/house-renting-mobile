import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/contexts/AuthContext';
import type { Comment, Property } from '@/services/api';
import { createComment, getPostById, STATIC_URL } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const insets = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadProperty = useCallback(async () => {
    try {
      setLoading(true);
      const propertyData = await getPostById(id as string);
      setProperty(propertyData);
    } catch (error) {
      console.error('Error loading property:', error);
      Alert.alert('Error', 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleCall = () => {
    const phoneNumber = property?.user?.phone || 'unknown';
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSubmitComment = async () => {
    if (!isLoggedIn) return Alert.alert('Login Required', 'You must log in to leave a comment.');

    console.log('Submitting comment:', { comment, rating, postId: id });
    if (!comment.trim() || rating === 0) {
      return Alert.alert('Missing Fields', 'Please write a comment and select a rating.');
    }

    setSubmittingComment(true);
    try {
      await createComment({
        postId: id as string,
        content: comment.trim(),
        rating,
      });
      Alert.alert('Comment Submitted', 'Thanks for your review!');
      setComment('');
      setRating(0);
      loadProperty();
    } catch (err) {
      Alert.alert('Error', 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const goBack = () => router.back();

  if (loading) {
    return (
      <ThemedView style={[styles.flexCenter, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#12A89E" />
        <Text>Loading property details...</Text>
      </ThemedView>
    );
  }

  if (!property) {
    return (
      <ThemedView style={[styles.flexCenter, { paddingTop: insets.top }]}>
        <Text>Property not found</Text>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const images = property.images?.length
    ? property.images
    : [{ baseUrl: 'https://via.placeholder.com/400x300' }];

  return (
    <ThemedView style={{ flex: 1, paddingTop: insets.top }}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.carousel}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setCurrentImageIndex(index);
            }}
          >
            {images.map((img, index) => (
              <Image
                key={index}
                source={{
                  uri: img.baseUrl.startsWith('http')
                    ? img.baseUrl
                    : `${STATIC_URL}/${img.baseUrl}`,
                }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{property.address}</Text>
          <Text style={styles.category}>{property.category?.name || 'Uncategorized'}</Text>

          <Text style={styles.price}>
            ${property.price.toLocaleString()} / month
          </Text>

          <View style={styles.infoRow}>
            <Text>🛏 {property.bedroom} Beds</Text>
            <Text>📐 {property.area} m²</Text>
            <Text>{property.isRented ? '🔴 Rented' : '🟢 Available'}</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.content}</Text>

          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <Text style={styles.callText}>Call Owner</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Comments</Text>
          {property.comments.length === 0 && (
            <Text style={styles.noComments}>No comments yet.</Text>
          )}
          {property.comments.map((cmt: Comment, index: number) => (
            <View key={index} style={styles.commentBox}>
              <Text style={styles.commentName}>{cmt.user?.fullName || 'Anonymous'}</Text>
              <Text style={styles.commentStars}>{'★'.repeat(cmt.rating)}</Text>
              <Text>{cmt.content}</Text>
            </View>
          ))}

          {isLoggedIn && (
            <View style={styles.commentForm}>
              <Text style={styles.sectionTitle}>Add a Comment</Text>

              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons
                      name={i <= rating ? 'star' : 'star-outline'}
                      size={28}
                      color={i <= rating ? '#facc15' : '#ccc'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.input}
                placeholder="Write your comment..."
                multiline
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={[styles.submitButton, submittingComment && { opacity: 0.6 }]}
                disabled={submittingComment}
                onPress={handleSubmitComment}
              >
                {submittingComment ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#12A89E',
    marginTop: 16,
  },
  header: {
    position: 'absolute',
    top: 60,
    zIndex: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  backBtn: {
    backgroundColor: '#0007',
    padding: 8,
    borderRadius: 20,
  },
  carousel: {
    height: 300,
  },
  image: {
    width: screenWidth,
    height: 300,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  category: {
    color: '#888',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    color: '#28a745',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: '#555',
    marginBottom: 16,
  },
  callBtn: {
    backgroundColor: '#12A89E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
  },
  noComments: {
    color: '#999',
    marginBottom: 16,
  },
  commentBox: {
    backgroundColor: '#f1f3f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentName: {
    fontWeight: '600',
  },
  commentStars: {
    color: '#f59e0b',
  },
  commentForm: {
    marginTop: 24,
  },
  stars: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#20c997',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#20c997',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});

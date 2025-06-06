import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { createFeedback } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FeedbackScreen() {
  const insets = useSafeAreaInsets();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      Alert.alert('Empty Feedback', 'Please write your feedback before submitting.');
      return;
    }

    setLoading(true);

    try {
      await createFeedback(feedback);

      Alert.alert(
        'Feedback Submitted!',
        'Thank you for your feedback. We really appreciate your input!',
        [
          {
            text: 'OK',
            onPress: () => {
              setFeedback('');
              router.back();
            }
          }
        ]
      );
    } catch {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (feedback.trim()) {
      Alert.alert(
        'Discard Feedback?',
        'You have unsaved feedback. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color="#12A89E" />
            </TouchableOpacity>

            <ThemedText type="title" style={styles.title}>
              Feedback Form
            </ThemedText>
          </View>

          {/* Feedback Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Your Feedback</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#999"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={1000}
              editable={!loading}
            />

            <Text style={styles.charCount}>
              {feedback.length}/1000 characters
            </Text>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading || !feedback.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Feedback Guidelines */}
          <View style={styles.guidelinesContainer}>
            <Text style={styles.guidelinesTitle}>Feedback Guidelines</Text>

            <View style={styles.guideline}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.guidelineText}>Be specific about issues or suggestions</Text>
            </View>

            <View style={styles.guideline}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.guidelineText}>Include steps to reproduce bugs</Text>
            </View>

            <View style={styles.guideline}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.guidelineText}>Suggest improvements or new features</Text>
            </View>

            <View style={styles.guideline}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.guidelineText}>Be respectful and constructive</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Need immediate help?</Text>
            <Text style={styles.contactText}>
              For urgent issues, please contact our team directly through the About section.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 120,
    maxHeight: 200,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginBottom: 20,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  guidelinesContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  guideline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  guidelineText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  contactContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
});

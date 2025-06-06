import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TeamMember {
  name: string;
  studentId: string;
  email: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Nguyễn Quang Anh',
    studentId: '20213564',
    email: 'anh.nq213564@sis.hust.edu.vn'
  },
  {
    name: 'Nguyễn Danh Huy',
    studentId: '20213571',
    email: 'huy.nd213571@sis.hust.edu.vn'
  },
  {
    name: 'Nguyễn Đỗ Hoàng Minh',
    studentId: '20210591',
    email: 'minh.ndh210591@sis.hust.edu.vn'
  },
  {
    name: 'Nguyễn Hữu Phong',
    studentId: '20210668',
    email: 'phong.nh210668@sis.hust.edu.vn'
  }
];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const goBack = () => {
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="#12A89E" />
          </TouchableOpacity>

          <ThemedText type="title" style={styles.title}>
            About Us
          </ThemedText>
        </View>

        {/* About Content */}
        <View style={styles.contentContainer}>

          <View style={styles.descriptionCard}>
            <Text style={styles.description}>
              We are <Text style={styles.highlight}>Group 6</Text> from the Web and App Programming course at{' '}
              <Text style={styles.highlight}>HUST</Text>. Meet our team:
            </Text>
          </View>

          {/* Team Members */}
          <View style={styles.teamContainer}>
            <Text style={styles.sectionTitle}>Our Team</Text>

            {teamMembers.map((member, index) => (
              <View key={index} style={styles.memberCard}>
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.studentId}>{member.studentId}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.emailContainer}
                    onPress={() => handleEmailPress(member.email)}
                  >
                    <Ionicons name="mail" size={16} color="#12A89E" />
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
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
  contentContainer: {
    padding: 20,
  },
  descriptionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'center',
  },
  highlight: {
    color: '#12A89E',
    fontWeight: '600',
  },
  teamContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  studentId: {
    fontSize: 14,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberEmail: {
    fontSize: 14,
    color: '#12A89E',
    textDecorationLine: 'underline',
  },
  appInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 22,
  },
  techStack: {
    gap: 12,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  techText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  universityCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2196f3',
  },
  universityDescription: {
    fontSize: 16,
    color: '#1976d2',
    marginBottom: 8,
    fontWeight: '500',
  },
  courseInfo: {
    fontSize: 14,
    color: '#1976d2',
    fontStyle: 'italic',
  },
});

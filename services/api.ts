import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://172.20.10.3:3000/api';
export const STATIC_URL = 'http://172.20.10.3:3000';

// Types
export interface Comment {
  id: string;
  content: string;
  rating: number;
  user: {
    fullName: string;
  };
}

export interface Image {
  id: string;
  baseUrl: string;
}

export interface Property {
  id: number;
  address: string;
  price: number;
  bedroom: number;
  area: number;
  content: string;
  images: Image[];
  category: { id: string; name: string };
  comments: Comment[];
  user: User;
  isRented: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

interface CommentPayload {
  postId: string;
  content: string;
  rating: number;
}

// Auth helpers
const TOKEN_KEY = 'rentahouse_token';

const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Generic API fetch function
const apiFetch = async (endpoint: string, options: {
  method?: string;
  body?: any;
  token?: string | null;
} = {}) => {
  const { method = 'GET', body } = options;
  let { token } = options;

  // If no token provided, try to get it from storage
  if (token === undefined) {
    token = await getToken();
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'API Error');
  }

  return response.json();
};

// Auth API
export const loginApi = async (email: string, password: string) => {
  const result = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (result.token) {
    await setToken(result.token);
  }

  return result;
};

export const signupApi = async (fullName: string, email: string, password: string, phone?: string) => {
  const result = await apiFetch('/auth/register', {
    method: 'POST',
    body: { fullName, email, password, phone },
  });

  if (result.token) {
    await setToken(result.token);
  }

  return result;
};

export const getMeApi = async (): Promise<User> => {
  return apiFetch('/auth/me');
};

export const logout = async () => {
  await removeToken();
};

// Posts API
export const getAllPosts = async (filters: Record<string, string> = {}): Promise<Property[]> => {
  const query = new URLSearchParams(filters).toString();
  const endpoint = query ? `/posts?${query}` : '/posts';
  return apiFetch(endpoint);
};

export const getPostById = async (id: number | string): Promise<Property> => {
  return apiFetch(`/posts/${id}`);
};

// Comments API
export const createComment = async ({ postId, content, rating }: CommentPayload) => {
  return apiFetch('/commentforms', {
    method: 'POST',
    body: { postId, content, rating }
  });
};

// Feedbacks API
export const createFeedback = async (content: string) => {
  return apiFetch('/feedbackforms', {
    method: 'POST',
    body: { content },
  });
};

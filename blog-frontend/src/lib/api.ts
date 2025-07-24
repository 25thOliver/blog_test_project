import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Comment {
  id: number;
  body: string;
  user: User;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  user: User;
  comments: Comment[];
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  body: string;
  user_id: number;
}

export interface UpdatePostData {
  title?: string;
  body?: string;
  user_id?: number;
}

export interface CreateCommentData {
  body: string;
  user_id: number;
  post_id: number;
}

export interface PaginatedResponse<T> {
  posts?: T[];
  comments?: T[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
  };
}

// Posts API
export const postsApi = {
  getAll: async (page = 1): Promise<PaginatedResponse<Post>> => {
    const response = await api.get(`/posts?page=${page}`);
    return response.data;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  create: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post('/posts', { post: data });
    return response.data;
  },

  update: async (id: number, data: UpdatePostData): Promise<Post> => {
    const response = await api.put(`/posts/${id}`, { post: data });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Comments API
export const commentsApi = {
  getAll: async (postId: number, page = 1): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}`);
    return response.data;
  },

  create: async (postId: number, data: CreateCommentData): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { comment: data });
    return response.data;
  },

  delete: async (postId: number, commentId: number): Promise<void> => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },
};

// Users API
export const usersApi = {
  getAll: async (forceRefresh = false): Promise<User[]> => {
    const url = forceRefresh ? `/users?ts=${Date.now()}` : '/users';
    const response = await api.get(url);
    return response.data;
  },
  create: async (data: { name: string; email: string }): Promise<User> => {
    const response = await api.post('/users', { user: data });
    return response.data;
  },
};

export default api;
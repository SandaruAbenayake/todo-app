import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL
});

export const fetchTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (title) => {
  const response = await api.post('/todos', { title });
  return response.data;
};

export const updateTodo = async (id, payload) => {
  const response = await api.put(`/todos/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export const toggleTodo = async (id) => {
  const response = await api.post(`/todos/${id}/toggle`);
  return response.data;
};

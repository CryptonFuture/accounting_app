import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Accounts
export const getAccounts = () => api.get('/accounts');
export const createAccount = (data) => api.post('/accounts', data);
export const updateAccount = (id, data) => api.put(`/accounts/${id}`, data);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);

// Journal
export const getJournalEntries = () => api.get('/journal');
export const getJournalEntry = (id) => api.get(`/journal/${id}`);
export const createJournalEntry = (data) => api.post('/journal', data);
export const deleteJournalEntry = (id) => api.delete(`/journal/${id}`);

// T-Account
export const getTAccount = (accountId) => api.get(`/taccount/${accountId}`);

// Trial Balance
export const getTrialBalance = (showZero = false) =>
  api.get(`/trial-balance${showZero ? '?showZero=true' : ''}`);

export default api;

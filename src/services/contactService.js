import api from './api.js';

export const contactService = {
  submitInquiry: async (data) => {
    return await api.post('/contact', data);
  },
};

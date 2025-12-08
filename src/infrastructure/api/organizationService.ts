import axios from 'axios';
import { Organization } from '@/domain/types';

export const organizationService = {
  getAll: async (): Promise<Organization[]> => {
    const { data } = await axios.get('/api/organizations');
    return data;
  },

  create: async (organization: Partial<Organization>): Promise<Organization> => {
    const { data } = await axios.post('/api/organizations', organization);
    return data;
  }
};

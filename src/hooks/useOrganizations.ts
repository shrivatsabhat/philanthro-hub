import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationService } from '@/infrastructure/api/organizationService';
import { Organization } from '@/domain/types';

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 1000 * 30, // Poll every 30 seconds
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: organizationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

import { useAuth } from '@/contexts/AuthContext';
// @ts-ignore
import { useQuery, useMutation } from 'convex/react';
// @ts-ignore
import { api } from '../../convex/_generated/api';

export const useJobs = (measurementId?: string) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const enabled = Boolean(measurementId && userId);
  const jobs = useQuery(
    api.jobs.listByMeasurement,
    enabled ? { measurementId: measurementId as string, userId } : 'skip'
  );

  const upsertJob = useMutation(api.jobs.upsert);
  const deleteJob = useMutation(api.jobs.remove);

  return { jobs, upsertJob, deleteJob };
};

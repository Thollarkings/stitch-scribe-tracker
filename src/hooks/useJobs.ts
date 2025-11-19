import { useAuth } from '@/contexts/AuthContext';
// @ts-ignore
import { useQuery, useMutation } from 'convex/react';
// @ts-ignore
import { api } from '../../convex/_generated/api';

export const useJobs = (measurementId?: string) => {
  const { user } = useAuth();
  const userId = user?.id ?? '';

  const jobs = measurementId && userId
    ? useQuery(api.jobs.listByMeasurement, { measurementId, userId })
    : undefined;

  const upsertJob = useMutation(api.jobs.upsert);
  const deleteJob = useMutation(api.jobs.remove);

  return { jobs, upsertJob, deleteJob };
};

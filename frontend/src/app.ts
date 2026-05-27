import { getUser } from '@/services/api';

export async function getInitialState(): Promise<{ currentUser: any }> {
  return {
    currentUser: getUser(),
  };
}

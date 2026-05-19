export async function getInitialState(): Promise<{ currentUser: any }> {
  const userStr = localStorage.getItem('currentUser');
  return {
    currentUser: userStr ? JSON.parse(userStr) : null,
  };
}

/**
 * Auth scaffolding for later Clerk integration
 *
 * Currently returns defaults. When Clerk is integrated:
 * 1. Install @clerk/nextjs
 * 2. Set up Clerk keys in env
 * 3. Replace these functions with actual Clerk auth
 */

export async function getCurrentUserId(): Promise<string> {
  // TODO: With Clerk integration:
  // const { userId } = auth();
  // if (!userId) throw new Error('Not authenticated');
  // return userId;

  return 'default-user';
}

export function requireAuth(): boolean {
  // TODO: With Clerk integration:
  // const { userId } = auth();
  // if (!userId) {
  //   redirect('/sign-in');
  // }
  // return true;

  return true;
}

export async function getUser() {
  // TODO: With Clerk integration:
  // return currentUser();

  return {
    id: 'default-user',
    firstName: 'User',
    lastName: '',
    emailAddresses: [],
  };
}

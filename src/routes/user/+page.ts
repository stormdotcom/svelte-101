// +page.ts
import type { PageLoad } from './$types.js';
import type { User } from '$lib/common/interfaces/User.js';

export const load: PageLoad = async ({ fetch}) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users/7");
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const user: User = await response.json();
    return user
  } catch (error: any) {
    return {
      error: error.message
    };
  }
};

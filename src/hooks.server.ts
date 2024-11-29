import type { HandleServerError } from '@sveltejs/kit';


export const handleError: HandleServerError = ({ error, event }) => {
  console.error(`Error occurred during request to ${event.url.pathname}:`, error);

  
  let message = 'An unexpected error occurred on the server.';
  let code = 'UNKNOWN';

  if (error instanceof Error) {
    message = error.message;
    code = error.name;
  }

//TODO : send to monitoring service

  return {
    message,
    code
  };
};

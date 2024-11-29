interface ErrorDetails {
    title: string;
    message: string;
  }
  
  export function handleAxiosError(error: any): ErrorDetails {
    const { message, code, status } = error;
  

    let errorTitle = 'Unexpected Error';
    let errorMessage = message || 'Something went wrong. Please try again later.';
  
    switch (status) {
      case 400:
        errorTitle = 'Bad Request';
        errorMessage = 'The request could not be understood or was missing required parameters.';
        break;
      case 401:
        errorTitle = 'Unauthorized';
        errorMessage = 'You are not authorized to access this resource. Please login and try again.';
        break;
      case 403:
        errorTitle = 'Forbidden';
        errorMessage = 'You do not have the necessary permissions to access this resource.';
        break;
      case 404:
        errorTitle = 'Not Found';
        errorMessage = 'The requested resource could not be found. Please check the URL or try again later.';
        break;
      case 500:
        errorTitle = 'Internal Server Error';
        errorMessage = 'There was an error on the server. Please try again later.';
        break;
      default:
        // Handle additional specific error codes from `code` property if needed
        switch (code) {
          case 'ECONNABORTED':
            errorTitle = 'Connection Timeout';
            errorMessage = 'The request took too long to complete. Please check your connection and try again.';
            break;
          case 'ERR_NETWORK':
            errorTitle = 'Network Error';
            errorMessage = 'There was a network error. Please check your connection and try again.';
            break;
          case 'ERR_BAD_REQUEST':
            errorTitle = 'Bad Request';
            errorMessage = 'The request was not properly formatted. Please check the data you are sending.';
            break;
          // Add more `code` handling if required
          default:
            errorTitle = 'Unexpected Error';
            errorMessage = message || 'An unknown error occurred. Please try again later.';
            break;
        }
        break;
    }
  
    return {
      title: errorTitle,
      message: errorMessage,
    };
  }
  
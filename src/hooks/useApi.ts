
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options?: {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  }
): UseApiReturn<T> => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    console.log('useApi execute called with args:', args);
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      
      if (options?.showSuccessToast) {
        toast.success(options.successMessage || 'Operation completed successfully');
      }
      
      console.log('useApi execute successful:', result);
      return result;
    } catch (error) {
      console.error('useApi execute error:', error);
      
      let errorMessage = 'An error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('Cannot connect to server') || 
            error.message.includes('NetworkError') || 
            error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to Django backend server. Please check:\n• Django server is running\n• CORS is properly configured in Django settings\n• No firewall blocking the connection\n• Django URLs are properly configured';
        } else if (error.message.includes('CORS')) {
          errorMessage = 'CORS error: Please configure your Django backend CORS settings to allow requests from this domain.';
        } else if (error.message.includes('This field is required') || 
                   error.message.includes('non_field_errors')) {
          errorMessage = 'Validation failed. Please check the Django logs for specific field errors. Common issues:\n• Username may need to be unique\n• Email format validation\n• Password confirmation mismatch\n• Missing required fields';
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          errorMessage = 'Permission denied. Please check:\n• User authentication status\n• Django permissions configuration\n• Admin privileges if required';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      
      if (options?.showErrorToast !== false) {
        toast.error(errorMessage);
      }
      
      return null;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};

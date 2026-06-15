import { ZodError } from 'zod';

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export class ApiErrorHandler {
  static badRequest(message: string, details?: Record<string, any>): ApiError {
    return {
      code: 'BAD_REQUEST',
      message,
      details,
    };
  }

  static notFound(message: string = 'Resource not found'): ApiError {
    return {
      code: 'NOT_FOUND',
      message,
    };
  }

  static unauthorized(message: string = 'Unauthorized'): ApiError {
    return {
      code: 'UNAUTHORIZED',
      message,
    };
  }

  static forbidden(message: string = 'Forbidden'): ApiError {
    return {
      code: 'FORBIDDEN',
      message,
    };
  }

  static conflict(message: string): ApiError {
    return {
      code: 'CONFLICT',
      message,
    };
  }

  static internalServerError(message: string = 'Internal server error'): ApiError {
    return {
      code: 'INTERNAL_SERVER_ERROR',
      message,
    };
  }

  static fromZodError(error: ZodError<unknown>): ApiError {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.issues.reduce((acc: Record<string, string>, err: any) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {} as Record<string, string>),
    };
  }
}

export const formatApiResponse = <T>(
  success: boolean,
  data?: T,
  error?: ApiError
): ApiResponse<T> => ({
  success,
  ...(data && { data }),
  ...(error && { error }),
});

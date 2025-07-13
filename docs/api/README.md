# API Documentation

## Overview
This document provides comprehensive documentation for the API endpoints and services used in the childcare frontend application.

## Base Configuration

### Environment Variables
```typescript
interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}
```

### Default Configuration
```typescript
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};
```

## Authentication API

### Login
**Endpoint**: `POST /api/auth/login`

**Request**:
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response**:
```typescript
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
  expiresAt: string;
}
```

**Usage**:
```typescript
import { authAPI } from '../api/auth';

const response = await authAPI.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### Logout
**Endpoint**: `POST /api/auth/logout`

**Request**: No body required (uses token from headers)

**Response**:
```typescript
interface LogoutResponse {
  message: string;
  success: boolean;
}
```

### Refresh Token
**Endpoint**: `POST /api/auth/refresh`

**Request**: No body required (uses refresh token from headers)

**Response**:
```typescript
interface RefreshResponse {
  token: string;
  expiresAt: string;
}
```

## Billing API

### Get Bills
**Endpoint**: `GET /api/bills`

**Query Parameters**:
```typescript
interface GetBillsParams {
  page?: number;
  limit?: number;
  status?: 'paid' | 'pending' | 'overdue';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
```

**Response**:
```typescript
interface GetBillsResponse {
  bills: Bill[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

**Usage**:
```typescript
import { billsAPI } from '../api/bills';

const response = await billsAPI.getBills({
  page: 1,
  limit: 10,
  status: 'pending'
});
```

### Create Bill
**Endpoint**: `POST /api/bills`

**Request**:
```typescript
interface CreateBillRequest {
  childId: string;
  amount: number;
  description: string;
  dueDate: string;
  items: BillItem[];
}
```

**Response**:
```typescript
interface CreateBillResponse {
  bill: Bill;
  message: string;
}
```

### Update Bill
**Endpoint**: `PUT /api/bills/:id`

**Request**:
```typescript
interface UpdateBillRequest {
  amount?: number;
  description?: string;
  dueDate?: string;
  status?: 'paid' | 'pending' | 'overdue';
}
```

### Delete Bill
**Endpoint**: `DELETE /api/bills/:id`

**Response**:
```typescript
interface DeleteBillResponse {
  message: string;
  success: boolean;
}
```

### Upload Bill Document
**Endpoint**: `POST /api/bills/:id/documents`

**Request**: FormData with file

**Response**:
```typescript
interface UploadDocumentResponse {
  document: {
    id: string;
    filename: string;
    url: string;
    uploadedAt: string;
  };
}
```

## Contract API

### Get Contracts
**Endpoint**: `GET /api/contracts`

**Query Parameters**:
```typescript
interface GetContractsParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'active' | 'expired' | 'terminated';
  search?: string;
}
```

**Response**:
```typescript
interface GetContractsResponse {
  contracts: Contract[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Create Contract
**Endpoint**: `POST /api/contracts`

**Request**:
```typescript
interface CreateContractRequest {
  childId: string;
  guardianId: string;
  startDate: string;
  endDate: string;
  terms: ContractTerms;
  pricing: ContractPricing;
}
```

### Update Contract
**Endpoint**: `PUT /api/contracts/:id`

**Request**:
```typescript
interface UpdateContractRequest {
  status?: 'draft' | 'active' | 'expired' | 'terminated';
  terms?: Partial<ContractTerms>;
  pricing?: Partial<ContractPricing>;
}
```

### Get Contract Steps
**Endpoint**: `GET /api/contracts/:id/steps`

**Response**:
```typescript
interface GetContractStepsResponse {
  steps: ContractStep[];
  currentStep: number;
  isComplete: boolean;
}
```

## Deposit API

### Get Deposits
**Endpoint**: `GET /api/deposits`

**Query Parameters**:
```typescript
interface GetDepositsParams {
  page?: number;
  limit?: number;
  type?: 'payment' | 'refund' | 'adjustment';
  dateFrom?: string;
  dateTo?: string;
}
```

### Create Deposit
**Endpoint**: `POST /api/deposits`

**Request**:
```typescript
interface CreateDepositRequest {
  amount: number;
  type: 'payment' | 'refund' | 'adjustment';
  description: string;
  childId?: string;
  contractId?: string;
}
```

### Get Cash Register Balance
**Endpoint**: `GET /api/deposits/balance`

**Response**:
```typescript
interface BalanceResponse {
  currentBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  lastUpdated: string;
}
```

## User Management API

### Get Users
**Endpoint**: `GET /api/users`

**Query Parameters**:
```typescript
interface GetUsersParams {
  page?: number;
  limit?: number;
  role?: 'admin' | 'user';
  search?: string;
}
```

### Create User
**Endpoint**: `POST /api/users`

**Request**:
```typescript
interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}
```

### Update User
**Endpoint**: `PUT /api/users/:id`

**Request**:
```typescript
interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
  isActive?: boolean;
}
```

## Error Handling

### Error Response Format
```typescript
interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}
```

### Common Error Codes
- `AUTHENTICATION_FAILED` - Invalid credentials
- `TOKEN_EXPIRED` - Authentication token expired
- `PERMISSION_DENIED` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `INTERNAL_SERVER_ERROR` - Server error

### Error Handling Example
```typescript
try {
  const response = await api.get('/bills');
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    auth.logout();
  } else if (error.response?.status === 422) {
    // Handle validation error
    setErrors(error.response.data.details);
  } else {
    // Handle other errors
    ErrorHandler.handleError(error);
  }
}
```

## Request/Response Interceptors

### Request Interceptor
```typescript
api.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp
    config.headers['X-Request-Timestamp'] = Date.now().toString();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Response Interceptor
```typescript
api.interceptors.response.use(
  (response) => {
    // Log successful requests
    customLogger.info('API Request Success', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
    });
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      auth.logout();
    }
    
    // Log errors
    customLogger.error('API Request Failed', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    
    return Promise.reject(error);
  }
);
```

## Rate Limiting

### Rate Limit Headers
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
}
```

### Rate Limit Handling
```typescript
const handleRateLimit = (headers: RateLimitHeaders) => {
  const remaining = parseInt(headers['X-RateLimit-Remaining']);
  const reset = parseInt(headers['X-RateLimit-Reset']);
  
  if (remaining === 0) {
    const resetTime = new Date(reset * 1000);
    customLogger.warn(`Rate limit exceeded. Reset at ${resetTime}`);
  }
};
```

## Caching

### Cache Configuration
```typescript
interface CacheConfig {
  maxAge: number;
  maxSize: number;
  strategy: 'memory' | 'localStorage' | 'sessionStorage';
}
```

### Cache Implementation
```typescript
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  
  set(key: string, data: any, maxAge: number = 300000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + maxAge,
    });
  }
  
  get(key: string) {
    const item = this.cache.get(key);
    if (item && Date.now() < item.timestamp) {
      return item.data;
    }
    this.cache.delete(key);
    return null;
  }
}
```

## Testing

### Mock API Responses
```typescript
// test/mocks/api.ts
export const mockBillsResponse = {
  bills: [
    {
      id: '1',
      amount: 100,
      description: 'Test bill',
      status: 'pending',
      dueDate: '2024-01-01',
    },
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
};
```

### API Testing Example
```typescript
describe('Bills API', () => {
  it('should fetch bills successfully', async () => {
    const response = await billsAPI.getBills();
    expect(response.bills).toBeDefined();
    expect(response.pagination).toBeDefined();
  });
  
  it('should handle API errors', async () => {
    // Mock error response
    api.get.mockRejectedValue({
      response: {
        status: 500,
        data: { message: 'Internal server error' },
      },
    });
    
    await expect(billsAPI.getBills()).rejects.toThrow();
  });
});
```

## Security

### Authentication
- JWT token-based authentication
- Token refresh mechanism
- Secure token storage
- Automatic logout on token expiration

### Data Protection
- HTTPS enforcement
- Input validation and sanitization
- XSS prevention
- CSRF protection

### Error Security
- No sensitive data in error messages
- Secure error logging
- Rate limiting protection
- Request validation

## Performance

### Request Optimization
- Request debouncing
- Response caching
- Connection pooling
- Compression support

### Monitoring
- Request/response logging
- Performance metrics
- Error tracking
- Usage analytics
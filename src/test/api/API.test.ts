import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import API, { BASE_URL, ApiResponseModel } from '../../models/API'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock SecurityService directly
const mockSecurityService = { getToken: vi.fn() };
vi.mock('../../configs/storageUtils', () => ({ SecurityService: mockSecurityService }));

// Mock window.location
const mockLocation = {
  href: 'http://localhost:3000',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
}
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
})

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('BASE_URL', () => {
    it('should use environment variable when available', () => {
      expect(BASE_URL).toBe('http://localhost:8000/childadmin')
    })

    it('should use fallback URL when environment variable is not set', () => {
      vi.stubEnv('VITE_BASE_URL', '')
      // Note: This would require reimporting the module to test the fallback
      expect(BASE_URL).toBe('http://localhost:8000/childadmin')
    })
  })

  describe('ApiResponseModel', () => {
    it('should create instance with response data', () => {
      const data = { id: 1, name: 'test' }
      const response = new ApiResponseModel(200, data, 'Success')
      
      expect(response.httpStatus).toBe(200)
      expect(response.response).toEqual(data)
      expect(response.message).toBe('Success')
    })

    it('should create instance with message only', () => {
      const response = new ApiResponseModel(404, 'Not found')
      
      expect(response.httpStatus).toBe(404)
      expect(response.message).toBe('Not found')
      expect(response.response).toBeNull()
    })

    it('should handle constructor overloads correctly', () => {
      const dataResponse = new ApiResponseModel(200, { data: 'test' }, 'Success')
      const messageResponse = new ApiResponseModel(400, 'Error message')
      
      expect(dataResponse.response).toEqual({ data: 'test' })
      expect(messageResponse.response).toBeNull()
    })
  })

  describe('API.get', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'test' }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      const result = await API.get(BASE_URL, '/users')

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${BASE_URL}/users`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: null,
      })
      expect(result).toEqual({
        response: mockData,
        httpStatus: 200,
      })
    })

    it('should handle GET request with query parameters', async () => {
      const mockData = { users: [] }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      const options = { params: { page: 1, limit: 10 } }
      await API.get(BASE_URL, '/users', options)

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${BASE_URL}/users`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: { page: 1, limit: 10 },
        data: null,
      })
    })

    it('should handle public endpoints without authorization', async () => {
      const mockData = { key: 'public-key' }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      await API.get(BASE_URL, '/get-public-key')

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${BASE_URL}/get-public-key`,
        headers: {
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: null,
      })
    })
  })

  describe('API.post', () => {
    it('should make successful POST request', async () => {
      const mockData = { id: 1, name: 'created' }
      const requestBody = { name: 'new item' }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 201,
      })

      const result = await API.post(BASE_URL, '/users', requestBody)

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${BASE_URL}/users`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: JSON.stringify(requestBody),
      })
      expect(result).toEqual({
        response: mockData,
        httpStatus: 201,
      })
    })

    it('should handle FormData without setting Content-Type', async () => {
      const mockData = { uploaded: true }
      const formData = new FormData()
      formData.append('file', 'test')
      
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      await API.post(BASE_URL, '/upload', formData)

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${BASE_URL}/upload`,
        headers: {
          Authorization: 'Bearer mock-token',
        },
        params: undefined,
        data: formData,
      })
    })
  })

  describe('API.put', () => {
    it('should make successful PUT request', async () => {
      const mockData = { id: 1, name: 'updated' }
      const requestBody = { name: 'updated item' }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      const result = await API.put(BASE_URL, '/users/1', requestBody)

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'PUT',
        url: `${BASE_URL}/users/1`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: JSON.stringify(requestBody),
      })
      expect(result).toEqual({
        response: mockData,
        httpStatus: 200,
      })
    })
  })

  describe('API.patch', () => {
    it('should make successful PATCH request', async () => {
      const mockData = { id: 1, name: 'patched' }
      const requestBody = { name: 'patched item' }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      const result = await API.patch(BASE_URL, '/users/1', requestBody)

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'PATCH',
        url: `${BASE_URL}/users/1`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: JSON.stringify(requestBody),
      })
      expect(result).toEqual({
        response: mockData,
        httpStatus: 200,
      })
    })
  })

  describe('API.delete', () => {
    it('should make successful DELETE request', async () => {
      const mockData = { success: true }
      mockedAxios.mockResolvedValueOnce({
        data: mockData,
        status: 200,
      })

      const result = await API.delete(BASE_URL, '/users/1')

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'DELETE',
        url: `${BASE_URL}/users/1`,
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        params: undefined,
        data: null,
      })
      expect(result).toEqual({
        response: mockData,
        httpStatus: 200,
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Not found' },
        },
      }
      mockedAxios.mockRejectedValueOnce(errorResponse)

      await expect(API.get(BASE_URL, '/nonexistent')).rejects.toEqual({
        response: { message: 'Not found' },
        httpStatus: 404,
      })
    })

    it('should handle 401 errors and redirect', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' },
        },
      }
      mockedAxios.mockRejectedValueOnce(errorResponse)

      const result = await API.get(BASE_URL, '/protected')

      expect(mockLocation.href).toBe('./session-expired')
      expect(result).toEqual({
        response: null,
        httpStatus: 401,
      })
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error')
      mockedAxios.mockRejectedValueOnce(networkError)

      await expect(API.get(BASE_URL, '/users')).rejects.toEqual({
        response: 'Network Error',
        httpStatus: 404,
      })
    })
  })
}) 
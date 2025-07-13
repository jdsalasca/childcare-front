import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-i18next
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        changeLanguage: vi.fn(),
        language: 'en',
      },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  }
})

// Mock react-hook-form
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {
      register: vi.fn(),
      unregister: vi.fn(),
      getFieldState: vi.fn(),
      handleSubmit: vi.fn(),
      reset: vi.fn(),
      resetField: vi.fn(),
      setError: vi.fn(),
      clearErrors: vi.fn(),
      setValue: vi.fn(),
      setFocus: vi.fn(),
      getValues: vi.fn(),
      getFieldValue: vi.fn(),
      trigger: vi.fn(),
      formState: {
        errors: {},
        isSubmitting: false,
        isValid: true,
      },
      watch: vi.fn(),
    },
    handleSubmit: vi.fn((fn: any) => (e: any) => {
      e?.preventDefault?.();
      fn({});
    }),
    formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
    },
    watch: vi.fn(),
    setValue: vi.fn(),
    getValues: vi.fn(),
    reset: vi.fn(),
    setError: vi.fn(),
    clearErrors: vi.fn(),
  }),
  Controller: ({ render, name, control: _control, ...props }: any) => {
    const field = {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      value: props.defaultValue || '',
      name,
      ref: vi.fn(),
    };
    const fieldState = {
      invalid: false,
      isTouched: false,
      isDirty: false,
      error: undefined,
    };
    const formState = {
      errors: {},
      isSubmitting: false,
      isValid: true,
    };
    return render({ field, fieldState, formState });
  },
  useController: () => ({
    field: {
      onChange: vi.fn(),
      onBlur: vi.fn(),
      value: '',
      name: 'test',
      ref: vi.fn(),
    },
    fieldState: {
      invalid: false,
      isTouched: false,
      isDirty: false,
      error: undefined,
    },
    formState: {
      errors: {},
      isSubmitting: false,
      isValid: true,
    },
  }),
}))

// Mock environment variables
vi.stubEnv('VITE_BASE_URL', 'http://localhost:8000/childadmin')
vi.stubEnv('VITE_ENV', 'test')

// Mock HTMLFormElement.prototype.requestSubmit
HTMLFormElement.prototype.requestSubmit = vi.fn()

// Mock HTMLFormElement.prototype.reportValidity
HTMLFormElement.prototype.reportValidity = vi.fn().mockReturnValue(true)

// Mock HTMLInputElement.prototype.reportValidity
HTMLInputElement.prototype.reportValidity = vi.fn().mockReturnValue(true)

// Mock HTMLSelectElement.prototype.reportValidity
HTMLSelectElement.prototype.reportValidity = vi.fn().mockReturnValue(true)

// Mock HTMLTextAreaElement.prototype.reportValidity
HTMLTextAreaElement.prototype.reportValidity = vi.fn().mockReturnValue(true)

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/childadmin/admin',
    pathname: '/childadmin/admin',
    search: '',
    hash: '',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    hostname: 'localhost',
    port: '3000',
    assign: vi.fn(),
    reload: vi.fn(),
    replace: vi.fn(),
  },
  writable: true,
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
  })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => ({
    data: new Uint8ClampedArray(4),
  })),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url')
global.URL.revokeObjectURL = vi.fn()

// Mock File and FileReader
global.File = vi.fn().mockImplementation(() => ({
  name: 'test.pdf',
  size: 1024,
  type: 'application/pdf',
}))

global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  readAsText: vi.fn(),
  result: 'mocked-result',
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  EMPTY: 0,
  LOADING: 1,
  DONE: 2,
  readyState: 0,
  error: null,
  onload: null,
  onerror: null,
  onabort: null,
  onloadstart: null,
  onloadend: null,
  onprogress: null,
})) as any

// Mock crypto for testing
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: vi.fn().mockReturnValue(new Uint32Array(1)),
    subtle: {
      digest: vi.fn().mockResolvedValue(new ArrayBuffer(32)),
    },
  },
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
})

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

// Mock process.env for Node.js compatibility
if (typeof process === 'undefined') {
  global.process = {
    env: {
      NODE_ENV: 'test',
      VITE_BASE_URL: 'http://localhost:8000/childadmin',
      VITE_ENV: 'test',
    },
  } as any
}

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = vi.fn().mockImplementation((cb) => {
  setTimeout(cb, 0)
  return 1
})
global.cancelAnimationFrame = vi.fn()

// Mock setTimeout and clearTimeout for better control in tests
// Note: Using vi.useFakeTimers() in individual tests for better control

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
  vi.clearAllTimers()
  vi.unstubAllEnvs()
}) 
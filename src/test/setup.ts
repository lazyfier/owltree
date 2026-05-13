import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'

class MemoryStorage implements Storage {
  private readonly entries = new Map<string, string>()

  get length(): number {
    return this.entries.size
  }

  clear(): void {
    this.entries.clear()
  }

  getItem(key: string): string | null {
    return this.entries.get(String(key)) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.entries.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.entries.delete(String(key))
  }

  setItem(key: string, value: string): void {
    this.entries.set(String(key), String(value))
  }
}

function installStorage(name: 'localStorage' | 'sessionStorage'): Storage {
  const storage = new MemoryStorage()

  Object.defineProperty(globalThis, name, {
    configurable: true,
    value: storage,
  })

  return storage
}

const testLocalStorage = installStorage('localStorage')
const testSessionStorage = installStorage('sessionStorage')

beforeEach(() => {
  testLocalStorage.clear()
  testSessionStorage.clear()
})

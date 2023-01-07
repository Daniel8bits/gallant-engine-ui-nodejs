
export type StateSetter<T> = (value: T | ((oldValue: T) => T)) => void
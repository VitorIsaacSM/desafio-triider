export type PartialBy<T, K extends string | number> = Omit<T, K> & Partial<T>

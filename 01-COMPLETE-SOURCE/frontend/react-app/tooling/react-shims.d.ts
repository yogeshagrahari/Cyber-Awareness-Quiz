declare module 'react' {
  export type SetStateAction<T> = T | ((previous: T) => T);
  export type Dispatch<T> = (value: T) => void;
  export interface FormEvent<T = Element> { preventDefault(): void; currentTarget: T }
  export interface ChangeEvent<T = Element> { currentTarget: T }
  export function useState<T>(initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>];
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  export const StrictMode: (props: {children?: unknown}) => unknown;
}
declare module 'react/jsx-runtime' { export const jsx: any; export const jsxs: any; export const Fragment: any; }
declare module 'react-dom/client' { export function createRoot(container: Element): {render(children: unknown): void}; }
declare module '*.css' { const value: string; export default value; }
declare namespace JSX {
  type Element = any;
  interface IntrinsicAttributes { key?: string | number }
  interface IntrinsicElements { [elementName: string]: any }
}

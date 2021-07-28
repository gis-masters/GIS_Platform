// some utility types for working with tuples
type Cons<H, T extends readonly unknown[]> = ((head: H, ...tail: T) => void) extends (...cons: infer R) => void
  ? R
  : never;

type Push<T extends readonly unknown[], V> = T extends unknown
  ? Cons<void, T> extends infer U
    ? { [K in keyof U]: K extends keyof T ? T[K] : V }
    : never
  : never;

// final type
export type AddArgument<F, Arg> = F extends (...args: infer PrevArgs) => infer R
  ? (...args: Push<PrevArgs, Arg>) => R
  : never;

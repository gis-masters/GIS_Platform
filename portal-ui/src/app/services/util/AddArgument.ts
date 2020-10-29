// some utility types for working with tuples
type Cons<H, T extends readonly any[]> = ((head: H, ...tail: T) => void) extends (...cons: infer R) => void ? R : never;

type Push<T extends readonly any[], V> = T extends any
  ? Cons<void, T> extends infer U
    ? { [K in keyof U]: K extends keyof T ? T[K] : V }
    : never
  : never;

// final type
export type AddArgument<F, Arg> = F extends (...args: infer PrevArgs) => infer R
  ? (...args: Push<PrevArgs, Arg>) => R
  : never;

export function staticImplements<T>(): <U extends T>(constructor: U) => void {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}

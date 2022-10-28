export function staticImplements<T>(): <U extends T>(constructor: U) => void {
  return <U extends T>(constructor: U) => {
    // eslint-disable-next-line no-unused-expressions -- typescript magic
    constructor;
  };
}

export const notFalsyFilter = Boolean as any as <T>(x: T | false | null | undefined) => x is T;

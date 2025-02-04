export const notFalsyFilter = Boolean as unknown as <T>(x: T | false | null | undefined) => x is T;

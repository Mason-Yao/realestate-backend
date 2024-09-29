export const jsonParser = (input: string | object) => {
  return typeof input === "string" ? JSON.parse(input) : input;
};

export const isValidDate = (date: object) => {
  return date instanceof Date;
};

export const encode = (str: string): string =>
  Buffer.from(str, "utf8").toString("base64");

export const decode = (str: string): string =>
  Buffer.from(str, "base64").toString("utf8");

export function removeUndefinedKey(obj: any) {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
}

export function isSame<T extends object>(
  object1: T,
  object2: T,
  exceptionKeys?: string[]
) {
  return (
    Object.keys(object1).length === Object.keys(object2).length &&
    (Object.keys(object1) as (keyof typeof object1)[])
      .filter((key) => {
        return exceptionKeys ? !exceptionKeys.includes(key as string) : true;
      })
      .every((key) => {
        return (
          Object.prototype.hasOwnProperty.call(object2, key) &&
          JSON.stringify(object1[key]) === JSON.stringify(object2[key])
        );
      })
  );
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

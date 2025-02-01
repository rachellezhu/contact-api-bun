// I'm really sorry for forgotting the source of regex below
export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])/);

// https://ihateregex.io/expr/phone/
export const PHONE_REGEX = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

export const DEFAULT_CURRENT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;

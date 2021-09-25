import { isWhiteListedRole } from "./role";

describe("isWhiteListedRole", () => {
  test("should return true if role is inside", () => {
    expect(isWhiteListedRole('blue')).toEqual(true);
  });
  
  test("should return true if role is inside regardless of case sensitivity", () => {
    expect(isWhiteListedRole('bLuE')).toEqual(true);
  });

  test("should return false if role is not inside", () => {
    expect(isWhiteListedRole('Member')).toEqual(false);
  });

  test("should return true if role is protected", () => {
    expect(isWhiteListedRole('admin')).toEqual(false);
    expect(isWhiteListedRole('moderator')).toEqual(false);
  });
});
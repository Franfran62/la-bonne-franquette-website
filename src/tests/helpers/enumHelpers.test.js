import { getEnumKeyByValue } from "../../helpers/enumHelpers";

describe("getEnumKeyByValue", () => {
    const Colors = {
        RED: "#FF0000",
        GREEN: "#00FF00",
        BLUE: "#0000FF",
    };

    it("should return the correct key for a given value", () => {
        expect(getEnumKeyByValue(Colors, "#FF0000")).toBe("RED");
        expect(getEnumKeyByValue(Colors, "#00FF00")).toBe("GREEN");
        expect(getEnumKeyByValue(Colors, "#0000FF")).toBe("BLUE");
    });

    it("should return undefined if the value does not exist", () => {
        expect(getEnumKeyByValue(Colors, "#FFFFFF")).toBeUndefined();
    });

    it("should return the first matching key if multiple keys have the same value", () => {
        const DuplicateEnum = { A: 1, B: 2, C: 1 };
        expect(getEnumKeyByValue(DuplicateEnum, 1)).toBe("A");
    });

    it("should handle empty enum objects", () => {
        expect(getEnumKeyByValue({}, "any")).toBeUndefined();
    });

    it("should work with non-string values", () => {
        const MixedEnum = { NUM: 42, BOOL: true, STR: "hello" };
        expect(getEnumKeyByValue(MixedEnum, 42)).toBe("NUM");
        expect(getEnumKeyByValue(MixedEnum, true)).toBe("BOOL");
        expect(getEnumKeyByValue(MixedEnum, "hello")).toBe("STR");
    });
});

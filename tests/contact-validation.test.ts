import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { cleanText, validateContactMessage } from "../src/features/contact/validation.ts";

const validMessage = {
  name: "Amine Nahli",
  email: "AMINE@example.com",
  subject: "Proposition de stage",
  message: "Bonjour, je souhaite échanger au sujet d’une opportunité professionnelle.",
  locale: "fr",
};

describe("validateContactMessage", () => {
  it("normalizes a complete valid message", () => {
    assert.deepEqual(validateContactMessage(validMessage), { ...validMessage, email: "amine@example.com" });
  });

  it("rejects malformed email addresses", () => {
    assert.equal(validateContactMessage({ ...validMessage, email: "invalid.example.com" }), null);
  });

  it("rejects messages below the minimum length", () => {
    assert.equal(validateContactMessage({ ...validMessage, message: "Trop court" }), null);
  });

  it("rejects an unknown locale", () => {
    assert.equal(validateContactMessage({ ...validMessage, locale: "es" }), null);
  });

  it("rejects arrays and null values", () => {
    assert.equal(validateContactMessage([]), null);
    assert.equal(validateContactMessage(null), null);
  });
});

describe("cleanText", () => {
  it("trims whitespace and strips control characters", () => {
    assert.equal(cleanText("  Bonjour\u0000 le monde  ", 2, 100), "Bonjour le monde");
  });

  it("enforces both length boundaries", () => {
    assert.equal(cleanText("a", 2, 3), null);
    assert.equal(cleanText("abcd", 2, 3), null);
    assert.equal(cleanText("abc", 2, 3), "abc");
  });
});

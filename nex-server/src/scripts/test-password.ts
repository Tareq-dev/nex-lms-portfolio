import { hashPassword, verifyPassword } from "../utils/password.js";

const testPasswordHashing = async (): Promise<void> => {
  const password = "TestPassword123!";

  const passwordHash = await hashPassword(password);
  const isCorrect = await verifyPassword(passwordHash, password);
  const isIncorrect = await verifyPassword(passwordHash, "WrongPassword");

  console.log("Argon2id hash created:", passwordHash.startsWith("$argon2id$"));
  console.log("Correct password verified:", isCorrect);
  console.log("Wrong password rejected:", !isIncorrect);
};

testPasswordHashing().catch((error: unknown) => {
  console.error("Password hashing test failed:", error);
  process.exitCode = 1;
});
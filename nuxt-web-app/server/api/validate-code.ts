import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  if (!body || !body.code) {
    return { valid: false, message: "Code is required" };
  }

  const correctCode = config.securityCode;
  if (body.code === correctCode) {
    return { valid: true };
  } else {
    return { valid: false, message: "Invalid code" };
  }
});

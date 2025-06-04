import createOTP from "./createOTP.js";
import sendOTPEmail from "./sendOTPEmail.js";

import eventEmitter from "events";
const OTPEvent = new eventEmitter();
OTPEvent.on("sendOtp", async function (email, purpose = "verification") {
  const otp = await createOTP(email, purpose);
  await sendOTPEmail(email, otp, purpose);
});
export default OTPEvent;

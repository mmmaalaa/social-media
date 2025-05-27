import jwt from "jsonwebtoken";
import sendEmail,{subject} from "./sendEmail.js";
import {signUp} from "./signUp.js";
import eventEmitter from "events";
const emailEvent = new eventEmitter();
emailEvent.on("sendEmail", function(email, username){
   const token = jwt.sign({ email }, process.env.JWT_SECRET);
    const link = `${BASE_URL}/auth/activateAccount/${token}`;
    sendEmail({
      to: email,
      subject: subject.activateAccount,
      html: signUp(username, link),
    });
})
export default emailEvent;
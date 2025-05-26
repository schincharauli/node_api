import dotenv from "dotenv";

import { welcomeHtml } from "./templates.js";
import mailTransport from "./mail-settings.js";

dotenv.config();

const send = (to, subject, html) => {
  const options = {
    to,
    subject,
    html,
    from: process.env.GMAIL_USER,
  };

  return mailTransport.sendMail(options);
};

export const registrationWelcome = async (to, name) => {
  const html = welcomeHtml(name);
  return send(to, "Hii ", html);
};

import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";
import { MailDataRequired } from "@sendgrid/helpers/classes/mail"
import fs from "fs/promises";

import { JWTInfo, MailType } from "@interfaces/index";

sgMail.setApiKey(process.env.SEND_GRID_KEY || "");

const sendGridSendMail = async (input: MailDataRequired | MailDataRequired[]) => {
  const [mailInfo] = await sgMail.send(input);
  return mailInfo;
};

const subjectMap: {[key in keyof typeof MailType]: string} = {
  "SIGNUP": `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME}. Please Verify Your Account.`
};

export const sendMail = async <T>(
  userInfo: JWTInfo,
  data: T,
  mailType: MailType,
) => {
  const fileName = mailType.toString().toLowerCase();
  const source = await fs.readFile(
    `./templates/${fileName}.html`,
    "utf-8",
  );
  const template = handlebars.compile(source);
  let mailInfo: any = {
    name: userInfo.firstName,
    appName: process.env.NEXT_PUBLIC_APP_NAME || "",
  }
  if (mailType === MailType.SIGNUP) {
    mailInfo["link"] = `${process.env.NEXT_APP_DASHBOARD_URL}/verify/${data}`;
  }
  const html = template(mailInfo);
  await sendGridSendMail({
    to: userInfo.email,
    from: process.env.FROM_EMAIL as string,
    subject: subjectMap[mailType],
    html,
  }).catch(err => {
    console.error(err);
  });
};

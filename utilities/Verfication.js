//importing third party module
import nodemailer from "nodemailer";

//Creating transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: "mohamed.gamal.testing@gmail.com",
    pass: "iotsymqwhgosjtyh",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function verification(Email) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Task App📩" <mohamed.gamal.testing@gmail.com>', // sender address
    to: Email, // list of receivers
    subject: "Verification Mail", // Subject line
    html: `<h1>Verification Email</h1>
            </div>This mail is to <a href="https://task-app-nkax.onrender.com/user/verify/${Email}">verify your Email </a><div>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
}

verification().catch(console.error);

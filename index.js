const express = require("express");
const app = express();
const sgMail = require("@sendgrid/mail");
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(cors({
  origin:'*', 
  credentials:true,            
  optionSuccessStatus:200,
}));
app.listen(3000, () => {});
app.post("/send-email", (req, res, next) => {
  const { name, email, phone, message } = req.body;
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    from: "hello.mediahunters@gmail.com",
    to: "hello.mediahunters@gmail.com",
    subject: `${email} - ${phone} | ${name}`,
    html: message,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.sendStatus(401);
      new Error("An error message")

    });
});





exports.app = functions.https.onRequest(app);
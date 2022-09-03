const express = require("express");
const app = express();
const sgMail = require("@sendgrid/mail");
const cors = require('cors')
const bodyParser = require('body-parser');
const request = require('request');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


app.use(cors({
  origin:'*', 
  credentials:true,            
  optionSuccessStatus:200,
}));

app.listen(4200, () => {
  console.log('running')
});

app.post("/send-email", (req, res, next) => {
  const { name, email, phone, message } = req.body;

  if(verifyUser(req)) {



    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      from: "hello.mediahunters@gmail.com",
      to: "hello.mediahunters@gmail.com",
      subject: `${email} - ${phone} | ${name}`,
      html: message,
    };
  
    sgMail.send(msg)
    res.json({
      success: true,
      msg: "valid user",
    });
  }



});










function verifyUser(req, res) {
  if (!req.body.captcha) {
    return res.json({ success: false, msg: "Capctha is not checked" });
  }

  const secretKey = '6LdrYsYhAAAAALPExHun2SqVLQRLMw7_Y_3WjcKW';
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;
  
  return request(verifyUrl, (err, response, body) => {
    if (err) {
      console.log(err);
    }

    body = JSON.parse(body);
    return body.success

  });
}
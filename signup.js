const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/home", (req, res) => {
  res.redirect("/");
});
app.post("/", (req, res) => {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.emailid;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  //API endpoint url from mailchimp
  const url = "INSERT API END-POINT HERE";

  const options = {
    method: "POST",
    auth: "anything:INSERT MAILCHIMP *** API KEY HERE *** ", // API KEY from mailchimp
  };

  const sendData = https.request(url, options, (response) => {
    response.on("data", (data) => {
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });
  sendData.write(jsonData);
  sendData.end();
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});

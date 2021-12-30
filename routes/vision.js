var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk"); // Load the SDK
var dotenv = require("dotenv");

router.post("/classify", function (req, res, next) {

  dotenv.config(); //loads environment variables

  const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const client = new AWS.Rekognition();

  //console.log(req.files);

  const params = {
    Image: {
      Bytes: req.files.file.data, //uploaded file
    },
  };

  client.detectLabels(params, function (err, response) {
    if (err) {
      console.log(err, err.stack); // if an error occurred from AWS
      res.status(500).json({
        error: err.code,
      });
    } else {
      res.status(200).json({
        labels: response.Labels.map((label) => label.Name),
      });
    }
  });
});

module.exports = router;

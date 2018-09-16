const aws = require('aws-sdk');
aws.config.region = 'us-west-2';
const S3_BUCKET = process.env.S3_BUCKET;
const fs = require('fs');
const request = require('request');

const s3 = new aws.S3({
  signatureVersion: 'v4'
});

let sendToS3 = (media) => {
  let s = media.split("/");
  let fileName = s[s.length - 1];

  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, url) => {
    if(err){
      console.error(err);
    } else {
      // use presigned url to upload
      request(media).pipe(fs.createWriteStream(fileName)).on("finish", function(){
        fs.readFile(fileName, function(err, data){
          if (err) {
            console.error(err);
          } else {
            request.put(url, {body: data}).on('response', function(){
              // console.log(response.statusCode);
              // console.log(response.statusMessage);
              console.log("File uploaded: " + fileName);
              try {
                fs.unlinkSync(fileName);
              } catch (err) {
                console.error(err);
              }
            })
          }
        })
      });
    }
  });
}

module.exports = { sendToS3 }
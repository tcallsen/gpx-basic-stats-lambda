'use strict';

const Busboy = require('busboy')

module.exports.gpxStats = async event => {
  
  const parser = (event) => {
    const busboy = new Busboy({
      headers: {
          'content-type': getContentType(event)
      }
    });
  }
  
  return {
    statusCode: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    },
    body: JSON.stringify(
      {
        message: 'File successfully recieved',
        contentType: getContentType(event)
      },
      null,
      2
    ),
  };
};

// safely get content type in both serverless online and live aws environment
//  https://develandoo.com/blog/parsing-multipart-body-aws-lambda-function-serverless/
const getContentType = (event) => {
  let contentType = event.headers['content-type']
  if (!contentType){
    return event.headers['Content-Type']
  }
  return contentType
}
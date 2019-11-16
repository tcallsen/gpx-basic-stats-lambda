'use strict';

const Busboy = require('busboy')
const gpxBasicStats = require('../gpx-basic-stats/gpx-basic-stats.js')

module.exports.gpxStats = async event => {
  
  return new Promise((resolve, reject) => {

    // to be populated with gpx route xml
    let gpxFileContents

    // read content-type - determine if file can be read directly from
    //  POST body of if encoded as multipart form
    const contentType = getContentType(event)
    if (contentType.toLowerCase() !== 'multipart/form-data'){

      // lift GPX XML right out of request BODY
      gpxFileContents = event.body

    } else {

      // parse multipart/form-data

      /* // init busboy
      const busboy = new Busboy({
        headers: {
            'content-type': getContentType(event)
        }
      })

      // parse uploaded file
      const uploadedFile = {}
      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        file.on('data', data => {
          uploadedFile.file = data
        })
        file.on('end', () => {
          uploadedFile.filename = filename
          // uploadedFile.contentType = mimetype
        })
      })

      // resolve promise and send response once tasks complete
      busboy.on('finish', () => resolve({
        statusCode: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify(
          {
            message: 'File successfully recieved',
            contentType: getContentType(event),
            fileContents: uploadedFile.file
          },
          null,
          2
        ),
      })) */

    }

    // compute statistics with gpx-basic-statistics module
    //  https://www.npmjs.com/package/gpx-basic-stats
    const statistics = gpxBasicStats( gpxFileContents ) 
    
    // return response - set response code based on if statistics
    //  were successfully calculated
    resolve({
      statusCode: (statistics.successful) ? 200 : 500 ,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      body: JSON.stringify(
        {
          statusCode: (statistics.successful) ? 200 : 500 ,
          message: statistics.message,
          statistics: statistics
        },
        null,
        2
      ),
    })

  })

}

// safely get content type in both serverless online and live aws environment
//  https://develandoo.com/blog/parsing-multipart-body-aws-lambda-function-serverless/
const getContentType = (event) => {
  let contentType = event.headers['content-type']
  if (!contentType){
    return event.headers['Content-Type']
  }
  return contentType
}
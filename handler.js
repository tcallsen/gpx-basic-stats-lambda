'use strict';

const gpxBasicStats = require('../gpx-basic-stats/gpx-basic-stats.js')

module.exports.gpxStats = async event => {

  // lift GPX XML right out of request BODY
  const gpxFileContents = event.body

  // compute statistics with gpx-basic-statistics module
  //  https://www.npmjs.com/package/gpx-basic-stats
  const statistics = gpxBasicStats( gpxFileContents ) 
  
  // return response - set response code based on if statistics
  //  were successfully calculated
  return {
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
  }

}

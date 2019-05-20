const https = require("https");

const FLICKR_URL = "https://api.flickr.com";
const convertEntriesToParam = ( item ) => `${item[0]}=${item[1]}`;

exports.handler = async (event) => {

  return new Promise((resolve, reject) => {
    
    let params;

    //Ensure the body has the right values
    if (event.body) {
        let body = JSON.parse(event.body);
        if ( body && body.params ){ 
          params = { 
            ...body.params,
            api_key: process.env.API_KEY
          };
        }
    } else { 
        reject({
          statusCode: 400,
          statusText: "Invalid Request"
        });
    }

    const upsPackageToParamString = Object.entries(params).map( convertEntriesToParam ).join("&");

    const authOptions = {
      host: FLICKR_URL,
      path: `/services/rest/?${upsPackageToParamString}`,
      port: 443,
      method: "GET"
    };
     
    callApi(authOptions).then( body => {
      resolve({
        statusCode: 200,
        body: JSON.stringify(body),
      });
    }).catch( error => { 
        reject({
          statusCode: 500,
          statusText: "Internal Server Error"
        });
    });
  });
};

function callApi(_options) {
  return new Promise( ( _resolve, _reject ) => {
    const req = https.get(_options, (res) => {
      let body = "";
      
      res.on("data", (d) => {
        body += d;
      });

      res.on("end", function () {
        _resolve(body)
      });
    });

    req.on("error", (e) => {
      _reject(e.message);
    });

    req.end();
  } );
}

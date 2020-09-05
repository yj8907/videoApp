var Promise = require("Promise");

/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


function fetchModel(url) {
  return new Promise(function(resolve, reject) {

    try {
      var xhttp = new XMLHttpRequest();

      xhttp.open("GET", url);
      xhttp.onload = function(){
        if (this.readyState == 4 && this.status == 200){
          // On Success return:
           resolve({data: this.responseText});
        } else {
          reject({status: 404, statusText: 'Failure'});
        }
      }
      console.log(url);
      xhttp.send();

    } catch(err){
      reject({status: 404, statusText: `Error: ${err}`});
    }

  });
}

export default fetchModel;

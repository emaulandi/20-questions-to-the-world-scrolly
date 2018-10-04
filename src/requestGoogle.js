const request = require('request');
const archieml = require('archieml');
const fs = require('fs');

const googleid = "1J-CdJpgo34PIsPS7uAvaL3XXRL53ffl8YlN6FVtifN4"
const url = `https://docs.google.com/document/d/${googleid}/export?format=txt`

request(url, function (error, response, body) {
  console.log('/n error:', error); // Print the error if one occurred
  console.log('/n statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('/n body:', body); // Print the HTML for the Google homepage.
	const parsed = archieml.load(body);
	console.log(parsed);
	
	fs.writeFile('content.json', JSON.stringify(parsed), 'utf8', (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;

    // success case, the file was saved
    console.log('content.json saved');
	});
	
});




console.log(url);


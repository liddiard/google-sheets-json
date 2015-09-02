# google-sheets-json

Get JSON data from public Google Sheets (spreadsheets) and format the data
in an easy-to-consume way.

## Quickstart

Install the package from npm:

```
npm install google-sheets-json
```

Use it in code like this:

```javascript
var Spreadsheet = require('google-sheets-json');

var spreadsheet = new Spreadsheet('my-spreadsheet-id');

spreadsheet.getDefaultWorksheet(function(err, res){
    console.log(res); // array of objects
});

spreadsheet.listWorksheets(function(err, res){
    console.log(res); // array of worksheet ids on this spreadsheet
});

spreadsheet.getWorksheet('my-worksheet-id', function(err, res){
    console.log(res); // array of objects
});
```

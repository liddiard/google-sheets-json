var request = require('superagent');

// should be prepended to every API URL request
var API_URL_PREFIX = "https://spreadsheets.google.com/feeds";

// should be appended to every API URL request
var API_URL_SUFFIX = "public/full?alt=json";

// if you don't add/delete sheets or change sheet names, this will be the
// default sheet name. can't find official documentation from Google, but
// Google "Google Sheets od6", and you'll see that it's a thing.
var DEFAULT_WORKSHEET_ID = "od6";

var Spreadsheet = function(spreadsheetId) {

  this.spreadsheetId = spreadsheetId;

  this.listWorksheets = function(callback) {
    // list all worksheets of this spreadsheet and pass the array to the
    // provided callback as `callback(err, res)`

    var worksheetUrl = [API_URL_PREFIX, 'worksheets', this.spreadsheetId,
      API_URL_SUFFIX
    ].join('/');
    request.get(worksheetUrl).end(function(err, res) {
      if (err) {
        callback(err);
      } else {
        var entries = res.body.feed.entry;
        // extract the url key from its nested structure
        entryIds = entries.map(function(entry) {
          var url = entry.id['$t'];
          return url.substr(url.lastIndexOf('/') + 1);
        });
        callback(null, entryIds);
      }
    });
  };

  this.getWorksheet = function(worksheetId, callback) {
    // get the worksheet with the specified id and pass it to the provided
    // callback as `callback(err, res)`

    var cellsUrl = [API_URL_PREFIX, 'list', this.spreadsheetId, worksheetId,
      API_URL_SUFFIX
    ].join('/');
    request.get(cellsUrl).end(function(err, res) {
      if (err) {
        callback(err);
      } else {
        var formattedResponse = this._formatWorksheetResponse(res.body);
        callback(null, formattedResponse);
      }
    }.bind(this));
  };

  this.getDefaultWorksheet = function(callback) {
    // get the default workshee and pass it to the provided callback as
    // `callback(err, res)`

    this.worksheet(DEFAULT_WORKSHEET_ID, callback);
  };

  this._formatWorksheetResponse = function(data) {
    // delete keys which don't contain cell values and un-nest the nested
    // cell values in the response from Google Sheets

    data.feed.entry.forEach(function(entry) {
      for (var key in entry) {
        if (entry.hasOwnProperty(key)) {
          // all cell value keys are prefixed with 'gsx$'
          if (key.substr(0, 4) === 'gsx$') {
            // copy the value in the key up a level and delete the original key
            entry[key.substr(4)] = entry[key].$t;
            delete entry[key];
          } else {
            // not a key we care about (doesn't hold cell values), so delete
            delete entry[key];
          }
        }
      }
    });
    return data.feed.entry;
  };

};

module.exports = Spreadsheet;

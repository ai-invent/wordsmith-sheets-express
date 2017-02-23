/**
 * Triggered when any cell is edited.
 * Bind this to the onChange trigger in App-Script editor.
 *
 * @param {Object} event
 */
function onEdit(event) {
  var WEBSITE_AUTHORIZATION_HEADER = ''; // this should match the APP_SECRET in .env
  var WEBSITE_POST_URL = 'https://your-website-here.com/api/update'; // change the hostname to match your own

   // This is the column that when changed, will trigger a post to your website. Adjust to whatever number makes sense for your dataset.
  var TRIGGER_COL_INDEX = 19;

  var sheet = SpreadsheetApp.getActiveSheet();
  var cell = sheet.getActiveCell();
  var activeCellIndex = cell.getColumn();

  // Only send values if the trigger col changes.
  if (activeCellIndex !== TRIGGER_COL_INDEX) {
    Logger.log('Returning, activeCellIndex is ' + activeCellIndex);
    return;
  }

  var data = sheet.getDataRange().getValues();

  // Subtract one from the row index to account for the header in data array.
  var adjustedRowIndex = cell.getRowIndex() - 1;
  var rowValues = {};
  var headers = data[0];

  // Now, get the row we want, add the values
  data[adjustedRowIndex].forEach(function(value, index) {
    rowValues[headers[index]] = typeof value !== 'undefined' ? value : '';
  });

  // Don't send the trigger column; it's not part of our dataset.
  delete rowValues[headers[TRIGGER_COL_INDEX - 1]];

  var payload = JSON.stringify(rowValues);
  var options = {
    'method': 'POST',
    'payload': payload,
    'contentType': 'application/json',
    'headers': {
      'Authorization': WEBSITE_AUTHORIZATION_HEADER,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  // POST to website
  UrlFetchApp.fetch(WEBSITE_POST_URL, options);

  Logger.log(payload);
}

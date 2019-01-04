/**
 * Filters and modifies the values that you don't want to be sent to the database.
 *
 * @param {Object} row - Specific row (dictionary) of a sheet
 * @param {Number} rowIndex - Rownumber, used for ID
 * @returns {Object} row - Filtered row
 */
function filterItemsInRow_(row, rowIndex) {
  var excludeValues = {
    column: ['wachtwoord', '', undefined, null, 'tijdstempel'],
  };
     
  for (var key in row) {  
    var objectType = function() {
      if (row[key])
        return /function (\w+)\(\) \{/.exec(row[key].constructor.toString())[1];
    };
    
    switch(objectType()) {
      case 'Date':
        row[key] = (function(date) {
          var day = date.getDate().toString();
          var month = (date.getMonth() + 1).toString();
          var year = date.getFullYear().toString();
          
          var hours = date.getHours().toString();
          var minutes = date.getMinutes().toString();
          var seconds = date.getSeconds().toString();
          
          var v = [padLeft_(day, 2), padLeft_(month, 2), year].join('-'); //+ ' ' + [hours, minutes, seconds].join(':');
          
          if (hours > 0 || minutes > 0 || seconds > 0) {
            return v + ' ' + [hours, minutes, seconds].map(function(v) {
              return padLeft_(v, 2);
            }).join(':');
          } else {
            return v;
          }
        })(row[key]);
        break;
    }
    
    // Validate if value and key is set, not forbidden or empty
    if (!row[key].toString().length || !key.length || excludeValues.column.indexOf(key.toLowerCase()) > -1) {
      row[key] = undefined;
      continue;
    }
    
    // Only if String, not on Arrays / Dictionaries
    if (objectType() === 'String' && row[key].trim() === '')
      row[key] = undefined;
  }
  
  if (Object.keys(row).length !== 0) {
    row.id = rowIndex;
    return row;
  }
}
function _RunUnitTests() {
  QUnit.config({ title: "Unit tests" });
  QUnit.load(function() {
  
    QUnit.test("Merge some keys with some values", function(assert) {
      var keys = ["World", "Foo", "Bar", "Bar", "Bar"];
      var values = [null, true, 1.23, "Hello", "test"];
      
      assert.deepEqual(
        mergeKeysWithValues(keys, values),
        { world: null, foo: true, bar: [1.23, "Hello", "test"] }
      );
      
    });
    
    QUnit.test("getDataRangeValuesBySheet", function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      var dataRangeValues = getDataRangeValuesBySheet(sheet);
      
      assert.deepEqual(dataRangeValues, [
        ['key', 'leader', 'country'],
        ['round', 'obama', 'us'],
        ['square', 'gates', 'us'],
        ['circle', 'maxima', 'nl']
      ]);
    });
    
    QUnit.test("Convert sheet to objects", function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      var objectsFromSheet = sheetToObjectsBySheet(sheet);
    
      assert.deepEqual(objectsFromSheet, [
        {
          key: "round",
          leader: "obama",
          country: "us",
          id: 2
        },
        {
          key: "square",
          leader: "gates",
          country: "us",
          id: 3
        },
        {
          key: "circle",
          leader: "maxima",
          country: "nl",
          id: 4
        },
      ]);
        
      var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("TestDate");
      var objectsFromSheet2 = sheetToObjectsBySheet(sheet2);
    
      assert.deepEqual(objectsFromSheet2, [
        {
          a: "date",
          b: "19-05-2017",
          c: "19-05-2017 16:05:01",
          d: "19-05-2017 12:50:00",
          id: 2
        }
      ]);

    });
    
    QUnit.test("Count Value In Array", function(assert) {
      var array = ['Hi', 'Bye', 'Hello', 123.45, true, 'Night Night', 'Have a good day', 'Hello', 1];
      assert.deepEqual(countValueInArray(array, 'Hello'), 2);
      assert.deepEqual(countValueInArray(array, true), 1);
      
      array = [12, undefined, undefined, null, true, true, false, 'test', 12, 12, 15, 16.2, 12];
      assert.deepEqual(countValueInArray(array, 12), 4);
      assert.deepEqual(countValueInArray(array, true), 2);
      assert.deepEqual(countValueInArray(array, null), 1);
      assert.deepEqual(countValueInArray(array, undefined), 2);
    }); 
    
    QUnit.test('Data Range Values to Objects', function(assert) {
      var date = new Date();
      
      var dataRangeValues = [
        ['Key', 'Foo', 'hello'],
        ['value', true, 'world'],
        [ 1, 'ooF', 1]
      ];
      
      var expectedObjects = [
        { key: "value", foo: true, hello: "world", id: 2 },
        { key: 1, foo: "ooF", hello: 1, id: 3 }
      ];
      
      assert.deepEqual(
        dataRangeValuesToObjects(dataRangeValues),
        expectedObjects
      );
    });
    
    QUnit.test('Data Range Values to Key-Value Dictionary', function(assert) {
      var date = new Date();
      
      var dataRangeValues = [
        ['Key', 'Foo', 'test'],
        ['value', true, 'world'],
        [ 'ooF', 1]
      ];
      
      var expectedObject = {
        'Key': 'Foo',
        'value': true,
        'ooF': 1
      };
      
      assert.deepEqual(
        dataRangeValuesToKeyValueDictionary(dataRangeValues),
        expectedObject
      );
    });
    
    QUnit.test('Get Last Row from Data Range', function(assert) {
      var dataRangeValues = [
        ['test', 'AaBbCc', 'foo', 'bar'],
        ['value', true, 'world', 1],
        ['111', '222', '333', 4],
        [ 'ooF', 1, 'aiii', 'Mate!']
      ];
      
      var expectedObject = {
        'test': 'ooF',
        'aabbcc': 1,
        'foo': 'aiii',
        'bar': 'Mate!'
      };
      
      assert.deepEqual(
        getLastRowFromDataRange(dataRangeValues),
        expectedObject
      );
    });
    
    QUnit.test('Get Last Row from Sheet', function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      
      var expectedObject = {
        'key': 'circle',
        'leader': 'maxima',
        'country': 'nl',
      };
      
      assert.deepEqual(
        getLastRowFromSheet(sheet),
        expectedObject
      );
    });
    
    QUnit.test('Objects in sheet', function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      
      assert.equal(inSheet({ key: 'circle' }, sheet), true);
      assert.equal(inSheet({ country: 'us' }, sheet), true);
      assert.equal(inSheet({ leader: 'gates' }, sheet), true);
    });
    
    QUnit.test('Objects NOT in sheet', function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      
      assert.equal(inSheet({ key: 'orange' }, sheet), false);
      assert.equal(inSheet({ alphabet: 'us' }, sheet), false);
      assert.equal(inSheet({ leader: 'fooBar!' }, sheet), false);
    });
    
    QUnit.test('inSheetMatch_', function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      
      assert.equal(
        inSheetMatch_({ key: 'circle' }, { key: 'orange' }),
        false
      );
      
      assert.equal(
        inSheetMatch_({ key: 'circle' }, { key: 'orange', test: '123' }),
        false
      );
      
      assert.equal(
        inSheetMatch_({ key: 'circle' }, { key: 'circle' }),
        true
      );
      
      assert.equal(
        inSheetMatch_({ key: 'circle' }, { key: 'circle', 'price': 10, 'ping': 'pong' }),
        true
      );
    });
    
    QUnit.test('appendObjectToSheet', function(assert) {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Test");
      
      var sheet  = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
      
      sheet.appendRow(['key', 'leader', 'country']);
      sheet.appendRow(['round', 'obama', 'us']);
      sheet.appendRow(['square', 'gates', 'us']);
      sheet.appendRow(['circle', 'maxima', 'nl']);
      
      appendObjectToSheet(
        {
          'key': 'orange',
          'country': 'be',
          'cheese': 'onion'
        },
        sheet
      );
      
      assert.equal(inSheet({ cheese: 'onion' }, sheet), true);
      assert.equal(inSheet({ key: 'orange' }, sheet), true);
      assert.equal(inSheet({ country: 'be' }, sheet), true);
      
      appendObjectToSheet(
        {
          'key': 'orange',
          'country': 'be',
          'cheese': 'onion'
        },
        sheet
      );
      
      appendObjectToSheet(
        {
          'key': 'orange',
          'country': 'be',
          'cheese': 'onion'
        },
        sheet
      );
      
      assert.deepEqual(
        sheetToObjectsBySheet(sheet),
        [
          { key: 'round', leader: 'obama', country: 'us', id: 2 },
          { key: 'square', leader: 'gates', country: 'us', id: 3 },
          { key: 'circle', leader: 'maxima', country: 'nl', id: 4 },
          { key: 'orange', country: 'be', cheese: 'onion', id: 5 },
          { key: 'orange', country: 'be', cheese: 'onion', id: 6 },
          { key: 'orange', country: 'be', cheese: 'onion', id: 7 }
        ]
      );
      
      SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
    });
    
    QUnit.test('padLeft_', function(assert) {     
      assert.equal(padLeft_(5, 4), "0005");
      assert.equal(padLeft_(0, 2), "00");
      assert.equal(padLeft_(9, 2), "09");
      assert.equal(padLeft_(1, 3), "001");
      assert.equal(padLeft_(999, 4), "0999");
    });
  });
  
  SpreadsheetApp.getUi().showModalDialog(QUnit.getHtml(), 'Unit Tests Results');
}
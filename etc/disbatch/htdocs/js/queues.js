// gets JSON from a URL, parses it, and sends to callback
function getOrPostJSON(method, url, callback, data) {
  if (!window.XMLHttpRequest) {
    alert("Get a real browser");
    return false;
  }
  var request = new XMLHttpRequest();
  var json;
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if (!this.responseText) { console.error("Could not load JSON from url '" + url + "'"); return false; }
      json = JSON.parse(this.responseText);
      if (!json) { console.error("Invalid JSON data obtained from url '" + url + "'"); return false; }
      callback && callback(json);
    }
  };
  request.open(method, url, true);
  if (method == 'POST') request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(data));
}

function getJSON(url, callback) {
  getOrPostJSON('GET', url, callback);
}

function postJSON(url, data, callback) {
  getOrPostJSON('POST', url, callback, data);
}

function mungeData(data) {
  var munged = [];
  data.forEach(function(item) { munged.push({ id: item.id, values: item }); });
  return munged;
}

function load(grid, metadata, data) {
  grid.load({metadata: metadata, data: mungeData(data)});
};

function render(grid, containerid, className, tableid) {
  grid.renderGrid(containerid, className, tableid);
};

function reload(grid, data) {
  grid.update({data: mungeData(data)});
};

/*
 * loadJSON(url, callback, dataOnly):
   - loads a URL
   - calls processJSON(jsonData)
   - calls _callback('json', callback)
   - ignore dataOnly
 * _callback(type, callback):
   - type is ignored unless maybe callback is defined
   - if (callback) callback.call(this)
   - otherwise calls tableLoaded()
 * processJSON(jsonData)
   - turns a json string into an object, if value is not already an object
   - clears this.data
   - if (jsonData.metadata) sets up the metadata
   - if (jsonData.data) sets up the data
 * load(object) is just a wrapper on processJSON(jsonData)
 * loadJSONFromString(json) is just a wrapper on processJSON(jsonData)
 * update(object):
   - if (object.data) updates the data and reloads
 */
window.onload = function() {
  EditableGrid.prototype.modelChanged = function(rowIndex, columnIndex, oldValue, newValue, row) {
    //alert('changed ' + rowIndex + ',' + columnIndex + '\n' + 'from: "' + oldValue + '" to "' + newValue + '"\n' + 'id: ' + row.rowId + '\n' + 'field: ' + this.getColumnName(columnIndex));
    if (this.currentTableid == 'nodes') {
      var data = {};
      data[this.getColumnName(columnIndex)] = newValue;
      postJSON('/nodes/' + this.getRowAttribute(rowIndex, 'columns')[this.getColumnIndex('node')], data, loadNodes);
    } else {
      postJSON('/set-queue-attr-json', { queueid: row.rowId, attr: this.getColumnName(columnIndex), value: newValue}, loadQueues);
    }
  };

  // new
  var queueLayout = [
    { name: "id", label: "ID", datatype: "string", editable: false},
    { name: "plugin", label: "Type", datatype: "string", editable: true},
    { name: "name", label: "Name", datatype: "string", editable: true},
    { name: "threads", label: "Threads", datatype: "integer", editable: true},
    { name: "tasks_done", label: "Done", datatype: "integer", editable: false},
    { name: "tasks_todo", label: "Queued", datatype: "integer", editable: false},
    { name: "tasks_doing", label: "Running", datatype: "integer", editable: false},
  ];
  // a small example of how you can manipulate the object in javascript
  queueLayout[1].values = {
    Europe: {"be":"Belgium","fr":"France","uk":"Great-Britain","nl":"Nederland"},
    America: {"br":"Brazil","ca":"Canada","us":"USA"},
    Africa: {"ng":"Nigeria","za":"South-Africa","zw":"Zimbabwe"},
  };
  var nodeLayout = [
    { name: "id", label: "ID", datatype: "string", editable: false},
    { name: "node", label: "Node", datatype: "string", editable: false},
    { name: "maxthreads", label: "Max Threads", datatype: "integer", editable: true},
  ];
  getJSON('/queue-prototypes-json', function(data) {
    queueLayout[1].values = data;
    var selectList = document.getElementById('inputType');
    var types = Object.keys(data);
    for (var i = 0; i < types.length; i++) {
      var option = document.createElement("option");
      option.value = types[i];
      option.text = types[i];
      selectList.appendChild(option);
    }
  });

  var jsdataGrid = new EditableGrid("DemoGridJsData");
  var containerid = "tablecontent-jsdata";
  var className = "testgrid table table-striped table-bordered table-hover table-condensed";
  var tableid = "queues";
  var loadQueues = function() {
    getJSON("/scheduler-json", function(data) { load(jsdataGrid, queueLayout, data); render(jsdataGrid, containerid, className, tableid); });
  }
  var nodesGrid = new EditableGrid("DemoGridJsData2");
  var nodesContainerid = 'nodes-table';
  var nodesTableid = 'nodes';
  var loadNodes = function() {
    getJSON("/nodes", function(data) { load(nodesGrid, nodeLayout, data); render(nodesGrid, nodesContainerid, className, nodesTableid); });
  }
  loadQueuesAndNodes = function() { loadQueues(); loadNodes(); }	// no var because needed for Refresh button
  newQueue = function() {		// no var because needed for New Queue button
    // POST /start-queue-json?type=Disbatch%3A%3APlugin%3A%3ADummy&name=newq
    // -X POST -d '{"type":"Disbatch::Plugin::Dummy","name":"newq"}' /start-queue-json
    var elements = document.getElementById('queue-form').elements;
    var name = elements.inputName.value;
    var type = elements.inputType.value;
    document.getElementById('queue-form').reset();
    postJSON('/start-queue-json', {name: name, type: type}, loadQueues);
  }
  loadQueuesAndNodes();
  var intervalID = window.setInterval(loadQueuesAndNodes, 60000);

  // json
  //jsonGrid = new EditableGrid("DemoGridJSON"); 
  //jsonGrid.tableLoaded = function() { this.renderGrid("tablecontent-json", "testgrid table table-striped table-bordered table-hover table-condensed"); };
  //jsonGrid.loadJSON("eg/grid.json");

} 

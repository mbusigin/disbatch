/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(disbatch_frontend/*)

************************************************************************ */

qx.Class.define("disbatch_frontend.Taskbrowser",
{
  extend : qx.core.Object,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    createTaskBrowser : function( app, queueid, constructor )
    {
      this.app = app;
      this._queueid = queueid;
      this._constructor = constructor;

      // Create the Window
      var win = new qx.ui.window.Window("Task Browser");
      win.setLayout(new qx.ui.layout.VBox(0));
      win.setShowStatusbar(true);

      var toolbar = new qx.ui.container.Composite( new qx.ui.layout.HBox(0) );
      toolbar.getLayout().setSpacing( 10 );

      toolbar.add( new qx.ui.basic.Label("Node:") );
      this._nodetxt = new qx.ui.form.TextField;
      toolbar.add( this._nodetxt );
      toolbar.add( new qx.ui.core.Spacer(20) );
      
      toolbar.add( new qx.ui.basic.Label("Status:") );
      this._statusslc = new qx.ui.form.SelectBox();
      this._statusslc.add( new qx.ui.form.ListItem("Any", null, -5) );
      this._statusslc.add( new qx.ui.form.ListItem("Done", null, 1) );
      this._statusslc.add( new qx.ui.form.ListItem("Doing", null, 0) );
      this._statusslc.add( new qx.ui.form.ListItem("Waiting", null, -2) );
      toolbar.add( this._statusslc );
      toolbar.add( new qx.ui.core.Spacer(20) );

      this._stdouttxt = new qx.ui.form.TextField;
      this._stdouttxt.setPlaceholder( "<stdout filter>" );
      toolbar.add( this._stdouttxt );

      this._stderrtxt = new qx.ui.form.TextField;
      this._stderrtxt.setPlaceholder( "<stderr filter>" );
      toolbar.add( this._stderrtxt );
      toolbar.add( new qx.ui.core.Spacer(20) );
      
      var filterButton = new qx.ui.form.Button( "Filter" );
      filterButton.addListener( "execute", function() {   
        this.filter();
      }, this );
      toolbar.add( filterButton );

      var addButton = new qx.ui.form.Button( "Add" );
      addButton.addListener( "execute", function() {
        this.task_editor();
      }, this );
      toolbar.add( addButton );
      
      win.add( toolbar );

      var tableModel = new disbatch_frontend.TaskBrowserModel(); //qx.ui.table.model.Simple();
      tableModel.setQueueID( this._queueid );
      tableModel.setColumns([ "Node", "ID", "Status", "Parameters", "CTime", "MTime" ],
                            [ "node", "_id", "status", "parameters", "ctime_str", "mtime_str" ] );

      // table
      var table = new qx.ui.table.Table(tableModel);
      this._tableModel = tableModel;

      table.set({
        width: 900,
        height: 400,
        decorator : null
      });

      table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);
      this._table = table;
      table.addListener("cellDblclick", function(e) {
        var v = this._table.getTableModel().getValue( 1, e.getRow() );
        this.showSingleTask( v );
      }, this );

      win.add( table );

      win.open();
      return win;
    },
    
    
    filter : function()
    {
        var filter = new Object;
        var status = this._statusslc.getModelSelection();
        if ( status != -5 )
        {
            filter[ "status" ] = "" + status;
        }
        
        if ( this._stdouttxt.getValue() && this._stdouttxt.getValue().length > 0 )
        {
            filter[ "stdout" ] = "qr/" + this._stdouttxt.getValue() + "/";
        }

        if ( this._stderrtxt.getValue() && this._stderrtxt.getValue().length > 0 )
        {
            filter[ "stderr" ] = "qr/" + this._stderrtxt.getValue() + "/";
        }

        if ( this._nodetxt.getValue() && this._nodetxt.getValue().length > 0 )
        {
            filter[ "node" ] = this._nodetxt.getValue();
        }
        
        this._tableModel.filter = filter;
        this._tableModel.reloadData();

/*        var req = new qx.io.remote.Request( "/search-tasks-json", "POST", "application/json" );

        var filter = new Object;
        // _stdouttxt _stderrtxt this._statusslc this._nodetxt

                
        req.setParameter( "queue", this._queueid );
	req.setParameter( "json", 1 );
        req.setParameter( "filter", qx.util.Json.stringify(filter) );
        req.addListener( "completed", function(e) {
          var model = this._table.getTableModel();
//          model.removeRows( 0, model.getRowCount() );
          var tasks = e.getContent();
          for ( var x in tasks )
          {
            var r = tasks[ x ];
            if ( r["parameters"] )
            {
              var parameters = "";
              for ( y in r["parameters"] )
              {
                if ( typeof(r["parameters"][y]) == "string" )
                  parameters += r["parameters"][y] + " ";
              }
//              model.addRows( [[ r["node"], r["iid"], r["status"], parameters ]] );
            }
          }
          
        }, this );
        req.send();
        */
    },
    
    showSingleTask: function( id )
    {
      var req = new qx.io.remote.Request( "/search-tasks-json", "POST", "application/json" );
      
      var filter = new Object();
      filter[ "id" ] = id;
      req.setParameter( "queue", this._queueid );
      req.setParameter( "json", 1 );
      req.setParameter( "filter", qx.lang.Json.stringify(filter) );
      
      req.addListener( "completed", function(e) {
        var r = e.getContent();
        var task = r[0];
      
        var win = new qx.ui.window.Window( "Task: " + id );
        win.setLayout( new qx.ui.layout.VBox() );
        win.getLayout().setSpacing( 5 )
        var row1 = new qx.ui.container.Composite( new qx.ui.layout.HBox() );
        row1.getLayout().setSpacing( 5 );
        var row2 = new qx.ui.container.Composite( new qx.ui.layout.HBox() );
        row2.getLayout().setSpacing( 5 );
      
        var stdouttxt = new qx.ui.form.TextArea( "" );
        stdouttxt.setHeight( 200 );
        stdouttxt.setWidth( 700 );
        stdouttxt.setValue( task.stdout );
        stdouttxt.setAllowGrowY( true );
        row1.add( stdouttxt );
      
        var stderrtxt = new qx.ui.form.TextArea( "" );
        stderrtxt.setHeight( 200 );
        stderrtxt.setWidth( 700 );
        stderrtxt.setValue( task.stderr );
        row2.add( stderrtxt );
      
        var metadata = new qx.ui.container.Composite( new qx.ui.layout.Grid() );
        metadata.add( new qx.ui.basic.Label("Node:"), {row:0, column:0} );
        metadata.add( new qx.ui.basic.Label("" + task.node), {row:0, column:1} );
        metadata.add( new qx.ui.basic.Label("Status:"), {row:1, column:0} );
        metadata.add( new qx.ui.basic.Label("" + task.status), {row:1, column:1} );
        metadata.add( new qx.ui.basic.Label("ID:"), {row:2, column:0} );
        metadata.add( new qx.ui.basic.Label("" + task._id), {row:2, column:1} );
        row1.add( metadata );
      
        var parameters = new qx.ui.form.List();
        for ( var a in task.parameters )
        {
          if ( typeof(task.parameters[a]) == "string" )
          {
            var item = new qx.ui.form.ListItem( task.parameters[a] );
            parameters.add( item );
          }
        }
        
        row2.add( parameters );
      
        win.add( row1 );
        win.add( row2 );
      
        win.open();
      }, this );
      req.send();
    },
    
    task_editor : function()
    {
      var win = new qx.ui.window.Window( "New Task" );
      this.task_editor_win = win;
      win.setModal( true );
      var layout = new qx.ui.layout.VBox();
      layout.setSpacing( 5 );
      win.setLayout( layout );
      var form = new qx.ui.form.Form();
      this.e_controller = new qx.data.controller.Form(null, form);
      this.e_model = this.e_controller.createModel();
      var prototype = this.app.queuebrowser.queue_prototypes[this._constructor];
      form.addGroupHeader( this._constructor );
      for ( var x in prototype )
      {
          var param = prototype[ x ];
          if ( param["default"] )
          {
              var field = new qx.ui.form.TextField();
              field.setPlaceholder( param["default"] );
              form.add( field, param["name"].replace('&', 'and') );
          }
      }

            
      // send button with validation
      var sendButton = new qx.ui.form.Button("Send");  
      sendButton.addListener("execute", function() { 
        if (form.validate()) {
          var o = qx.util.Serializer.toNativeObject( this.e_controller.createModel() );
          var task = new Array();
          for ( var key in o )
          {
              task.push( o[key] );
          }

          var req;
          if ( this.toggleFilterPane.getValue() )
          {
              req = new qx.io.remote.Request("/queue-create-tasks-from-users-json", "POST", "application/json" );
              req.setParameter( "filter", qx.lang.Json.stringify(this.userFilterPaneObject.getFilter()) );
              req.setParameter( "columns", qx.lang.Json.stringify(task) );
              req.setParameter( "group", "gvtc" );
              req.setParameter( "jsonfilter", 1 );
          }
          else
          {
              req = new qx.io.remote.Request("/queue-create-tasks-json", "POST", "application/json" );
              req.setParameter( "object", qx.lang.Json.stringify([task]) );
          }
          req.setParameter( "queueid", this._queueid );
          req.addListener("completed", function (e) {
              this.filter();
          }, this );

          req.send();
          this.task_editor_win.close();
        }
      }, this);
      form.addButton(sendButton);

      // reset button
      var resetButton = new qx.ui.form.Button("Reset");
      resetButton.addListener("execute", function() {
        form.reset();
      }, this);
      form.addButton(resetButton);

      this.userFilterPaneObject = new disbatch_frontend.UserFilterPane();
      this.userFilterPane = this.userFilterPaneObject.createPane( this.app )
      this.userFilterContainer = new qx.ui.groupbox.GroupBox( "User Filter" );
      this.userFilterContainer.setLayout( new qx.ui.layout.Basic() );
      this.userFilterContainer.hide();
                    
      var toggleFilterPane = this.toggleFilterPane = new qx.ui.form.ToggleButton( "Create tasks from query" );

      toggleFilterPane.addListener( "changeValue", function(e)
      {
          if ( e.getData() == 1 )
          {
              this.userFilterContainer.add( this.userFilterPane );
              this.userFilterContainer.show();
          }
          else
          {
              this.userFilterContainer.remove( this.userFilterPane );
              this.userFilterContainer.hide();
          }
      }, this );
      win.add( toggleFilterPane );
      win.add( this.userFilterContainer );
      var f = new qx.ui.form.renderer.Single( form );
      win.add( f ); //, {left: 10, top: 10} );
      win.open();
    }
  }
});

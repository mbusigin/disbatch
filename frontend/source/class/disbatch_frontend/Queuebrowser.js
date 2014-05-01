/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(disbatch_frontend/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "disbatch_frontend"
 */
qx.Class.define("disbatch_frontend.Queuebrowser",
{
  extend : qx.core.Object,

  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    createQueueBrowser : function( app )
    {
      this.app = app;

      this.load_queue_prototypes();

      // Create the Window
      var win = new qx.ui.window.Window("Queue Browser");
      win.setLayout(new qx.ui.layout.VBox(10));
      win.setShowStatusbar(true);

      var tableModel = new qx.ui.table.model.Simple();
      tableModel.setColumns([ "ID", "Type", "Name", "Threads", "Done", "To-Do", "Processing", "Backfill" ]);
      tableModel.setData( [[ "1N1", "Synacor::Disbatch::Queue::Enclosure", "Test enclosure", 3, 15238, 114, 4, 0]] );
      tableModel.setColumnEditable(1, true);
      tableModel.setColumnEditable(2, true);
      tableModel.setColumnEditable(3, true);

      // table
      var table = new qx.ui.table.Table(tableModel);

      table.set({
        width: 900,
        height: 400,
        decorator : null
      });

      table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.SINGLE_SELECTION);

      var ce = new qx.ui.table.celleditor.ComboBox();
      ce.setListData( this.queue_types );
      table.getTableColumnModel().setCellEditorFactory( 1, ce );

      win.add( table );

      this._table = table;
      this._tablemodel = tableModel;
      this._window = win;


      table.addListener(
        "dataEdited",
        function(event)
        {
          if ( !(event instanceof qx.event.type.Data))
          {
            return;
          }
          var changedData = event.getData();
          var id = this.getTableModel().getValue( 0, changedData.row );
          this.info( "changedData: " + changedData.value );
          this.info( "row: " + changedData.row );
          this.info( "col: " + changedData.col );
          this.info( "value: " + changedData.value );
          this.info( "id: " + id );

          var attr;
          if ( changedData.col == 1 )
          {
              attr = "constructor";
          }
          if ( changedData.col == 2 )
          {
              attr = "name";
          }
          if ( changedData.col == 3 )
          {
              attr = "maxthreads" ;
          }

          var req = new qx.io.remote.Request("/set-queue-attr-json", "POST", "application/json" );
          req.setParameter( "queueid", id );
          req.setParameter( "attr", attr );
          req.setParameter( "value", changedData.value );
          req.send();

/*          var model =
            this.getTableModel();
          this.info( "model: " + model );
          var key =
              model.getValue(0,changedData.firstRow);
          this.info( "key: " + key );
          var value =
            model.getValue(changedData.firstColumn, changedData.firstRow);
          this.info( "value: " + value );

          this.info("User edited property '" + key +
                    "' and entered value '" + value +"'."); */
        },
        table );


      var toolbar = new qx.ui.container.Composite( new qx.ui.layout.HBox(0) );
      win.add( toolbar );

      var newButton = new qx.ui.form.Button("New");
      newButton.addListener("execute", function() {
        this.newQueueDialog();
      }, this );
      toolbar.add( newButton );

      var delButton = new qx.ui.form.Button("Delete");

      delButton.addListener("execute", function() {
        this.deleteQueueDialog();
      }, this );

      toolbar.add( delButton );


      var tasksButton = new qx.ui.form.Button( "Tasks" );
      tasksButton.addListener( "execute", function() {
        var index;
        this._table.getSelectionModel().iterateSelection(function(ind) {
            index = ind;
        });

        var id = this._table.getTableModel().getValue( 0, index );
        var constructor = this._table.getTableModel().getValue( 1, index );
        this.app.showTaskBrowser( id, constructor );
      }, this );
      toolbar.add( tasksButton );


      var refreshButton = new qx.ui.form.Button( "Refresh" );
      refreshButton.addListener("execute", function() {
        this.loadqueues();
      }, this );
      toolbar.add( refreshButton );



      win.open();
      this.loadqueues();
      return win;
    },


    loadqueues : function()
    {
      this._window.setStatus("Loading queue data...");
      var req = new qx.io.remote.Request("/scheduler-json", "GET", "application/json" );
      req.addListener("completed", function (e) {
        this._window.setStatus("Downloaded queue data.  Populating.." );
        var queues = e.getContent();
        var table = [];
        var model = this._table.getTableModel();
        model.removeRows( 0, model.getRowCount() );

        for ( var x in queues )
        {
            this._window.setStatus( x );
            var q = queues[ x ];
            if ( q["id"] )
            {
                model.addRows( [[ q["id"], q["constructor"], q["name"], q["maxthreads"], q["tasks_done"], q["tasks_todo"], q["tasks_doing"], q["tasks_backfill"] ]] );
            }
        }

        this._window.setStatus( "Queues loaded." );

      }, this );
      req.send();
    },

    deleteQueueDialog : function()
    {
      var wm1 = new qx.ui.window.Window("Queue deletion confirmation");
      this.dqDialog = wm1;
      wm1.setModal(true);
      wm1.moveTo(150, 150);
      wm1.setLayout( new qx.ui.layout.HBox() );
      wm1.setAllowMaximize(false);
      wm1.setAllowMinimize(false);
      wm1.add( new qx.ui.basic.Label("Really delete queue?") );


      // send button with validation
      var yesButton = new qx.ui.form.Button("Yes");
      yesButton.addListener("execute", function() {
        var index;
        this._table.getSelectionModel().iterateSelection(function(ind) {
            index = ind;
        });

        var id = this._table.getTableModel().getValue( 0, index );
        var req = new qx.io.remote.Request("/delete-queue-json", "POST", "application/json" );
        req.setParameter( "id", id );
        req.send();
        req.addListener("completed", function (e) {
          this.loadqueues();
        }, this );
        this.dqDialog.close();
      }, this );
      wm1.add(yesButton);

      var noButton = new qx.ui.form.Button( "No" );
      noButton.addListener( "execute", function() {
        this.dqDialog.close()
      }, this );
      wm1.add(noButton);
      wm1.open();
    },

    newQueueDialog : function()
    {
      var wm1 = new qx.ui.window.Window("Start new queue");
      this.nqDialog = wm1;
      wm1.setModal(true);
      wm1.moveTo(150, 150);
      wm1.setLayout( new qx.ui.layout.Basic() );
      wm1.setAllowMaximize(false);
      wm1.setAllowMinimize(false);

      this.app.getRoot().add(wm1);

      var form = new qx.ui.form.Form();
      form.addGroupHeader( "New Queue" );

      var nqName = new qx.ui.form.TextField();
      nqName.setRequired( true );
      form.add( nqName, "Name" );

      var nqType = new qx.ui.form.SelectBox();
      for ( var x in this.queue_types )
      {
        if ( typeof(this.queue_types[x]) == "string" )
        {
          nqType.add( new qx.ui.form.ListItem(this.queue_types[x], null, this.queue_types[x]) );
        }
      }
      nqType.setRequired( true );
      form.add( nqType, "Type" );

      var controller = new qx.data.controller.Form(null, form);
      var model = controller.createModel();


      // send button with validation
      var sendButton = new qx.ui.form.Button("Send");
      sendButton.addListener("execute", function() {
        if (form.validate()) {
          var o = qx.util.Serializer.toNativeObject( model );
          var req = new qx.io.remote.Request("/start-queue-json", "POST", "application/json" );
          req.setParameter( "type", o[ "Type"] );
          req.setParameter( "name", o[ "Name" ] );
          req.addListener("completed", function (e) {
              this.loadqueues();
          }, this );

          req.send();
          this.nqDialog.close();
        }
      }, this);
      form.addButton(sendButton);

      // reset button
      var resetButton = new qx.ui.form.Button("Reset");
      resetButton.addListener("execute", function() {
        form.reset();
      }, this);
      form.addButton(resetButton);


      wm1.add(new qx.ui.form.renderer.Single(form), {left: 10, top: 10});
      wm1.open();
  },

  load_queue_prototypes: function()
  {
      var req = new qx.io.remote.Request( "/queue-prototypes-json", "POST", "application/json" );
      req.setAsynchronous( false );
      req.addListener( "completed", function(e) {
        this.queue_prototypes = e.getContent();
        this.queue_types = []
        for ( var x in this.queue_prototypes )
        {
          this.queue_types.push( x );
        }
      }, this );
      req.send();
  }

  }
});

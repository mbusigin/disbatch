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
qx.Class.define("disbatch_frontend.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Variant.isSet("qx.debug", "on"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      

      // Document is the application root
/*
      var doc = this.getRoot();

      var canvas = new qx.ui.container.Composite(new qx.ui.layout.Canvas);
      var layout = new qx.ui.layout.Grid(0, 0);
      canvas.setLayout(layout);
      doc.add( canvas );

      // Add button to document at fixed coordinates
      // Create a button
      for ( var x = 0; x < 5; x ++ )
      {
          var button1 = new qx.ui.form.Button("First Button", "disbatch_frontend/test.png");
          canvas.add(button1, {row: 0, column: x});
          // Add an event listener
          button1.addListener("execute", function(e) {
            alert("Hello Glob");
          });
      }
*/      
      this.queuebrowser = new disbatch_frontend.Queuebrowser;
      this.getRoot().add( this.queuebrowser.createQueueBrowser(this), {left:20, top:20} );
    },
    
    showTaskBrowser : function( id, constructor )
    {
      this.taskbrowser = new disbatch_frontend.Taskbrowser;
      this.getRoot().add( this.taskbrowser.createTaskBrowser(this, id, constructor), {left:30, top: 30} );
    }
    
  }
});

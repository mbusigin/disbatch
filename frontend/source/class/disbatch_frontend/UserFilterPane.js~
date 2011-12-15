/*
#asset(disbatch_frontend/*)
*/

qx.Class.define( "disbatch_frontend.UserFilterPane",
{
  extend : qx.core.Object,
  
  members :
  {
      createPane : function( app )
      {
          this.filter = new Object;
      
          this.app = app;
          var scroll = new qx.ui.container.Scroll();
          var container = new qx.ui.container.Composite( new qx.ui.layout.Grid(2, 5) );
          container.set( { allowGrowX: true, allowGrowY: true } );
          scroll.add( container );
          
          this.tableModel = new qx.ui.table.model.Simple();
          this.tableModel.setColumns( [ "Key", "Value" ] );
          this.table = new qx.ui.table.Table( this.tableModel );
          this.table.set( { 
                            width: 600,
                            height: 200
                          }
                        );
          this.table.getSelectionModel().setSelectionMode( qx.ui.table.selection.Model.SINGLE_SELECTION );
          this.table.addListener("cellClick", function(e)
          {
              this.editFilter( this.tableModel.getValue(0, e.getRow()), this.tableModel.getValue(1, e.getRow()) );
          }, this );
          container.add( this.table, { row: 0, column: 0, colSpan:2 } );
          
          container.add( new qx.ui.basic.Label("Key"), { row: 1, column: 0 } );
          container.add( new qx.ui.basic.Label("Value"), { row: 1, column: 1 } );
          
          this.txtKey = new qx.ui.form.TextField();
          container.add( this.txtKey, { row: 2, column: 0 } );
          
          this.txtValue = new qx.ui.form.TextField();
          container.add( this.txtValue, { row: 2, column: 1 } );
          
          
          var operators = new qx.ui.container.Composite( new qx.ui.layout.VBox() );
          opeq = this.opeq = new qx.ui.form.RadioButton( "=" );
          opgt = this.opgt = new qx.ui.form.RadioButton( ">" );
          oplt = this.oplt = new qx.ui.form.RadioButton( "<" );
          opre = this.opre = new qx.ui.form.RadioButton( "~" );
          operators.add( opeq );
          operators.add( opgt );
          operators.add( oplt );
          operators.add( opre );
          this.operatorsGroup = new qx.ui.form.RadioGroup( opeq, opgt, oplt, opre );
          container.add( operators, { row: 3, column: 0 } );

          var options = new qx.ui.container.Composite( new qx.ui.layout.VBox() );
          this.chknot = new qx.ui.form.CheckBox( "Not" );
          options.add( this.chknot );
          container.add( options, { row: 3, column: 1 } );


          var toolbar = new qx.ui.container.Composite( new qx.ui.layout.HBox(0) );
          toolbar.getLayout().setSpacing( 5 );
          
          var applyButton = new qx.ui.form.Button( "Apply" );
          applyButton.addListener( "execute", function()
          {
              this.addFilter();
          }, this );
          toolbar.add( applyButton );

          var cancelButton = new qx.ui.form.Button( "Cancel" );
          cancelButton.addListener( "execute", function()
          {
              this.emptyFilter();
          }, this );
          toolbar.add( cancelButton );
          
          var deleteButton = new qx.ui.form.Button( "Delete" );
          deleteButton.addListener( "execute", function()
          {
              this.deleteFilter();
          }, this );
          toolbar.add( deleteButton );
          
          container.add( toolbar, { row: 4, column: 0, colSpan: 2 } );

/*          var pane = new qx.ui.groupbox.GroupBox( "User Filter" );
          pane.setLayout( new qx.ui.layout.Basic() );
          pane.add( container ); */
          return container;
      },
      
      addFilter : function()
      {
          var v = this.txtValue.getValue();
          
          if ( this.operatorsGroup.getSelection().length > 0 )
          {
              var selected = this.operatorsGroup.getSelection();
              var op = selected[ 0 ].getLabel();
              
              if ( op != "=" )
              {
                  var w = v;
                  v = new Object;
                  
                  if ( op == ">" )
                  {
                      v[ "$gt" ] = w;
                  }
                  else if ( op == "<" )
                  {
                        v[ "$lt" ] = w;
                  }
                  else if ( op == "~" )
                  {
                      v = "qr/" + w + "/";
                  }
              }
          }
          
          if ( this.chknot.getValue() )
          {
              var w = v;
              v = new Object;
              v[ '$not' ] = w;
          }

          this.filter[ this.txtKey.getValue() ] = v;
          this.blitToModel();
          this.emptyFilter();
      },
      
      
      blitToModel : function()
      {
          this.tableModel.removeRows( 0, this.tableModel.getRowCount() );
          for ( var k in this.filter )
          {
              var val = this.filter[ k ];
              if ( typeof(val) == "object" )
              {
                  if ( val["$not"] )
                  {
                      this.chknot.setValue( true );
                      val = val[ "$not" ];
                  }
              }
              
              if ( typeof(val) == "object" )
              {
                  if ( val["$lt"] )
                  {
                      this.oplt.setValue( true );
                      val = val[ "$lt" ];
                  }
                  else if ( val["$gt"] )
                  {
                      this.opgt.setValue( true );
                      val = val[ "$gt" ];
                  }
              }
              
              this.tableModel.addRows( [[ k, val ]] );
          }
      },
      
      editFilter : function( key, val )
      {
          this.txtKey.setValue( key );

          this.chknot.setValue( false );
          this.opeq.setValue( true );

          val = this.filter[ key ];
          if ( typeof(val) == "object" )
          {
              for ( var k in val )
              {
                  if ( k == "$not" )
                  {
                      this.chknot.setValue( true );
                      val = val[ k ];
                  }
              }
              for ( var l in val )
              {
                  if ( l == "$lt" )
                  {
                      this.oplt.setValue( true );
                      val = val[ l ];
                  }
                  else if ( l == "$gt" )
                  {
                      this.opgt.setValue( true );
                      val = val[ l ];
                  }
              }
          }
          
          this.txtValue.setValue( val );
      },
      
      deleteFilter : function()
      {
          delete this.filter[ this.txtKey.getValue() ];
          this.blitToModel();
          this.emptyFilter();
      },
      
      emptyFilter : function()
      {
          this.txtKey.setValue( "" );
          this.txtValue.setValue( "" );
          this.chknot.setValue( false );
          this.opeq.setValue( true );
      },
      
      getFilter : function()
      {
          return this.filter;
      }
  }
} );

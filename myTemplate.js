Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
        var that = this;
            
            var cb = Ext.create('Ext.Container', {
            
            items: [
                {
                    xtype  : 'rallybutton',
                    text   : 'create',
                    id     : 'b',
                    handler: function() {
                            that._getModel(); 
                    }
                }
                        
                ]
            });
            this.add(cb);

    },
    
   _getModel: function(){
        console.log("_getModel");
   }
});

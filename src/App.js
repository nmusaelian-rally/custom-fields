Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
            this._comboBoxContainer = Ext.create('Ext.Container', {
            
             
            });
            this.add(this._comboBoxContainer);
             var filter = Ext.create('Rally.data.QueryFilter', {
                                property: 'ElementName',
                                operator: '=',
                                value: 'Defect'
                            });
                            filter = filter.or({
                                property: 'ElementName',
                                operator: '=',
                                value: 'Hierarchical Requirement'  
                            });
                            filter = filter.or({
                                property: 'ElementName',
                                operator: '=',
                                value: 'TestCase'  
                            });
                            filter = filter.or({
                                property: 'ElementName',
                                operator: '=',
                                value: 'Task'  
                            });
                            filter.toString();
            var typeDefCombobox = Ext.widget('rallycombobox', {
                storeConfig: {
                    autoLoad: true,
                    model: 'TypeDefinition',
                    fetch: ['Attributes'],
                    filters:[filter]
                },
                listeners:{
   			ready: function(combobox){
   				var typeDefRef = combobox.getRecord().get('_ref');
                                console.log('ready', typeDefRef);
                                var attributesRef = combobox.getRecord().get('Attributes')._ref;
                                var attributes = combobox.getRecord().getCollection('Attributes');
                                console.log('attributesRef', attributesRef);
                                console.log('attributes', attributes);
   				this._loadCustomFields(attributes);
   				//console.log('what is this', this);
   			},
   			select: function(combobox){
   				var typeDefRef = combobox.getRecord().get('_ref');
                                console.log('ready', typeDefRef);
                                var attributesRef = combobox.getRecord().get('Attributes')._ref;
                                var attributes = combobox.getRecord().getCollection('Attributes');
                                console.log('attributesRef', attributesRef);
                                console.log('attributes', attributes);
   				this._loadCustomFields(attributes);
   			},
   			scope: this  //IMPORTANT
   		}
            });
            this._comboBoxContainer.add(typeDefCombobox);
    },
    _loadCustomFields: function(attributes){
        var that = this;
        console.log('attributes', attributes);
        
        var fields = [];
        attributes.load({
                                fetch: ['ElementName'],
                                callback: function(records, operation, success){
                                    //var fields = [];//this works
                                    Ext.Array.each(records, function(field){
                                        console.log('field',field);
                                        fields.push(field.get('ElementName'));
                                  // }, this);
                                    });
                                   console.log('fields',fields);
                                   that._buildCustomFieldsCombobox(fields);
                                }//,
                                //scope: this
                            });
                            
        
        
      // console.log('fields outside of callback',fields); //empty array 
    },
    
    _buildCustomFieldsCombobox: function(fields){
        console.log('fields',fields);
    }
});

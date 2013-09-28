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
   				this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
   			},
   			select: function(combobox){
   				this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
   			},
   			scope: this
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
                                    Ext.Array.each(records, function(field){
                                        console.log('field',field);
                                        fields.push(field.get('ElementName'));
                                    });
                                   console.log('fields',fields);
                                   that._buildCustomFieldsCombobox(fields);
                                }
                            });
    },
    
    _buildCustomFieldsCombobox: function(fields){
        console.log('fields',fields);
    }
});

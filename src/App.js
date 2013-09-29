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
                id: 'cb1',
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
                                        fields.push({'name':field.get('ElementName')}); //
                                    });
                                    if (!that.down('#cb2')) {
                                        that._buildCustomFieldsCombobox(fields);
                                    }
                                    else{
                                        Ext.getCmp('cb2').destroy();
                                        that._buildCustomFieldsCombobox(fields);
                                    }
                                   
                                }
                            });
    },
    
    _buildCustomFieldsCombobox: function(fields){
        
        var that = this;
        console.log('fields',fields);
        var customFieldsStore = Ext.create('Ext.data.Store', {
            autoLoad: true,
            fields: ['name'],
            data: fields
        });
         var customFieldsCombobox = Ext.widget('rallycombobox', {
                id: 'cb2',
                store: customFieldsStore,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'name',
                value: fields[0].name,
                listeners:{
   			ready: function(combobox){
   				that._showCustomFields();
   			},
   			select: function(combobox){
   				that._showCustomFields();
   			},
   			scope: this
   		}
            });
            this._comboBoxContainer.add(customFieldsCombobox);
    },
    
    _showCustomFields:function(){
        console.log('_showCustomFields');
    }
});

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',

    launch: function() {
            this._comboBoxContainer = Ext.create('Ext.Container', {
                items:[
                    {
                        xtype: 'text',
                        id: 't'
                        }
                ]
             
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
                                value: 'HierarchicalRequirement'  
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
                    fetch: ['Attributes','ElementName', 'TypePath'],
                    valueField: 'ElementName',  
                    filters:[filter]
                },
                listeners:{
   			ready: function(combobox){
                                console.log('typeDefCobobox listener: ready');
                                this._loadCustomFields(combobox.getRecord());
   			},
   			select: function(combobox){
                                console.log('typeDefCobobox listener: select');
                                this._loadCustomFields(combobox.getRecord());
   			},
   			scope: this
   		}
            });
            this._comboBoxContainer.add(typeDefCombobox);
    },

    _loadCustomFields: function(record){
        var that = this;
        var attributes = record.getCollection('Attributes');
        console.log('attributes', record.getCollection('Attributes'));
        this._type = record.get('ElementName');
        var fieldsArray = [];
        attributes.load({
                                fetch: ['ElementName'],
                                callback: function(fields, operation, success){
                                    Ext.Array.each(fields, function(field){
                                        if (field.get('Custom')===true && field.get('AttributeType') != "TEXT" && field.get('AttributeType') != "BOOLEAN") {
                                            fieldsArray.push({'name':field.get('ElementName')}); 
                                        }
                                    });
                                    if (!that.down('#cb2')) {
                                        that._buildCustomFieldsCombobox(fieldsArray);
                                    }
                                    else{
                                        Ext.getCmp('cb2').destroy();
                                        that._buildCustomFieldsCombobox(fieldsArray);
                                    }
                                   
                                }
                            });
    },
    
    _buildCustomFieldsCombobox: function(fields){
        this.down('#t').setText('Number of custom fields: ' + fields.length );
        if (fields.length>0) { 
            var customFieldsStore = Ext.create('Rally.data.custom.Store', {
            autoLoad: true,
            fields: ['name'],
            data: fields
        });
         var customFieldsCombobox = Ext.widget('rallycombobox', {
                id: 'cb2',
                store: customFieldsStore,
                valueField: 'name',
                displayField: 'name',
                value: fields[0].name,
                listeners:{
   			ready: function(combobox){
                                this._customField = combobox.getRecord().get('name');
                                this._loadData();
   			},
   			select: function(combobox){
                                this._customField = combobox.getRecord().get('name');
                                this._loadData();
   			},
   			scope: this
   		}
            });
         this._comboBoxContainer.add(customFieldsCombobox);
        }   
    },
    
    _loadData:function(){
        var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', {
                    context: {
                        workspace: '/workspace/12352608129'
                    },
                    autoLoad : true,
                    filters  : [
                            {
                                  property : this._customField,
                                  operator : 'exists',
                                  value : true
                       
                           },{
                                  property : '__At',
                                  value    : 'current'
                            },{
                                  property : '_TypeHierarchy',
                                  value    : this._type
                             }],
                    fetch: ['Name','_UnformattedID',this._customField], 
                    order: 'OpenedDate DESC',
                    listeners: {
                        load: function (snapshotStore) {
                            console.log(snapshotStore.getCount());
   			    this._updateGrid(snapshotStore);
                        },
                        scope:this
                    }
                });
    },
     _updateGrid: function(snapshotStore){
        if(this._myGrid === undefined){
   		this._createGrid(snapshotStore);
   	}
   	else{
                Ext.getCmp('g').destroy();
                this._createGrid(snapshotStore);
   	}
    },
    _createGrid: function(snapshotStore){
   	this._myGrid = Ext.create('Ext.grid.Panel', {
   		title: 'work items with custom field',
   		store: snapshotStore,
                id:'g',
   		columns: [
   		        {text: 'ID', dataIndex: '_UnformattedID'},
   			{text: 'Name', dataIndex: 'Name'},
                        {text: this._customField, dataIndex: this._customField}
   		],
   		height: 400
   	});
   	this.add(this._myGrid);
   }
});
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
            /*                
            var typeDefStore = Ext.create('Rally.data.WsapiDataStore', {
                autoLoad: true,
                model: 'TypeDefinition',
                fetch: ['Attributes','ElementName','TypePath'],
                valueField: 'ElementName',  
                filters:[filter]
            });*/
            
            /*valueField - according to doc Defaults to: '_ref', maybe it means '_refObjectName',
            which is "Hierarchical Requirement" or "Test Case" when there is space in the name*/
            
            
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
   				//this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
                                this._loadCustomFields(combobox.getRecord());
   			},
   			select: function(combobox){
                                console.log('typeDefCobobox listener: select');
   				//this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
                                this._loadCustomFields(combobox.getRecord());
   			},
   			scope: this
   		}
            });
            /*
             var typeDefCombobox = Ext.widget('rallycombobox', {
                id: 'cb1',
                store: typeDefStore,
                listeners:{
                        
   			ready: function(combobox){
                                //console.log('STORE', typeDefCombobox.store.valueField);
                                console.log('typeDefCobobox listener: ready');
   				//this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
                                this._loadCustomFields(combobox.getRecord());
                                
   			},
   			select: function(combobox){
                                console.log('typeDefCobobox listener: select');
   				//this._loadCustomFields(combobox.getRecord().getCollection('Attributes'));
                                this._loadCustomFields(combobox.getRecord());
   			},
   			scope: this
   		}
            });*/
            this._comboBoxContainer.add(typeDefCombobox);
    },
   // _loadCustomFields: function(attributes){
    _loadCustomFields: function(record){
        console.log('_loadCustomFields');
        var that = this;
        var attributes = record.getCollection('Attributes');
        console.log('attributes', record.getCollection('Attributes'));
        this._type = record.get('ElementName');
        console.log('ElementName', this._type);
        
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
                                        that._buildCustomFieldsCombobox(fieldsArray, attributes);
                                    }
                                    else{
                                        Ext.getCmp('cb2').destroy();
                                        that._buildCustomFieldsCombobox(fieldsArray, attributes);
                                    }
                                   
                                }
                            });
    },
    
    _buildCustomFieldsCombobox: function(fields){
        console.log('_buildCustomFieldsCombobox.... _type', this._type);
        var that = this;
        //console.log('fields',fields);
        that.down('#t').setText('Number of custom fields: ' + fields.length );
        if (fields.length>0) {
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
                                that._customField = combobox.getRecord().get('name');
                                console.log('customFieldsCobobox listener: ready');
   				//that._loadData(combobox.getRecord().get('name'));
                                that._loadData();
   			},
   			select: function(combobox){
                                that._customField = combobox.getRecord().get('name');
                                console.log('customFieldsCobobox listener: ready');
   				//that._loadData(combobox.getRecord().get('name'));
                                that._loadData();
   			},
   			scope: this
   		}
            });
         this._comboBoxContainer.add(customFieldsCombobox);
        }   
    },
    
    //_loadData:function(customField){
    _loadData:function(){
        console.log('_loadData..._type', this._type);
        console.log('work item:',Ext.getCmp('cb1').getRawValue());  //the raw value has space in "Hierarchical Requirement" or "Test Case", which does not work when used in '_type' variable
        //console.log('custom field:',customField);
        console.log('custom field:',this._customField);
        //var _type = Ext.getCmp('cb1').getRawValue();
        
        /*
        var myStore = Ext.create('Rally.data.WsapiDataStore',{
   		model: type,
   		autoLoad:true,
   		//fetch: true,  //this is by default, bue we can be explicit
   		fetch: [customField, 'Name', 'FormattedID'],
   		filters:[
   			{
   				customField: {$exists: true}
   			}
   		],
   		listeners: {
   			load: function(store,records,success){
   				console.log("loaded %i records", records.length);
   				this._updateGrid(myStore);
   			},
   			scope:this
   		}
   	});*/
        
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
                    //hydrate: ['Blocked','ScheduleState'],
                    //compress: true,
                    listeners: {
                        load: function (snapshotStore, data, success) {
                            console.log(snapshotStore.getCount());
   			    this._updateGrid(snapshotStore, data, success);
                        },
                        scope:this
                    }
                });
    },
     _updateGrid: function(snapshotStore, data){
        if(this._myGrid === undefined){
   		this._createGrid(snapshotStore);
   	}
   	else{
                console.log('_updateGrid, else, snapshotStore', snapshotStore);
                console.log('this._customField in else of _updateGrid()',this._customField);
                //console.log('this._customFieldsStore', this._customFieldsStore);
   		this._myGrid.reconfigure(snapshotStore);
   	}
    },
    _createGrid: function(snapshotStore, data){
        console.log('this._customField in _createGrid()',this._customField);
   	console.log("load grid...", snapshotStore);
   	this._myGrid = Ext.create('Ext.grid.Panel', {
   		title: 'work items with custom field',
   		store: snapshotStore,
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
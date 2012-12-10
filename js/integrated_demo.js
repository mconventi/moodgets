/**
 * Demo file for Moodgets library test: A widgets library built on mootools
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 */
var demo_dataStore = [{id: '1', first_name: 'Franco', group: 'Expert', credit: 2, state:'Activated', birth_date:'23/10/1981'},
			{id: '2', first_name: 'Gennaro', group: 'Intermediate', credit: 1, state:'Activated', birth_date:'03/05/2000'},
			{id: '3', first_name: 'Fabio', group: 'Base', credit: 3, state:'Disactivated', birth_date:'09/12/1979'},
			{id: '4', first_name: 'Franca', group: 'Expert', credit: 12, state:'Disactivated', birth_date:'28/11/1989'},
			{id: '5', first_name: 'Maurizio', group: 'Intermediate', credit: 11, state:'Activated', birth_date:'03/08/1980'},
			{id: '6', first_name: 'Fabio', group: 'Intermediate', credit: 5, state:'Disactivated', birth_date:'09/01/1985'},
			{id: '7', first_name: 'Daniela', group: 'Base', credit: 8, state:'Disactivated', birth_date:'09/10/1978'},
			{id: '8', first_name: 'Valentino', group: 'Intermediate', credit: 9, state:'Activated', birth_date:'10/11/1989'},
			{id: '9', first_name: 'Francesco', group: 'Intermediate', credit: 1, state:'Activated', birth_date:'01/01/1983'},
			{id: '10', first_name: 'Maria', group: 'Intermediate', credit: 0, state:'Disactivated', birth_date:'02/02/1984'}];
			
var demo_columnModel = [{
   header: "ID",
   dataIndex: 'id',
   dataType:'number',
   hidden: true,
   width:50
},{
   header: "Name",
   dataIndex: 'first_name',
   dataType:'string',
   width:105,
   validator: 'required validate-alpha maxLength:30',
   isEditable: true
},{
   header: "Birth date",
	editableFieldType: 'date',
   dataIndex: 'birth_date',
   dataType:'string',
   validator: 'validate-date dateFormat:%d/%m/%Y',
   width:90,
	  isEditable: true
},{
   header: "Group",
   dataIndex: 'group',
	  editableFieldType: 'select',
	  options: ['Base', 'Intermediate', 'Expert'],
   validator: 'required',
	  dataType:'string',
	  defaultValue: 'Base',
   width:85,
	  isEditable: true
},{
   header: "State",
   dataIndex: 'state',
   dataType:'string',
	  editableFieldType: 'checkbox',
	  options: ['Disactivated', 'Activated'],
   validator: 'required',
	  defaultValue: 'Disactivated',
   width:90,
	  isEditable: true
},{
   header: "Credit",
   dataIndex: 'credit',
   editableFieldType: 'string',
   validator: 'required validate-numeric',
   dataType:'number',
   additionalClass: 'rightTextAlign',
   defaultValue: '0.0',
   summarized: true,
   width:70,
   format: function(p_value){
     return ('$ '+p_value+'&nbsp;');
   },
   isEditable: true
}];

window.addEvent('domready', function() {
    initDemo();
});

function initDemo() {		
    
	var g_tabPanel = new TabPanel($('tabPanel'));
	g_tabPanel.addTab('Grid tab', $('grid'));
	g_tabPanel.addTab('Existing tab', $('panel1'));
	g_tabPanel.activate(1);
	
	var g_grid = new Grid($('grid'), {
		dataStore: new DataStore(demo_dataStore),
		columnModel: new ColumnModel(demo_columnModel), 
		gridPlugins: [
			//new EditableGridPlugin({requestOptions:{url: 'your url here'}}),
			new SortableGridPlugin(),
			new ResizableGridPlugin(),
			new SelectableGridPlugin({multipleSelection: false}),
			new ColumnOrderingGridPlugin(),
			new SummaryGridPlugin(),
			new FormattedGridPlugin()
		]
	});
};

/**
 * A grid widget for Moodgets library: A widgets library built on mootools.
 * It is a simple grid which functionalities can be expanded adding the Moodgets Grid Plugins.
 *
 * Generates events:
 * - beforenewheader() Before header creation
 * - newheader() After header bar creation
 * - newheadercell(columnModel, newHeaderCell) After a new header cell creation
 * - beforebodycreation(Grid) Before the body element creation
 * - bodycreation(Grid.bodyElement) After the body element creation
 * - gridready(Grid) When grid structure created
 * - beforeloaddata(Grid.bodyElement) Before data loading
 * - beforerenderdata(Grid.bodyElement) Before records creation
 * - newrow(newRow) After new row created
 * - newcell(columnModel, newCell, cellValue) After new cell created
 * - renderdata(Grid.bodyElement) When data rendered
 * - refreshstructure(Grid) When grid structure must be refreshed
 *
 * @name Grid
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired by Marko Santic http://www.omnisdata.com/omnigrid
 * @license MIT Style License
 * @thanks to Marko Santic
 * @use: 
 *  new Grid($('grid'), {
 *		dataStore: new DataStore(),
 *		columnModel: new ColumnModel(), 
 *		gridPlugins: [
 *			new SortableGridPlugin(),
 *			new ResizableGridPlugin(),
 *			new SelectableGridPlugin({multipleSelection: true})
 *		]
 *	}); 
 */
 
var Grid = new Class({
	Extends: Widget,
	
	showHeader: true,
	headerElement: null,
	headerHeight: 0,
	
	hasPagination: true,	
	hasBottomBar: false,
	bottomBar: null,
	bottomBarHeight: 0,
	
	hasTopBar: false,
	topBar: null,
	topBarHeight: 0,
	
    columnModel: null,
	dataStore: null,
	bodyElement: null,
	bodyHeight: 0,
	rows: null,	
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
    
		this.parent('div', p_parent);
		this.addClass('grid');
		this.setStyle('height', this.getParent().getStyle('height'));
		this.setStyle('width', this.getParent().getStyle('width'));
    	
		this.setOptions(p_options);	    	
		
		if ($chk(this.gridPlugins)&&($type(this.gridPlugins)=='array')){
			for (var i = 0; i < this.gridPlugins.length; i++) {
				if (this.gridPlugins[i].objectType == 'gridPlugin'){
					this.gridPlugins[i].setGrid(this);
				}
			}
		}
		
		if($chk(this.columnModel)){
			this.columnModel.addEvent('modelready', this.createGrid.bind(this));
			this.columnModel.loadModel();
		}		
					
    	if(!$chk(this.dialog)){
    		this.dialog = new DialogBox(this);	//Preload dialog box images
    	}
    },
    /**
     * Creates the grid structure
     */
	createGrid: function(){			
		
		this.empty();		
		this.sumWidth = 0;
		this.visibleColumns = 0; 
			
		if ($chk(this.columnModel)&&$chk(this.columnModel.model)){
			this.fireEvent('beforenewheader');			
			
			//************************* Elements height initialization *****************		
			if ((this.hasTopBar)||$chk(this.topBar))
				this.topBarHeight = 26; // toolbar height 25px + 1px bottom border
			
			if (this.hasBottomBar || this.hasPagination ||$chk(this.bottomBar))
				this.bottomBarHeight = 26; // pagination toolbar height 25px + 1px bottom border
		
			// *********************** Header initialization **************************	
			var l_headerContainer = new Element('div');
			l_headerContainer.addClass('gridHeader');
			l_headerContainer.inject(this);
			
			this.headerElement = new Element('div');
			this.headerElement.inject(l_headerContainer);
			this.headerElement.addClass('gridHeaderBox');
			this.headerElement.setStyle('width', '100%');	
			
			if (!this.showHeader){
				this.headerHeight = 0;
				l_headerContainer.setStyle('display', 'none');
			}else{
				this.headerHeight = 24;
			}				
			this.fireEvent('newheader');	
						
			var l_columnCount = this.columnModel.numOfColumns;
			for (var c = 0; c < l_columnCount; c++) {
				var l_columnModel = this.columnModel.model[c];
				
				var l_headerCell = new Element('div');
				if (!l_columnModel.width){
					this.columnModel.model[c].width = this.columnModel.defaultColumnWidth; 
					l_columnModel.width = this.columnModel.defaultColumnWidth; 
				}
							
				l_headerCell.store('column', c);
				l_headerCell.store('dataType', l_columnModel.dataType);
				l_headerCell.addClass('th');
				l_headerCell.setStyle('width', l_columnModel.width);
				l_headerCell.inject(this.headerElement);
		
				if (l_columnModel.hidden) {
					l_headerCell.setStyle('display', 'none');
				}else{
					this.sumWidth += l_columnModel.width;
					this.visibleColumns++;
				}
				
				var header = l_columnModel.header;
				
				if (l_columnModel.header)
					l_headerCell.set('html', l_columnModel.header);		
					
				this.fireEvent('newheadercell', [l_columnModel, l_headerCell]);
			}
			this.headerElement.setStyle('width', this.sumWidth+this.visibleColumns*2);
		
		}		
		// ************************* Body *****************************************	
		this.fireEvent('beforebodycreation', this);	
		this.bodyElement = new Element('div');
		this.bodyElement.addClass('gridBody');		
		this.bodyElement.setStyle('width', this.getStyle('width'));				
		this.bodyHeight = this.getStyle('height').toInt() - this.headerHeight-this.topBarHeight-this.bottomBarHeight; // -2 border 	
		this.bodyElement.setStyle('height', this.bodyHeight);		
		this.bodyElement.addEvent('scroll', this.onBodyScroll.bind(this));	// x scroll event
		this.bodyElement.inject(this);
		this.fireEvent('bodycreation', this.bodyElement);
		
		// ************************* Pagination Bar ************************************
		if(this.hasPagination){
			this.bottomBar = new Paginator(this);
			this.bottomBar.addEvent('loaddata', this.loadData.bind(this));
		}
		
		this.fireEvent('gridready', this);
		
		if($chk(this.dataStore)){
			this.dataStore.removeEvents();
			this.dataStore.addEvent('dataloaded', this.renderData.bind(this));
			this.dataStore.addEvent('dataloadingfailure', function(p_dataStore){				
		    	if(!$chk(this.dialog)){
		    		this.dialog = new DialogBox(this);
		    	}
		    	this.dialog.error(g_language.RemoteDataStore.loadFailureMsg);
				if ((this.hasPagination)&&$chk(this.bottomBar)){
					this.bottomBar.toggle();
				}
			}.bind(this));
			this.loadData();
		}
	},
	/**
	 * Load the data
	 */
	loadData: function(){
		var l_data = null;
		if ($chk(this.dataStore)&&$chk(this.columnModel)&&$chk(this.columnModel.model)){
			this.fireEvent('beforeloaddata', this.bodyElement);
			var l_page = 1;
			var l_pageSize = null;
			if ((this.hasPagination)&&$chk(this.bottomBar)){
				this.bottomBar.toggle();
				l_page = this.bottomBar.page;
				l_pageSize = this.bottomBar.pageSize;
			}
			if ($chk(this.topBar)){
				this.topBar.toggleClass('disabled');
			}
			this.dataStore.loadData({page: l_page, pageSize: l_pageSize});
		}
	},
	/**
	 * Handles the data rendering building the grid records
	 */
	renderData: function(){			
		this.fireEvent('beforerenderdata', this.bodyElement);

		if ($chk(this.dataStore) && ($chk(this.dataStore.data))) {	
			//Obtain or build the tree into the grid body element
			var l_bodyTreeElement = this.bodyElement.getElement('ul');			
			if (l_bodyTreeElement){
				l_bodyTreeElement.empty();
			}else{
				l_bodyTreeElement = new Element('ul');
				l_bodyTreeElement.addClass('gridBodyTree');				
				l_bodyTreeElement.inject(this.bodyElement);
			}
			l_bodyTreeElement.setStyle('width', this.sumWidth+2*this.visibleColumns); // + 2*this.visibleColumns to consider the cells width 
			
			var l_columnCount = this.columnModel.numOfColumns;
			var l_rowCount = this.dataStore.data.length;
			
			for (var r=0; r<l_rowCount; r++) {
				var l_row = new Element('li');
				l_row.setStyle('width', this.sumWidth+2*this.visibleColumns);	// + 2*this.visibleColumns to consider the cells width

				l_row.inject(l_bodyTreeElement);
				this.fireEvent('newrow', l_row);	
							
				for (var c=0; c<l_columnCount; c++) {
					var l_columnModel = this.columnModel.model[c];
					
					var l_group = new Group(l_row);	//A group div is used to allow to add elements into the cell						
					l_group.setStyle('width', l_columnModel.width);
					
					var l_cell = new Element('div');
					l_cell.addClass('td');
					l_cell.setStyle('width', '100%'); 
					l_cell.inject(l_group);					
					if (l_columnModel.hidden) {
						l_group.addClass('hidden');
					}										
					if ($chk(l_columnModel.additionalClass)){
						l_cell.addClass(l_columnModel.additionalClass);
					}
					var l_cellValue = this.dataStore.data[r][l_columnModel.dataIndex];	
					if 	($chk(l_cellValue)&&($type(l_cellValue)=='string')){
						l_cellValue = l_cellValue.trim();
					}					
					if ((l_cellValue == null )||(l_cellValue.length==0)){
						l_cellValue = '&nbsp;';		
					}				
					l_cell.set('html', l_cellValue);
					l_cell.store('value', l_cellValue);
					this.fireEvent('newcell', [l_columnModel, l_cell, l_cellValue]);	
					
				} // for column			
			} // for row
		}
		
		this.rows = l_bodyTreeElement.getElements('li');
		
		this.fireEvent('renderdata', this.bodyElement);
		
		if ((this.hasPagination)&&$chk(this.bottomBar)){
			this.bottomBar.toggle();
			this.bottomBar.refresh(this.dataStore.total);
		}
		if ($chk(this.topBar)){
			this.topBar.toggleClass('disabled');
		}
		
		//Forces the browser to render the element to fix a IE scroll problem
		if ((Browser.Engine.trident)&&(l_bodyTreeElement.getStyle('height').toInt()>this.bodyHeight)){			
			this.bodyElement.toggleClass('hidden');
			this.bodyElement.toggleClass('hidden');
		}
	},
	/**
	 * Fires the event refreshstructure
	 */
	refreshStructure: function(){		
		this.fireEvent('refreshstructure', this);
	},
	/**
	 * Handles the body scroll event
	 * @private
	 */
	onBodyScroll: function(){		
		var xs = this.bodyElement.getScroll().x;
		
		this.headerElement.setStyle('left', -xs);
	}
});
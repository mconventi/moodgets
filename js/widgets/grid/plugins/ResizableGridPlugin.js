/**
 * A plugin useful to build a grid with resizable columns. 
 * Moodgets library: A widgets library built on mootools.
 *
 * Generates events:
 * - columnresize(p_columnElement, p_oldWidth, p_newWidth) When a column is resized
 * - cellresize(p_cellElement, p_oldWidth, p_newWidth) When a cell is resized
 *
 * In order to avoid the resizable effect on a row, the row must have the 'no-resizable' class
 *
 * @name ResizableGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired and based on Marko Santic http://www.omnisdata.com/omnigrid
 * @license MIT Style License
 * @thanks to Marko Santic
 * @use: create an ResizableGridPlugin object passing the grid as parameter.
 */
var ResizableGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'ResizableGridPlugin',
	widthOffset: 0,
	minWidth: 30,
	headerCellsTotal: 0,
	dragToolElements: new Array(),	
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			renderdata: this.onRenderDataHandler.bind(this),
			newheader: this.onNewHeaderHandler.bind(this),
			bodycreation: this.onBodyCreationHandler.bind(this),
			newheadercell: this.onNewHeaderCellHandler.bind(this),
			refreshstructure: this.moveHeader.bind(this)
		}
	},
    /**
     * @private
     */
    onNewHeaderHandler: function(){    	
		this.widthOffset = 0;
		this.headerCellsTotal = 0;
		this.dragToolElements.empty();
    	this.draggerHeader = new Element('div');
		this.draggerHeader.addClass('columnDrag');
		this.draggerHeader.setStyle('top', this.grid.topBarHeight);
		this.draggerHeader.inject(this.grid);
    },
    /**
     * @private
     */
    onNewHeaderCellHandler: function(p_columnModel, p_headerCell){		
				
		var l_dragTool = new Element('div');
				
		l_dragTool.setStyles({top: 1, left: this.widthOffset+p_columnModel.width, height: this.grid.headerHeight, display:'block'});
		//l_dragTool.store('columnIndex', this.headerCellsTotal);
		l_dragTool.inject(this.draggerHeader);
		
		// Events
		l_dragTool.addEvent('mouseout', this.outDragColumn.bind(this));
		l_dragTool.addEvent('mouseover', this.overDragColumn.bind(this));
		
		var l_dragMove = new Drag(l_dragTool, {snap:0}); 
		l_dragMove.addEvent('drag', this.onColumnDragging.bind(this) );
		l_dragMove.addEvent('start', this.onColumnDragStart.bind(this) );
		l_dragMove.addEvent('complete', this.onColumnDragComplete.bind(this) );
		
		if (p_columnModel.hidden) 
			l_dragTool.setStyle('display', 'none');
		else
			this.widthOffset += p_columnModel.width + 2; // +2 column border
		
		this.dragToolElements[this.headerCellsTotal]	= l_dragTool;
		this.headerCellsTotal++;
    },
    /**
     * @private
     */
    onBodyCreationHandler: function(p_bodyElement){
    	p_bodyElement.addEvent('scroll', this.moveHeader.bind(this));	
    },
    /**
     * @private
     */
    moveHeader: function(){			
		this.widthOffset = 0;
		
		var l_scrollerX = this.grid.bodyElement.getScroll().x;
		
		for (var i = 0; i < this.grid.columnModel.numOfColumns; i++) {
			var l_columnModel = this.grid.columnModel.model[i];
			
			var l_dragTool = this.dragToolElements[i];
		
			l_dragTool.setStyle('left', this.widthOffset+l_columnModel.width -l_scrollerX);
			
			if (!l_columnModel.hidden)
				this.widthOffset += l_columnModel.width + 2; // +2 column border;
		}		
		
	},
    /**
     * @private
     */
	onColumnDragComplete: function(p_target){
		this.widthOffset = 0;
		this.grid.dragging = false;
		
		var l_colIndex = this.dragToolElements.indexOf(p_target); //.retrieve('columnIndex');
		
		var l_dragTool = p_target; //this.dragToolElements[l_colIndex];
		var l_scrollerX = this.grid.bodyElement.getScroll().x;
		
		//Update the sum width attribute of grid
		this.grid.sumWidth = 0;
		for (var i = 0; i < this.grid.columnModel.numOfColumns; i++) {
			var l_columnModel = this.grid.columnModel.model[i];
			
			if (i == l_colIndex)
				var l_position = l_dragTool.getStyle('left').toInt()+l_scrollerX-this.grid.sumWidth; 
			else if (!l_columnModel.hidden)			
				this.grid.sumWidth += l_columnModel.width;
		}
		
		if (l_position < this.minWidth) // minimal width check
			l_position = 30;
		
		this.grid.columnModel.model[l_colIndex].width = l_position;
		
		this.grid.sumWidth += l_position;
		
		var l_newRowWidth = this.grid.sumWidth+2*this.grid.visibleColumns; // + 2*this.visibleColumns to consider the cells width
		this.grid.bodyElement.getElement('ul.gridBodyTree').setStyle('width', l_newRowWidth);
		this.grid.headerElement.setStyle('width', l_newRowWidth);
		
		// Column Resize 		
		var l_newCellWidth = l_position;
		var columns = this.grid.headerElement.getElements('div.th');
		var columnObj = columns[l_colIndex];
		var l_oldCellWidth = columnObj.getStyle('width').toInt();
		columnObj.setStyle('width', l_newCellWidth);		
		columnObj.fireEvent('columnresize', [columnObj, l_oldCellWidth, l_newCellWidth]);
		
		// Cells resize
		if ($chk(this.grid.rows)){
			this.grid.rows.each(function(el, i){
				if (!el.hasClass('no-resizable')){
					el.setStyle('width', l_newRowWidth); // + 2*this.visibleColumns to consider the cells width
					var l_cells = el.getElements('div.group');
					var l_cellObj = l_cells[l_colIndex];
					l_cellObj.setStyle('width', l_newCellWidth);
					l_cellObj.fireEvent('cellresize', [l_cellObj, l_oldCellWidth, l_newCellWidth]);
				}
			}.bind(this));
		}
		
		this.moveHeader();	
	},
    /**
     * @private
     */
	onColumnDragStart: function(p_target){
		this.grid.dragging = true;
	},
    /**
     * @private
     */
	onColumnDragging: function(p_target){
		p_target.setStyle('top', 1);
	},
    /**
     * @private
     */
	overDragColumn: function(p_evt){
		p_evt.target.addClass('dragging');
	},
    /**
     * @private
     */
	outDragColumn: function(p_evt){
		p_evt.target.removeClass('dragging');
	},
    /**
     * @private
     */
    onRenderDataHandler: function(){    
		this.grid.dragging = false;
    }
});
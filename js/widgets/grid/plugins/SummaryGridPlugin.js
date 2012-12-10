/**
 * Create a last "total" record for numeric columns. 
 * Moodgets library: A widgets library built on mootools.
 *
 * In order to avoid to use the row for the summary, the row must have the 'no-summarizable' class
 *
 * @name SummaryGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a SummaryGridPlugin object passing the grid as parameter.
 */
var SummaryGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'SummaryGridPlugin',
	summaryRow: null,
	summarizedColumns: null,		
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			renderdata: this.onRenderDataHandler.bind(this),
			newrow: this.onNewRowHandler.bind(this),
			newcell: this.onNewCellHandler.bind(this),
			beforerenderdata: this.onBeforeRenderDataHandler.bind(this)
		};
	},
    /**
     * @private
     */
    onBeforeRenderDataHandler: function(){    
    	this.summarizedColumns = new Array();
		this.cellIndex = 0;
    },
    /**
     * @private
     */
    onNewRowHandler: function(){    	
		this.cellIndex = 0;			
    },
    /**
     * @private
     */
    onNewCellHandler: function(p_columnModel, p_newCell, p_cellValue){  
    	if (p_columnModel.summarized&&p_newCell.getParent().getParent()!=this.summaryRow){
    		if (!$chk(this.summarizedColumns[this.cellIndex])){
    			this.summarizedColumns[this.cellIndex] = 0.0;
    		}
    		if ($type(p_cellValue)=='string')
    			p_cellValue = p_cellValue.toFloat();
    		if($type(p_cellValue)=='number')
				this.summarizedColumns[this.cellIndex] += p_cellValue;
				
			p_newCell.getParent().addEvent('edited', this.onEditedCellHandler.bind(this));
		}else{
			this.summarizedColumns[this.cellIndex] = '&nbsp;';
		}	
		this.cellIndex++;
    },
    /**
     * @private
     */
    onEditedCellHandler: function(p_groupNode, p_previousValue, p_inputValue){  
	   	var l_groupIndex = p_groupNode.getAllPrevious().length;
		this.summarizedColumns[l_groupIndex] = 0;
   		if ($chk(this.grid.rows)){
			this.grid.rows.each(function(el, i){
				if (!el.hasClass('no-summarizable')){
					var l_cells = el.getElements('div.td');
					var l_cellObj = l_cells[l_groupIndex];
					var l_cellValue = l_cellObj.retrieve('value');
   					if ($type(l_cellValue)=='string') l_cellValue = l_cellValue.toFloat();
    				if($type(l_cellValue)=='number')
						this.summarizedColumns[l_groupIndex] += l_cellValue;
				}
			}.bind(this));
		}
   		var l_summaryCell = this.summaryRow.getElements('.td')[l_groupIndex];
   		l_summaryCell.set('html', this.summarizedColumns[l_groupIndex]);
		l_summaryCell.store('value', this.summarizedColumns[l_groupIndex]);
		var l_groupNode = l_summaryCell.getParent();
		l_groupNode.fireEvent('edited', [l_groupNode, this.summarizedColumns[l_groupIndex]]);
    },
    /**
     * @private
     */
    onRenderDataHandler: function(p_bodyElement){  
		this.summaryRow = new Element('li'); 
		this.summaryRow.addClass('gridSummaryRow');	
		//this.summaryRow.addClass('no-sortable no-selectable no-summarizable no-editable');
		this.summaryRow.addClass('no-sortable no-selectable no-summarizable no-editable');	
		this.summaryRow.setStyle('width', this.grid.sumWidth+2*this.grid.visibleColumns);	// + 2*this.visibleColumns to consider the cells width		
		this.summaryRow.inject(p_bodyElement.getElement('ul.gridBodyTree'));
		this.grid.fireEvent('newrow', this.summaryRow);	
		
		var l_columnCount = this.grid.columnModel.numOfColumns;
		for (var c=0; c<l_columnCount; c++) {
			var l_columnModel = this.grid.columnModel.model[c];
			var l_group = new Group(this.summaryRow);
			var l_cell = new Element('div');
			l_cell.addClass('td');									
			if 	($chk(l_columnModel.additionalClass)){
				l_cell.addClass(l_columnModel.additionalClass);
			}
			l_group.setStyle('width', l_columnModel.width); 
			l_cell.setStyle('width', '100%'); 
			l_cell.inject(l_group);					
			if (l_columnModel.hidden) l_group.setStyle('display', 'none');
			if (!$chk(this.summarizedColumns[c])){
				if (l_columnModel.summarized){
					if ($chk(l_columnModel.defaultValue)){
						this.summarizedColumns[c] = l_columnModel.defaultValue;
					}else{
						this.summarizedColumns[c] = '0';
					}
				}else{
					this.summarizedColumns[c] = '&nbsp;';
				}
			}
    		l_cell.set('html', this.summarizedColumns[c]);    		
			l_cell.store('value', this.summarizedColumns[c]);
			
			this.grid.fireEvent('newcell', [l_columnModel, l_cell, this.summarizedColumns[c]]);	
		} // for column
		
		this.grid.rows.include(this.summaryRow);
    }
});
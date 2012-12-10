/**
 * A plugin useful to build a grid that allows columns ordering. 
 * Moodgets library: A widgets library built on mootools.
 *
 * In order to avoid the orderable effect on a row, the row must have the 'no-orderable' class
 *
 * @name ColumnOrderingGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: create an ColumnOrderingGridPlugin object passing the grid as parameter.
 */
var ColumnOrderingGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'ColumnOrderingGridPlugin',
	sortables: null,		
	draggedIndex: null,		
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			newheader: this.onNewHeaderHandler.bind(this),
			newheadercell: this.onNewHeaderCellHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onNewHeaderHandler: function(p_columnModel, p_headerCell){				
		this.sortables = new Sortables([], {
			/* set options */
			clone:true,
			revert: true,
			/* initialization stuff here */
			//initialize: function() { },
			/* once an item is selected */
			onStart: this.onColumnDragStart.bind(this),
			/* when a drag is complete */
			onComplete: this.onColumnDragComplete.bind(this)
		});
    },
    /**
     * @private
     */
    onNewHeaderCellHandler: function(p_columnModel, p_headerCell){	
    		if ($chk(this.sortables))			
			this.sortables.addItems(p_headerCell);
    },
    /**
     * @private
     */
	onColumnDragComplete: function(p_target){
		this.grid.dragging = false;	
		p_target.removeClass('orderingColumn');
		
		var l_newColumnIndex = null;		
		var l_columns = this.grid.headerElement.getElements('div.th');
		var l_columnsSize = l_columns.length;
		
		//Store new columns index
		for (var i = 0; i < l_columnsSize; i++){
			var l_oldColumnIndex = l_columns[i].retrieve('column').toInt();
			
			if (l_oldColumnIndex == this.draggedIndex)
				l_newColumnIndex = i;
				
			l_columns[i].store('column', i);
		}
		if ($chk(this.grid.rows)&&$chk(this.draggedIndex)&&$chk(l_newColumnIndex)&&(l_newColumnIndex!=this.draggedIndex)){
		
			var l_draggedHeader = this.grid.columnModel.model.splice(this.draggedIndex, 1);
			this.grid.columnModel.model.splice(l_newColumnIndex, 0, l_draggedHeader[0]);
		
			this.grid.rows.each(function(el, i){
				if (!el.hasClass('no-orderable')){
					var l_cells = el.getElements('div.group');
					var l_where = 'before';
					if (this.draggedIndex < l_newColumnIndex)
						l_where = 'after';
					l_cells[this.draggedIndex].inject(l_cells[l_newColumnIndex], l_where);
				}
			}.bind(this));
		}
		
		this.grid.fireEvent('refreshstructure', this.grid);
		this.draggedIndex = null;
	},
    /**
     * @private
     */
	onColumnDragStart: function(p_target){
		this.grid.dragging = true;
		p_target.addClass('orderingColumn');
		this.draggedIndex = p_target.retrieve('column');
	}
});
/**
 * A plugin useful to build a grid that allows to select rows. 
 * Moodgets library: A widgets library built on mootools.
 *
 * In order to avoid the selectable effect on a row, the row must have the 'no-selectable' class
 *
 * @name SelectableGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired and based on Marko Santic http://www.omnisdata.com/omnigrid
 * @license MIT Style License
 * @thanks to Marko Santic
 * @use: create a SelectableGridPlugin object passing the grid as parameter.
 */
var SelectableGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'SelectableGridPlugin',
	rowIndex: 0,
	alternateRows: true,
	multipleSelection: false,
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			beforerenderdata: this.onBeforeRenderDataHandler.bind(this),
			newrow: this.onNewRowHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onPluginInitHandler: function(){    	
    	this.grid.alternateRow = this.alternateRow;
    },
    /**
     * @private
     */
    onNewRowHandler: function(p_row){
    	if(this.rowIndex % 2){
			p_row.removeClass('erow');
		}else{
			p_row.addClass('erow');
		}
		
		p_row.addEvent('click', this.onRowClick.bind(this));
		p_row.addEvent('mouseover', this.onRowMouseOver.bind(this) );
		p_row.addEvent('mouseout',  this.onRowMouseOut.bind(this) );	
		
		this.rowIndex++;
    },
    /**
     * @private
     */
    onBeforeRenderDataHandler: function(){  
		this.rowIndex = 0;
		this.grid.selected = new Array();
    },
    /**
     * @private
     */
    onRowMouseOver: function (evt){
		var li = evt.target.getParent().getParent();
		
		if (!this.grid.dragging)
			li.addClass('over');
	},	
    /**
     * @private
     */
	onRowMouseOut: function (evt){
		var li = evt.target.getParent().getParent();
		
		if (!this.grid.dragging)
			li.removeClass('over');
	},	
    /**
     * @private
     */
	onRowClick: function (evt){
		var li = evt.target.getParent().getParent();
		
		if (!li.hasClass('no-selectable')) {
			if ( !this.multipleSelection && this.grid.rows){
				this.grid.rows.each(function(el, i){ if (li!=el) el.removeClass('selected'); }, this);
			}
			li.toggleClass('selected');
		}
	},
    /**
     * @private
     */
	alternateRow: function(){
		this.rows.each(function(el,i){
			if(i % 2){
				el.removeClass('erow');
			}else{
				el.addClass('erow');
			}
		});
	}
});
/**
 * A plugin useful to build a locally sortable grid. 
 * Moodgets library: A widgets library built on mootools.
 *
 * Data type: number, string, date
 *
 * In order to avoid the sort effect on a row, the row must have the 'no-sortable' class
 *
 * @name ResizableGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired and based on Marko Santic http://www.omnisdata.com/omnigrid
 * @license MIT Style License
 * @thanks to Marko Santic
 * @use: create a SortableGridPlugin object passing the grid as parameter.
 */
var SortableGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'SortableGridPlugin',
	headerCellsTotal: 0,
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			newheader: this.onNewHeaderHandler.bind(this),
			newheadercell: this.onNewHeaderCellHandler.bind(this)
		};
	},
    /**
     * @private
     */
    onNewHeaderHandler: function(){
    	this.headerCellsTotal = 0;
    },
    /**
     * @private
     */
    onNewHeaderCellHandler: function(p_columnModel, p_headerCell){
    
    	 // Function used to compare two date elements
  		 p_headerCell.getdate = function(p_str){
			// inner util function to convert 2-digit years to 4
			function fixYear(yr) {
				yr = +yr;
				if (yr<50) { yr += 2000; }
				else if (yr<100) { yr += 1900; }
				return yr;
			};
			var ret;
			//
			if (p_str.length>12){
				strtime = p_str.substring(p_str.lastIndexOf(' ')+1);
				strtime = strtime.substring(0,2)+strtime.substr(-2);
			}else{
				strtime = '0000';
			}
			//
			// YYYY-MM-DD
			if (ret=p_str.match(/(\d{2,4})-(\d{1,2})-(\d{1,2})/)) {
				return (fixYear(ret[1])*10000) + (ret[2]*100) + (+ret[3]) + strtime;
			}
			// DD/MM/YY[YY] or DD-MM-YY[YY]
			if (ret=p_str.match(/(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})/)) {
				return (fixYear(ret[3])*10000) + (ret[2]*100) + (+ret[1]) + strtime;
			}
			return 999999990000; // So non-parsed dates will be last, not first
		};
		//var l_columnIndex = p_headerCell.retrieve('column');//this.headerCellsTotal;		
		
		// Function that compares two elements of the same column but with different rows
		p_headerCell.compare = function(a, b){ // a & b on LI elements		
			
			if (a.hasClass('no-sortable')){
				return 1;
			}
			if (b.hasClass('no-sortable')){
				return -1;
			}
			var l_columnIndex = p_headerCell.retrieve('column');
			var var1 = a.getElements('.td')[l_columnIndex].retrieve('value').trim();
			var var2 = b.getElements('.td')[l_columnIndex].retrieve('value').trim();
			
			if(p_columnModel.dataType == 'number'){
				var1 = parseFloat(var1);
				var2 = parseFloat(var2);
				
				if(p_headerCell.sortBy == 'ASC'){
					return (var1-var2);
				}else{
					return (var2-var1);
				}
				
			}else if(p_columnModel.dataType == 'string'){
				var1 = var1.toUpperCase();
				var2 = var2.toUpperCase();
				
				if(var1==var2){return 0;}
				if(p_headerCell.sortBy == 'ASC'){
					if(var1<var2){return -1;}
				}else{
					if(var1>var2){return -1;}
				}
				return 1;
				
			}else if(p_columnModel.dataType == 'date'){
				var1 = parseFloat(p_headerCell.getdate(var1));
				var2 = parseFloat(p_headerCell.getdate(var2));
				
				if(p_headerCell.sortBy == 'ASC'){
					return (var1-var2);
				}else{
					return (var2-var1);
				}
				
			}			
		};
		
		if (!$chk(p_columnModel.sort)){
			p_columnModel.sort = 'ASC';
		} 
			
		p_headerCell.store('sort', p_columnModel.sort);
		
		p_headerCell.addEvent('click', this.onHeaderClickHandler.bind(this));
		p_headerCell.addEvent('mouseout', this.onHeaderOutHandler.bind(this));
		p_headerCell.addEvent('mouseover', this.onHeaderOverHandler.bind(this));
		
		this.headerCellsTotal++;
    },
    /**
     * @private
     */
    onHeaderClickHandler: function(p_evt){
		if (this.grid.dragging) return null;
		
		var l_sort = p_evt.target.retrieve('sort');
		
		p_evt.target.removeClass(l_sort);
		l_sort = (l_sort == 'ASC') ? 'DESC' : 'ASC';
		p_evt.target.addClass(l_sort);
		p_evt.target.store('sort', l_sort);

		this.sort(p_evt.target);
	},	
    /**
     * @private
     */
	onHeaderOverHandler: function(p_evt){
		if (this.grid.dragging) return null;
		
		var l_sort = p_evt.target.retrieve('sort');

		p_evt.target.addClass(l_sort);
	},	
    /**
     * @private
     */
	onHeaderOutHandler: function(p_evt){		
		var l_sort = p_evt.target.retrieve('sort');
		
		p_evt.target.removeClass(l_sort);
	},
    /**
     * @private
     */
	sort: function(p_headerCell, index){
		if(!$chk(this.grid.rows))
			return null;
		
		var l_bodyTreeElement = this.grid.bodyElement.getElement('ul.gridBodyTree');
		
		if(p_headerCell.hasClass('ASC')){
			p_headerCell.sortBy = 'ASC';
		}else if(p_headerCell.hasClass('DESC')){
			p_headerCell.sortBy = 'DESC';
		}
		
		// Sorting...
		if($chk(p_headerCell.compare))
			this.grid.rows.sort(p_headerCell.compare);
		this.grid.rows.injectInside(l_bodyTreeElement);
		
		// Update selection array because indices has been changed
		this.grid.selected = new Array();
		this.grid.rows.each(function(p_headerCell ,i){
			if(p_headerCell.hasClass('selected')){
				this.grid.selected.push(p_headerCell.retrieve('row'));
			}
		}, this);
		
		// Alternate rows
		if (this.grid.alternateRow){
				this.grid.alternateRow();
		}
	}
});
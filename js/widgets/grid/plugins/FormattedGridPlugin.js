/**
 * A plugin useful to add a format to grid data. 
 * Moodgets library: A widgets library built on mootools.
 *
 * @name SelectableGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a FormattedGridPlugin object passing the grid as parameter. The data model must have
 * a function named format that receives the value as parameter and returns the formatted data as string.
 */
var FormattedGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'FormattedGridPlugin',
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			newcell: this.onNewCellHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onNewCellHandler: function(p_columnModel, p_cell, p_cellValue){
		//Replace data with formatted data
		if ($chk(p_columnModel.format)&&($type(p_columnModel.format)=='function')){
			p_cellValue = p_columnModel.format(p_cellValue);
			p_cell.set('html', p_cellValue);
			
			p_cell.getParent().addEvent('edited', function(p_group, p_newValue){
				p_newValue = p_columnModel.format(p_newValue);
				p_cell.set('html', p_newValue);
			});
		}	
    }
});
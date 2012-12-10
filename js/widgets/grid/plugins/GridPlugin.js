/**
 * A base object to build a grid plugin. 
 * Moodgets library: A widgets library built on mootools.
 * This class:
 *  - sets the object type,
 *  - initializes the grid object,
 *  - initializes the object options.
 *
 * @name GridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: a grid plugin must extend this class.
 */
var GridPlugin = new Class({
	id: null,
	grid: null,
	objectType: null,	
	
	/**
	 * Creates the element and sets the object options
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_options){       		
   		this.objectType = 'gridPlugin';
    
    	if ($chk(p_options))
    		this.setOptions(p_options);
    		
   		this.addGridEvents();
    },
    /**
     * Sets the grid plugin options
     */
    setOptions: function(p_options){
    	for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		};
    },
    /**
     * Sets the grid events interesting for the plugin
     * Uses the function getGridEvents that must be implemented by the plugin.
     */
    addGridEvents: function(){    	
    	if ($chk(this.grid)){
    		this.gridEvents = this.getGridEvents();
	    	for (var l_obj in this.gridEvents) {
				this.grid.addEvent(l_obj, this.gridEvents[l_obj]);
			}
			this.onPluginInitHandler();
		}
    },
    /**
     * Sets the related grid
     */
    setGrid: function(p_grid){    	
    	if ($chk(p_grid)){
    		this.grid = p_grid;
    		this.addGridEvents();
		}
    },    
    /**
     * It is called after grid plugin creation. It can be implemented by the grid plugin.
     */
    onPluginInitHandler: function(){}
});
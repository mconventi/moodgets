/**
 * A simple column model for Moodgets library: A widgets library built on mootools.
 * Used to define a grid columns structure.
 *
 * @name ColumnModel
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 */
var ColumnModel = new Class({
	Extends: Events,
	
	defaultColumnWidth: 100,
	model: null,
	numOfColumns: null,
	/**
	 * Creates the element with static data
	 * @param p_model The static column model
	 * @constructor
	 */
    initialize: function(p_model){
    	this.model = p_model;
    },
    /**
     * Simulates to load the column model. It return the same static data each time.
     */
    loadModel: function(){
    	this.numOfColumns = this.model.length;
    	this.fireEvent('modelready', this);
    }
});
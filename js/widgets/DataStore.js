/**
 * A simple local data store for Moodgets library: A widgets library built on mootools.
 *
 * Generates events:
 * - dataloaded When data is loaded (remember that is a simulation of data loading
 *
 * @name DataStore
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var DataStore = new Class({
	Extends: Events,
	
	data: [],			
	total: null,
	
	/**
	 * Creates the element with static data
	 * @param p_data The static data
	 * @constructor
	 */
    initialize: function(p_data){
    	this.data = p_data;
    	this.total = this.data.length;
    },
    /**
     * Simulates to load the data. It return the same static data each time.
     */
    loadData: function(){
   		this.fireEvent('dataloaded', this);
    }
});
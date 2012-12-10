/**
 * A simple div used to groups more elements. 
 * Moodgets library: A widgets library built on mootools.
 *
 * @name Group
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Group = new Class({
	Extends: Widget,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
		this.parent('div', p_parent, p_options);
    	this.addClass('group');		
    }
});
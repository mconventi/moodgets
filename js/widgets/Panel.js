/**
 * A simple container element for Moodgets library: A widgets library built on mootools.
 *
 * @name Panel
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Panel = new Class({
	Extends: Widget,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){		
		this.parent('div', p_parent, p_options);
	}
});
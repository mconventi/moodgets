/**
 * A Buttons Separator element for Moodgets library: A widgets library built on mootools.
 *
 * @name ButtonsSeparator
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var ButtonsSeparator = new Class({
	Extends: Widget,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
		this.parent(p_parent, p_options);
		this.addClass('btnSeparator');		
    }
});
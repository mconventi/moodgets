/**
 * A toolbar for Moodgets library: A widgets library built on mootools.
 *
 * @name Toolbar
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Toolbar = new Class({
	Extends: Widget,
	container: null,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){

    	this.container = new Panel(p_parent);
		this.container.addClass('toolbar');
								
		this.parent('div', this.container, p_options);
		this.addClass('panel');
    }
});
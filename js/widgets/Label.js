/**
 * A Simple label element for Moodgets library: A widgets library built on mootools.
 *
 * @name Input
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Label = new Class({
	Extends: Widget,
	
	text: '',
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
		this.parent('span', p_parent, p_options);
    },
    /**
     * Sets the label text
     * @param p_text A string containing the text
     */
    setText: function(p_text){
    	this.text = p_text;
    	if(this.text){
			this.set('text', this.text);
    	}
    }
});
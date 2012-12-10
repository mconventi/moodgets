/**
 * A Button element for Moodgets library: A widgets library built on mootools.
 *
 * @name Button
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Button = new Class({
	Extends: Widget,
	
	label: '',
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){		
		this.parent('div', p_parent, p_options);
		this.addClass('button');
		
		this.addEvent('mouseout', this.onMouseOutHandler.bind(this));
		this.addEvent('mouseover', this.onMouseOverHandler.bind(this));
    },
    /**
     * Sets the button label
     * @param p_label A string representing the button label
     */
    setLabel: function(p_label){
    	this.label = p_label;
    	if(this.label){
			this.set('text', this.label);
    	}
    },	
    /**
     * @private
     */
	onMouseOverHandler: function(p_evt){
		if (!p_evt.target.hasClass('disabled')){
			p_evt.target.setStyle('width',p_evt.target.getStyle('width').toInt() - 2);
			p_evt.target.setStyle('height',p_evt.target.getStyle('height').toInt() - 2);
			p_evt.target.setStyle('border-width', '1px');
			p_evt.target.addClass('buttonHover');
		}
	},	
    /**
     * @private
     */
	onMouseOutHandler: function(p_evt){
		if (!p_evt.target.hasClass('disabled')||(p_evt.target.getStyle('border-width').toInt() > 0)){
			p_evt.target.setStyle('width',p_evt.target.getStyle('width').toInt() + 2);
			p_evt.target.setStyle('height',p_evt.target.getStyle('height').toInt() + 2);
			p_evt.target.setStyle('border-width', '0px');
			p_evt.target.removeClass('buttonHover');
		}
	}
});
/**
 * A Date input element for Moodgets library: A widgets library built on mootools.
 *
 * @name DateInput
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
 
var DateInput = new Class({
	Extends: Widget,
	
	calendar: null,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
        		
		this.parent('input', p_parent, p_options);
		this.addClass('DatePicker');
		
		var calObj = new Object();
			
		if($chk(p_options)){			
			if($chk(p_options.value)){
				this.set('value', p_options.value);
				calObj['value'] = p_options.value;
			}
		}		
		this.calendar = this.element.DatePicker(calObj);
		
		
		this.element.addEvent('enterkey', this.calendar.remove.bind(this.calendar));
		this.element.addEvent('removeCalendar', this.calendar.remove.bind(this.calendar));
    }
});
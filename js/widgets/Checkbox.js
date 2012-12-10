/**
 * A Checkbox element for Moodgets library: A widgets library built on mootools.
 *
 * Generates events:
 * - check(Checkbox) Fired when the checkbox is checked\unchecked. 
 *
 * @name Checkbox
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Checkbox = new Class({
	Extends: Input,
	options: null,
	checked: false,
	defaultValue: 'false',
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
		if (!p_options)
			p_options = new Object();
    	p_options['type'] = 'checkbox';
		this.parent(p_parent, p_options);
		for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		}
		this.addEvent('change', this.onCheckHandler.bind(this));
    	this.set('checked', this.checked); 
    	this.set('value', this.defaultValue);
		this.addClass('checkbox');
    	this.options = new Array('false', 'true');
    },
    /**
     * Sets the default value for the checkbox.
     * @param p_defaultValue A string representing the default value.
     * @see setOptions
     */
    setDefaultValue: function(p_defaultValue){
    	if((p_defaultValue!=null)&&(p_defaultValue.length > 0)){
    		this.defaultValue = p_defaultValue.toString();
	    	this.handleValue(this.defaultValue);
   			this.set('value', this.defaultValue);
    	}else{
    		this.set('value', this.options[0]);
    	}
    },
    /**
     * Retrieve the default value
     */
    getDefaultValue: function(){
    	return this.defaultValue;
    },
    /**
     * Handles the checkbox value respect the checkbox options
     * @private
     */
    handleValue: function(p_value){       
		l_valueIndex = this.options.indexOf(p_value);  
				
   		if(l_valueIndex <= 0){		
   			this.setChecked(false);
   		}else{
   			this.setChecked(true);
   		}
    },
    /**
     * Sets the possible options related to the checkbox. 
     * This function allows to set two possible string related to the checked or unchecked state.
     * @param p_options It must be an array containing the string related to unchecked and checked states related to the first and second array position
	 */
	setOptions: function(p_options){
		if($chk(p_options)&&(p_options.length == 2)){
	    	this.options = p_options;
    	}
    },	
    /**
     * Sets the checked state
     * @param p_isChecked Boolean value rapresenting if the checkbox is checked or not
     */
	setChecked: function(p_isChecked){
    	this.checked = p_isChecked;
    	if(this.checked){		
   			this.set('value', this.options[1]);
   		}else{
   			this.set('value', this.options[0]);
   		}
    	this.set('checked', this.checked); 
    },	
    /**
     * Retrieve true if checked else false
     */
	isChecked: function(){
    	return this.checked;
    },	
    /**
     * @private
     */
    onCheckHandler: function(evt){
    	this.setChecked(this.get('checked'));
		this.fireEvent('check', this);
    }
});
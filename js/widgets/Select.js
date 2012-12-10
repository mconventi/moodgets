/**
 * A Select element for Moodgets library: A widgets library built on mootools.
 *
 * @name Select
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Select = new Class({
	Extends: Widget,
	
	options: null,
	html:'',
	defaultValue:'',
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){    	
		this.parent('select', p_parent, p_options);
    },
    /**
     * Sets the possible options related to the select. It render data after the options definition.
     * @param p_options It must be an array. The can contain a list of string or a list of objects {value: "value", display: "value", selected: true(false)}  
	 */
    setOptions: function(p_options){
    	this.options = p_options;
    	
    	this.renderData();
    },
    /** 
     * Sets the default value. It must be called before the select rendering
     * @param p_defaultValue A string containing the default value
     */
    setDefaultValue: function(p_defaultValue){
    	this.defaultValue = p_defaultValue;
    },
    /**
     * Retrieve the select default value
     */
    getDefaultValue: function(){
    	return this.defaultValue;
    },
    /**
     * Add an option to the select
     * @param p_display A string containing the displayed value
     * @param p_value A string containing the option value (Default = p_display)
     * @param p_selected A boolean value (Default = false)
     */
    addOption: function(p_display, p_value, p_selected){
    	if ($defined(p_display)){
		var l_selected = '';
	    	if (!$defined(p_value)){
	    		p_value = p_display;
	    	}
	    	if (!this.options){
	    		this.options = new Array();
	    	}
	    	this.options.include({value: p_value, display: p_display, selected: p_selected});
		
			if($chk(p_selected)&&p_selected){
				l_selected = 'selected="selected" ';
			}
	    	
			this.html += '<option '+ l_selected + 'value="'+p_value+'">'+p_display+'</option>';
			this.set('html', this.html);
		}
    },
    /**
     * Generates the select
     */
    renderData: function(){
    	var l_html = '';
    	this.options.each(function(item, index){
    		var l_value = '';
    		var l_display = '';
    		var l_selected = '';
    		if ($type(item) == 'object'){
    			if(item.display){
    				l_value = item.display;
    				l_display = item.display;
    			}
    			if(item.value){
    				l_value = item.value;
    			}
    			if(item.selected){
    				l_selected = 'selected="selected" ';
    			}
    		}else {
   				l_value = item;
   				l_display = item;
    		}
    		if(this.defaultValue == l_value) l_selected = 'selected="selected" ';
    		
		    l_html += '<option '+ l_selected + 'value="'+l_value+'">'+l_display+'</option>';
		},this); 

		this.html = l_html;
		this.set('html', l_html);
    }
});
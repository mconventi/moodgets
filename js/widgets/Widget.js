/**
 * The base widget element of Moodgets library: A widgets library built on mootools.
 * All the widgets extend this class
 *
 * @name Widget
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var Widget = new Class({
	element: null,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_elementType The element type
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_elementType, p_parent, p_options){
    	this.element = new Element(p_elementType, p_options); 
    	
		if (p_parent){
			this.element.inject(p_parent);
		}
    	//Element Methods reflection
    	/*if(!this.initialized){
	    	for (var l_method in this.element) {
				if (typeof this.element[l_method] == 'function') {
					this[l_method] = this.element[l_method].bindWithEvent(this.element);
				}
			};
			this.initialized = true;
		}*/
    },    
    /**
     * Sets the widget options
     */
    setOptions: function(p_options){
    	for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		};
    },
    /**
     * Retrieve the related mootools element object
     */
    toElement: function(){    
    	return this.element;
    },
    /**
     * Executes the set function on the mootools element
     */
    set: function(p_param, p_value){
    	return this.element.set(p_param, p_value);
    },
    /**
     * Executes the setStyle function on the mootools element
     */
    setStyle: function(p_param, p_value){
    	return this.element.setStyle(p_param, p_value);
    },
    /**
     * Executes the setStyles function on the mootools element
     */
    setStyles: function(p_obj){
    	return this.element.setStyles(p_obj);
    },
    /**
     * Executes the get function on the mootools element
     */
    get: function(p_param){
    	return this.element.get(p_param);
    },
    /**
     * Executes the getStyle function on the mootools element
     */
    getStyle: function(p_param){
    	return this.element.getStyle(p_param);
    },
    /**
     * Executes the addClass function on the mootools element
     */
    addClass: function(p_class){
    	return this.element.addClass(p_class);
    },
    /**
     * Executes the toggleClass function on the mootools element
     */
    toggleClass: function(p_class){
    	return this.element.toggleClass(p_class);
    },
    /**
     * Executes the removeClass function on the mootools element
     */
    removeClass: function(p_class){
    	return this.element.removeClass(p_class);
    },
    /**
     * Executes the getParent function on the mootools element
     */
    getParent: function(){
    	return this.element.getParent();
    },
    /**
     * Executes the empty function on the mootools element
     */
    empty: function(){
    	return this.element.empty();
    },
    /**
     * Executes the addEvent function on the mootools element
     */
    addEvent: function(p_event, p_function){
    	return this.element.addEvent(p_event, p_function);
    },
    /**
     * Executes the addEvents function on the mootools element
     */
    addEvents: function(p_events){
    	return this.element.addEvents(p_events);
    },
    /**
     * Executes the removeEvent function on the mootools element
     */
    removeEvent: function(p_event, p_function){
    	return this.element.removeEvent(p_event, p_function);
    },
    /**
     * Executes the removeEvents function on the mootools element
     */
    removeEvents: function(p_events){
    	return this.element.removeEvents(p_events);
    },
    /**
     * Executes the fireEvent function on the mootools element
     */
    fireEvent: function(p_type, p_args, p_delay){
    	return this.element.fireEvent(p_type, p_args, p_delay);
    },
    /**
     * Executes the store function on the mootools element
     */
    store: function(p_param, p_value){
    	return this.element.store(p_param, p_value);
    },
    /**
     * Executes the retrieve function on the mootools element
     */
    retrieve: function(p_param){
    	return this.element.retrieve(p_param);
    },
    /**
     * Executes the getElements function on the mootools element
     */
    getElements: function(p_expression, p_options){
    	return this.element.getElements(p_expression, p_options);
    },
    /**
     * Executes the getElement function on the mootools element
     */
    getElement: function(p_expression, p_options){
    	return this.element.getElement(p_expression, p_options);
    },
    /**
     * Executes the getChildren function on the mootools element
     */
    getChildren: function(p_expression, p_options){
    	return this.element.getChildren(p_expression, p_options);
    }
});

if(!Element.Events.tabkey){
	Element.Events.tabkey = {
		base: "keydown",
		condition: function(event){
			return (event.key == "tab");
		}
	}
}
if(!Element.Events.enterkey){
	Element.Events.enterkey = {
		base: "keydown",
		condition: function(event){
			return (event.key == "enter");
		}
	}
}

if(!Element.Events.esckey){
	Element.Events.esckey = {
		base: "keydown",
		condition: function(event){
			return (event.key == "esc");
		}
	}
}

if(!Element.Events.arrowkeys){
	Element.Events.arrowkeys = {
		base: "keydown",
		condition: function(event){
			var arrows = ["up", "down"];
			return (arrows.contains(event.key));
		}
	}
}

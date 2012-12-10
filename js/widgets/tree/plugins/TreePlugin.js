/**
 * A base object to build a tree plugin. 
 * Moodgets library: A widgets library built on mootools.
 * This class:
 *  - sets the object type,
 *  - initializes the tree object,
 *  - initializes the object options.
 *
 * @name TreePlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: a tree plugin must extend this class.
 */
var TreePlugin = new Class({
	id: null,
	tree: null,
	objectType: null,	
	
	/**
	 * Creates the element and sets the object options
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_options){       		
   		this.objectType = 'treePlugin';
    
    	if ($chk(p_options))
    		this.setOptions(p_options);
    		
   		this.addTreeEvents();
    },
    /**
     * Sets the tree plugin options
     */
    setOptions: function(p_options){
    	for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		}
    },
    /**
     * Sets the tree events interesting for the plugin
     * Uses the function getTreeEvents that must be implemented by the plugin.
     */
    addTreeEvents: function(){    	
    	if ($chk(this.tree)){
    		this.treeEvents = this.getTreeEvents();
	    	for (var l_obj in this.treeEvents) {
				this.tree.addEvent(l_obj, this.treeEvents[l_obj]);
			}
			this.onPluginInitHandler();
		}
    },
    /**
     * Sets the related tree
     */
    setTree: function(p_tree){    	
    	if ($chk(p_tree)){
    		this.tree = p_tree;
    		this.addTreeEvents();
		}
    },    
    /**
     * It is called after tree plugin creation. It can be implemented by the tree plugin.
     */
    onPluginInitHandler: function(){}
});
/**
 * A base object to build a rss reader plugin. 
 * Moodgets library: A widgets library built on mootools.
 * This class:
 *  - sets the object type,
 *  - initializes the rss reader object,
 *  - initializes the object options.
 *
 * @name RssReaderPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: a rss reader plugin must extend this class.
 */
var RssReaderPlugin = new Class({
	id: null,
	rssReader: null,
	objectType: null,	
	
	/**
	 * Creates the element and sets the object options
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_options){       		
   		this.objectType = 'rssReaderPlugin';
    
    	if ($chk(p_options))
    		this.setOptions(p_options);
    		
   		this.addRssReaderEvents();
    },
    /**
     * Sets the rss reader plugin options
     */
    setOptions: function(p_options){
    	for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		};
    },
    /**
     * Sets the rss reader events interesting for the plugin
     * Uses the function getRssReaderEvents that must be implemented by the plugin.
     */
    addRssReaderEvents: function(){    	
    	if ($chk(this.rssReader)){
    		this.rssReaderEvents = this.getRssReaderEvents();
	    	for (var l_obj in this.rssReaderEvents) {
				this.rssReader.addEvent(l_obj, this.rssReaderEvents[l_obj]);
			}
			this.onPluginInitHandler();
		}
    },
    /**
     * Sets the related rss reader
     */
    setRssReader: function(p_rssReader){    	
    	if ($chk(p_rssReader)){
    		this.rssReader = p_rssReader;
    		this.addRssReaderEvents();
		}
    },    
    /**
     * It is called after rss reader plugin creation. It can be implemented by the rss reader plugin.
     */
    onPluginInitHandler: function(){}
});
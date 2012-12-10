/**
 * A plugin useful to build a rss reader that allows to select rows. 
 * Moodgets library: A widgets library built on mootools.
 *
 * In order to avoid the selectable effect on a row, the row must have the 'no-selectable' class
 *
 * @name SelectableRssReaderPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a SelectableRssReaderPlugin object passing the rss reader as parameter.
 */
var SelectableRssReaderPlugin = new Class({
	Extends: RssReaderPlugin,
	
	id: 'SelectableRssReaderPlugin',
	rowIndex: 0,
	alternateRows: true,
	multipleSelection: false,
	
    /**
     * Returns the rss reader events used by the plugin
     * @private
     */
	getRssReaderEvents: function(){
		return {
			beforeRenderData: this.onBeforeRenderDataHandler.bind(this),
			newRow: this.onNewRowHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onPluginInitHandler: function(){    	
    	this.rssReader.alternateRow = this.alternateRow;
    },
    /**
     * @private
     */
    onNewRowHandler: function(p_row){
    	if(this.rowIndex % 2){
			p_row.removeClass('erow');
		}else{
			p_row.addClass('erow');
		}
		
		p_row.addEvent('click', this.onRowClick.bind(this));
		p_row.addEvent('mouseover', this.onRowMouseOver.bind(this) );
		p_row.addEvent('mouseout',  this.onRowMouseOut.bind(this) );	
		
		this.rowIndex++;
    },
    /**
     * @private
     */
    onBeforeRenderDataHandler: function(){  
		this.rowIndex = 0;
    },
    /**
     * @private
     */
    onRowMouseOver: function (evt){
		var li = evt.target.getParent('li');
		li.addClass('over');
	},	
    /**
     * @private
     */
	onRowMouseOut: function (evt){
		var li = evt.target.getParent('li');
		li.removeClass('over');
	},	
    /**
     * @private
     */
	onRowClick: function (evt){
		var li = evt.target.getParent('li');
		
		if (!li.hasClass('no-selectable')) {
			if ( !this.multipleSelection && this.rssReader.rows){
				this.rssReader.rows.each(function(el, i){ if (li!=el) el.removeClass('selected'); }, this);
			}
			li.toggleClass('selected');
		}
	},
    /**
     * @private
     */
	alternateRow: function(){
		this.rows.each(function(el,i){
			if(i % 2){
				el.removeClass('erow');
			}else{
				el.addClass('erow');
			}
		});
	}
});
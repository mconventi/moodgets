/**
 * A Rss Reader for Moodgets library: A widgets library built on mootools.
 *
 * @name RssReader
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var RssReader = new Class({
	Extends: Widget,	
	url: null,
	data: null,
	scrollOffset: 0.5,
	scrollDelay: 30,
	stopScroll: false,
	showHeader: true,
	expandRowOnLoad: false,
	topBar: null,
	topBarHeight: 0,
	bodyElement: null,
	bodyTreeElement: null,
	bodyHeight: 0,
	bottomBar: null,
	bottomBarHeight: 0,
	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
    initialize: function(p_parent, p_options){
		this.parent('div', p_parent, p_options);	
		this.addClass('rssReader');
		this.setStyle('height', this.getParent().getStyle('height'));
		this.setStyle('width', this.getParent().getStyle('width'));
		
		this.setOptions(p_options);
		
		if ($chk(this.rssReaderPlugins)&&($type(this.rssReaderPlugins)=='array')){
			for (var i = 0; i < this.rssReaderPlugins.length; i++) {
				if (this.rssReaderPlugins[i].objectType == 'rssReaderPlugin'){
					this.rssReaderPlugins[i].setRssReader(this);
				}
			}
		}
					
    	if(!$chk(this.dialog)){
    		this.dialog = new DialogBox(this);	//Preload dialog box images
    	}
		
		this.createReader();
    },
	createReader: function(){	
		this.fireEvent('beforeHeaderCreation');			
		
		//************************* Elements height initialization *****************		
		if ($chk(this.topBar))
			this.topBarHeight = 26; // toolbar height 25px + 1px bottom border
		
		if ($chk(this.bottomBar))
			this.bottomBarHeight = 26; // pagination toolbar height 25px + 1px bottom border
	
		// *********************** Header initialization **************************	
		var l_headerContainer = new Element('div');
		l_headerContainer.addClass('rssReaderHeader');
		l_headerContainer.inject(this);
		
		this.headerElement = new Element('div', {
			'html':'&nbsp;'
		});
		this.headerElement.inject(l_headerContainer);
		this.headerElement.addClass('rssReaderHeaderBox');
		this.headerElement.setStyle('width', '100%');	
		
		if (!this.showHeader){
			this.headerHeight = 0;
			l_headerContainer.setStyle('display', 'none');
		}else{
			this.headerHeight = 24;
		}				
		
		// ************************* Body *****************************************	
		this.fireEvent('beforeBodyCreation', this);	
		this.bodyHeight = this.getStyle('height').toInt() - this.headerHeight-this.topBarHeight-this.bottomBarHeight;  	
		this.bodyElement = new Element('div', {
			'class': 'rssReaderBody',
			'styles':{
				'width': this.getStyle('width'),
				'height': this.bodyHeight
			}
		});		
		this.bodyElement.inject(this);
		this.fireEvent('bodyCreation', this.bodyElement);
		
		this.loadData();
	},
	loadData: function(){
		if ($chk(this.url)){
			this.bodyElement.addClass('loading');
			new Request({
				url: this.url,
				data: this.data,
				onFailure:  this.onFailure.bind(this),
				onSuccess: this.onSuccess.bind(this)
			}).send();
		}
	},
	renderData: function(p_rssTree){
		this.fireEvent('befoRerenderData', this.bodyElement);
		
		var l_channels = p_rssTree.getElementsByTagName('channel');
		if ($chk(l_channels)&&(l_channels.length > 0)) { 
			var l_channel = l_channels[0];
			this.headerElement.set('text', l_channel.getElementsByTagName('title')[0].firstChild.nodeValue);
							
			var l_items = l_channel.getElementsByTagName('item');		
			this.bodyTreeElement = this.bodyElement.getElement('ul');			
			if ($chk(this.bodyTreeElement)){
				this.bodyTreeElement.empty();
			}else{
				this.bodyTreeElement = new Element('ul', {
					'class': 'rssReaderBodyTree',
					'styles': {
						'width': '100%',
						'top': this.bodyHeight
					}
				});			
				this.bodyTreeElement.inject(this.bodyElement);
			}
			
			for (var j=0; j<l_items.length; j++)  { 			
				var l_row = new Element('li', {
					'styles':{
						'width': '100%'
					}
				});
				var l_rowHeader = new Element('div', {
					'class': 'rssReaderRowTitle',
					'styles':{
						'width': '100%'
					}
				});
				var l_toolImg = new Element('div', {
					'class': 'rssReaderRowTool',
					'styles':{
						'float': 'left'
					}
				});
				l_toolImg.setStyle('background-position','-18px 3px');
				l_toolImg.addEvent('click', this.onRowToolClick.bind(this));
				l_toolImg.inject(l_rowHeader);
				
				var l_rowTitle = new Element('a', {
					'text': l_items[j].getElementsByTagName('title')[0].firstChild.nodeValue,
					'href': l_items[j].getElementsByTagName('link')[0].firstChild.nodeValue,
					'target': '_blank'
				});				
				l_rowTitle.inject(l_rowHeader);
				l_rowHeader.inject(l_row);
				
				var l_rowDescription = new Element('div', {
					'text': l_items[j].getElementsByTagName('description')[0].firstChild.nodeValue,
					'class': 'hidden rssReaderRowDescription'
				});
				l_rowDescription.inject(l_row);
				
				if (this.expandRowOnLoad){
					l_rowDescription.toggleClass('hidden');
					l_toolImg.setStyle('background-position','0px 3px');
				}
				
				l_row.inject(this.bodyTreeElement);				
				l_row.addEvent('mouseover', this.onRowMouseOver.bind(this) );
				l_row.addEvent('mouseout',  this.onRowMouseOut.bind(this) );
				
				this.fireEvent('newRow', l_row);	
			}
			
			this.bodyTreeElementHeight = this.bodyTreeElement.getStyle('height').toInt();
			this.rows = this.bodyTreeElement.getElements('li');
			this.fireEvent('renderData', this.bodyElement);
			this.lastScrollValue = this.bodyHeight;
			this.scroll.periodical(this.scrollDelay, this); 
		}else{
			this.bodyTreeElementHeight = 0;
			this.rows = [];		
			if(!$chk(this.dialog)){
				this.dialog = new DialogBox(this);
			}
			this.dialog.error(g_language.RssReader.invalidRssResultMsg);
		}					
	},
    /**
     * @private
     */
	scroll: function(){
		if (!this.stopScroll){
			if (this.lastScrollValue > -this.bodyTreeElementHeight){
				this.lastScrollValue = this.lastScrollValue - this.scrollOffset;
			}else{
				this.lastScrollValue = this.bodyHeight;
			}
			this.bodyTreeElement.setStyle('top', this.lastScrollValue + 'px');
		}
	},
    /**
     * @private
     */
	onSuccess: function(p_response){
		var l_xmlDoc = null;
		try {//Internet Explorer 
			l_xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			if (l_xmlDoc){
				l_xmlDoc.async="false";
				l_xmlDoc.loadXML(p_response);
			}
		} catch(e) {
			l_xmlDoc=new DOMParser().parseFromString(p_response,"text/xml");
		}
		this.bodyElement.removeClass('loading');
		this.renderData(l_xmlDoc);
	},
    /**
     * @private
     */
	onFailure: function() { 
		this.bodyElement.removeClass('loading');				
		if(!$chk(this.dialog)){
			this.dialog = new DialogBox(this);
		}
		this.dialog.error(g_language.RssReader.loadFailureMsg);
	},
    /**
     * @private
     */
    onRowMouseOver: function (p_evt){
		this.stopScroll = true;
	},	
    /**
     * @private
     */
	onRowMouseOut: function (p_evt){
		this.stopScroll = false;
	},	
    /**
     * @private
     */
	onRowToolClick: function (p_evt){	
		var l_rowTitle = p_evt.target.getParent();
		if ($chk(l_rowTitle)){
			var l_description = l_rowTitle.getNext('.rssReaderRowDescription');
			if ($chk(l_description)){
				l_description.toggleClass('hidden');
				this.bodyTreeElementHeight = this.bodyTreeElement.getStyle('height').toInt();
				
				var l_toolImg = l_rowTitle.getElement('.rssReaderRowTool');
				if ($chk(l_toolImg)){
					if (l_description.hasClass('hidden'))
						l_toolImg.setStyle('background-position','-18px 3px');
					else
						l_toolImg.setStyle('background-position','0px 3px');	
				}
			}
		}
	}
});


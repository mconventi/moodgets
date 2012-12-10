/**
 * A TabPanel element for Moodgets library: A widgets library built on mootools.
 *
 * Generates events:
 * - activated({title: activeTabTitle, panel: activeTabPanel}, activeTabIndex) After a new tab activation
 *
 * @name TabPanel
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var TabPanel = new Class({	
	Extends: Widget,
	
	activeTab: null,
	activeTabIndex: null,
	tabs: new Array(),
			
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
	initialize: function(p_parent, p_options) {	
		this.parent('div', p_parent, p_options);
		    		
		this.addClass('tabPanel');		
		this.header = new Element('ul');
		this.header.inject(this);
	},	
	/**
	 * Add a tab into the tab panel
	 * @param p_title Tab title
	 * @param p_content Tab content. Can be a mootools element or the element's id
	 */
	addTab: function(p_title, p_content){
		var l_tabIndex = this.tabs.length;
		
		//the new title
		var l_newTitle = new Element('li', {
			'title': p_title,
			'text': p_title
		});
		l_newTitle.addClass('tabTitle');
		l_newTitle.inject(this.header);
		l_newTitle.addEvent('click', function() {
			this.activate(l_tabIndex);
			l_newTitle.removeClass('tabTitleMouseOver');
		}.bind(this));
		
		l_newTitle.addEvent('mouseover', function() {
			if(l_newTitle != this.activeTab.title) {
				l_newTitle.addClass('tabTitleMouseOver');
			}
		}.bind(this));
		l_newTitle.addEvent('mouseout', function() {
			if(l_newTitle != this.activeTab.title) {
				l_newTitle.removeClass('tabTitleMouseOver');
			}
		}.bind(this));
		
		//the new panel		
		if($type(p_content) == 'string') {
			var l_newPanel = $(p_content);
		}else if($type(p_content) == 'element'){
			var l_newPanel = new Element('div');		
			p_content.inject(l_newPanel);
		}
		l_newPanel.addClass('tabContent');
		l_newPanel.inject(this);
		
		this.tabs.include({title: l_newTitle, panel: l_newPanel});
	},		
	/**
	 * Activates a tab
	 * @param p_tabIndex Tab index
	 */
	activate: function(p_tabIndex){		
		if ($chk(p_tabIndex)&&(p_tabIndex >= 0)&&(p_tabIndex < this.tabs.length)){ 
			var l_tab = this.tabs[p_tabIndex];
			
			if ($chk(this.activeTab)){
				this.activeTab.title.removeClass('activeTabTitle');
				this.activeTab.panel.removeClass('activeTabContent');			
			}
			if ($chk(l_tab)){
				l_tab.title.addClass('activeTabTitle');
				l_tab.panel.addClass('activeTabContent');
				if (!this.fixedSize){
					var l_childrenElement = l_tab.panel.getChildren()[0];
					if ($chk(l_childrenElement)){
						var l_coords = l_childrenElement.getCoordinates();
						this.setStyle('width', l_coords.width);
						this.setStyle('height', l_coords.height);
					}
				}
			}
			
			this.activeTab = l_tab;
			this.activeTabIndex = p_tabIndex;
			
			this.fireEvent('activated', [this.activeTab,this.activeTabIndex]);
		}
	},	
	/**
	 * Activates the next tab
	 */
	next: function(){
		if ($chk(this.activeTabIndex)){
			var l_nextIndex = this.activeTabIndex+1;
			if (l_nextIndex < this.tabs.length){
				this.activate(l_nextIndex);
			}
		}
	},	
	/**
	 * Activates the previous tab
	 */
	previous: function(){
		if ($chk(this.activeTabIndex)){
			var l_prevIndex = this.activeTabIndex-1;
			if (l_prevIndex >= 0){
				this.activate(l_prevIndex);
			}
		}
	}
});
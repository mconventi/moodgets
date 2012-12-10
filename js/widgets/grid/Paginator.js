/**
 * A Pagination toolbar element for Moodgets library: A widgets library built on mootools. 
 * It fires a "loaddata" event to communicate with the grid that data need to be refreshed.
 *
 * Generates events:
 * - loaddata When data must be loaded. It is fired when the pagination state changes.
 *
 * @name Paginator
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired and based on Marko Santic http://www.omnisdata.com/omnigrid
 * @license MIT Style License 
 * @thanks to Marko Santic
 */
var Paginator = new Class({
	Extends: Toolbar,
	
	tableSize: null,
	pageFirstBtn: null,
	pagePrevBtn: null,
	pageControl: null,
	pageNextBtn: null,
	pageLastBtn: null,
	pageFirstBtn: null,
	pageReloadBtn: null,
	pageFirstBtn: null,
	pagesLbl: null,
	pageStatLbl: null,
	isLoading: false,
	page:  1,
	total:  0,
	maxpage: 0,
	pageSize: 10,
	
	/**
	 * Creates the element into the parent
	 * @param p_parent The parent element
	 * @constructor
	 */
    initialize: function(p_parent){
    				
		this.parent(p_parent);
		this.addClass('paginator');
		
		this.tableSize = new Select((new Group(this)));
		this.tableSize.setOptions(new Array({display:'10', selected: true}, '20', '50', '100', '200'));
		
		new ButtonsSeparator(this);
		
		var l_group = (new Group(this));		
		this.pageFirstBtn = new Button(l_group);
		this.pageFirstBtn.addClass('pageFirst');
		this.pagePrevBtn = new Button(l_group);
		this.pagePrevBtn.addClass('pagePrev');
		
		new ButtonsSeparator(this);
		
		l_group = (new Group(this));	
		var lbl = new Label(l_group);	
		lbl.addClass('pageControl');
		lbl.setText(g_language.Paginator.pageLbl);
		this.pageControl = new Input(l_group);
		this.pageControl.set('value', this.page);
		this.pageControl.set('size', '4');
		lbl = new Label(l_group);	
		lbl.addClass('pageControl');
		lbl.setText(g_language.Paginator.pageOfLbl);
		this.pagesLbl = new Label(l_group);	
		this.pagesLbl.addClass('pageControl');
		this.pagesLbl.setText('1');
		
		new ButtonsSeparator(this);
		
		l_group = (new Group(this));		
		this.pageNextBtn = new Button(l_group);
		this.pageNextBtn.addClass('pageNext');
		this.pageLastBtn = new Button(l_group);
		this.pageLastBtn.addClass('pageLast');
		
		new ButtonsSeparator(this);
		
		l_group = (new Group(this));		
		this.pageReloadBtn = new Button(l_group);
		this.pageReloadBtn.addClass('pageReload');
		
		this.pageStatLbl = new Label((new Group(this)));	
		this.pageStatLbl.addClass('pageStat');
		
		this.pageFirstBtn.addEvent('click', this.firstPage.bind(this) );
		this.pagePrevBtn.addEvent('click', this.prevPage.bind(this) );
		this.pageNextBtn.addEvent('click', this.nextPage.bind(this) );
		this.pageLastBtn.addEvent('click', this.lastPage.bind(this) );
		this.pageReloadBtn.addEvent('click', this.pageReload.bind(this) );
		this.tableSize.addEvent('change', this.tableSizeChange.bind(this));
		this.pageControl.addEvent('change', this.pageChange.bind(this) );
    },
    /**
     * Refresh the pagination informations
     * @param p_total The total number of records
     */ 
    refresh: function(p_total){    	
    	if (p_total){	    	
	    	this.total = p_total;
	    	this.maxPage = Math.ceil(this.total/this.pageSize);
	    	
			this.pageControl.set('value', this.page);
			var to = (this.page*this.pageSize) > this.total ? this.total : (this.page*this.pageSize);
			this.pageStatLbl.set('html', g_language.Paginator.pageStatLbl[0]+ ' ' +((this.page-1)*this.pageSize+1)+' '+g_language.Paginator.pageStatLbl[1]+' '+to+' '+g_language.Paginator.pageStatLbl[2]+' '+this.total+' '+g_language.Paginator.pageStatLbl[3]);
			this.pagesLbl.set('html', this.maxPage);
		}else {
	    	this.total = 0;
	    	this.maxPage = 0;
			this.pageStatLbl.set('html', g_language.Paginator.noItems);
			this.pagesLbl.set('html', '');
		}
		if (this.page<=1) { 
			this.pageFirstBtn.addClass('disabled'); 
			this.pagePrevBtn.addClass('disabled');
		}else{
			this.pageFirstBtn.removeClass('disabled'); 
			this.pagePrevBtn.removeClass('disabled');
		}
		if (this.page >= this.maxPage) { 
			this.pageLastBtn.addClass('disabled'); 
			this.pageNextBtn.addClass('disabled');
		}else{
			this.pageLastBtn.removeClass('disabled'); 
			this.pageNextBtn.removeClass('disabled');
		}
    },
    /**
     * Toggles the pagination bar state
     */
    toggle: function(){    
		this.pageReloadBtn.toggleClass('loading'); 
		this.toggleClass('disabled'); 
    },	
    /**
     * Sets the pagination at the first page
     * @private
     */    
	firstPage: function(){
		if (this.page>1){
			this.page = 1;	
			this.fireEvent("loaddata");
		}
	},	
    /**
     * Sets the pagination at the previous page
     * @private
     */ 	
	prevPage: function(){
		if (this.page>1){
			this.page--;	
			this.fireEvent("loaddata");
		}
	},		
    /**
     * Sets the pagination at the next page
     * @private
     */ 
	nextPage: function(){
		if($chk(this.maxPage) && (this.page < this.maxPage)){
			this.page++;		
			this.fireEvent("loaddata");
		}
	},			
    /**
     * Sets the pagination at the last page
     * @private
     */ 
	lastPage: function(){
		if($chk(this.maxPage)&& this.page < this.maxPage){
			this.page = this.maxPage;	
			this.fireEvent("loaddata");
		}
	},		
    /**
     * Forces to reload data
     * @private
     */ 		
	pageReload: function(){
		this.fireEvent("loaddata");
	},	
    /**
     * Forces to reload data because the page is changed
     * @private
     */ 
	pageChange: function(){
		this.page = this.pageControl.get('value').toInt();		
		this.fireEvent("loaddata");
	},
    /**
     * Forces to reload data because the table size is changed
     * @private
     */ 
	tableSizeChange: function(){
		var l_oldPageSize = this.pageSize;
		this.pageSize = this.tableSize.get('value').toInt();
		if($chk(this.pageSize) && ((l_oldPageSize < this.total)||(this.pageSize < this.total))){
			this.fireEvent("loaddata");
		}
	}
});
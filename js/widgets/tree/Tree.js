/**
 * A tree widget for Moodgets library: A widgets library built on mootools.
 * It is a simple tree which functionalities can be expanded adding the Moodgets Tree Plugins.
 *
 * Generates events:
 * - expand(TreeNode, state, recursive) Called when the node is expanded or collapsed: Where node is the <TreeNode> object that fired the event, and state is a boolean meaning true:expanded or false:collapsed.
 * - beforetreecreation(Tree) Fired before tree creation
 * - treecreation(Tree) Fired after tree creation
 * - select(TreeNode, state) called when a node is selected or deselected: Where node is the <TreeNode> object that fired the event, and state is a boolean meaning true:selected or false:deselected.
 * - beforerender(Tree, TreeNode) Fired before tree data rendering
 * - render(Tree) Fired after tree data rendering
 * - beforenodecreation(TreeNode) Called when the node is created: Where TreeNode is the <TreeNode> parent 
 * - nodecreation(TreeNode) Called when the node is created: Where TreeNode is the new <TreeNode> object 
 * - nodeupdate(TreeNode) Called when the node is updated: Where TreeNode is the updated <TreeNode> object 
 * - nodeimgupdate(TreeNode) Called when the node's image is updated: Where TreeNode is the updated <TreeNode> object 
 *
 * @name Tree
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired by Rasmus Schultz MooTreeControl, <http://www.mindplay.dk>
 * @license MIT Style License
 * @thanks to Rasmus Schultz
 * @use: 
 *  new Tree($('tree'),{
 *		text: 'Root Node',
 *		id: 'root'
 *	},{ 
 *		treePlugins: [
 *			new DemoTreePlugin()
 *		]
 *	}); 
 */
var Tree = new Class({
	Extends: Widget,
	hasTopBar: false,
	topBar: null,
	topBarHeight: 0,		
	hasBottomBar: false,
	bottomBar: null,
	bottomBarHeight: 0,
	bodyElement: null,
	bodyHeight: 0,
	dataStore: null,
	index: new Object(),          	    // used by the get() method
	grid: true,							// grid can be turned on (true) or off (false)
	mode: 'files',						// mode can be "folders" or "files", and affects the default icons
	selected: null,						// set the currently selected node to nothing
	loader: {
		imgClass: 'treeLoaderImg', 
		text: g_language.Tree.loaderText, 
		nodeClass: 'treeLoaderNode'
	},
	enabled: true,						// enable visual updates of the control	
	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_rootNode A <TreeNode> object representing the root node
	 * @param p_options The object options
	 * @constructor
	 */
	initialize: function(p_parent, p_rootNode, p_options) {
		this.parent('div', p_parent);
		this.addClass('tree');
		this.setStyle('height', this.getParent().getStyle('height'));
		this.setStyle('width', this.getParent().getStyle('width'));		
		this.setOptions(p_options);	  
		this.dialog = new DialogBox(this);
				
		if ($chk(this.treePlugins)&&($type(this.treePlugins)=='array')){
			for (var i = 0; i < this.treePlugins.length; i++) {
				if (this.treePlugins[i].objectType == 'treePlugin'){
					this.treePlugins[i].setTree(this);
				}
			}
		}
		
		if($chk(this.dataStore)){
			this.dataStore.removeEvents();
			this.dataStore.addEvent('dataloaded', this.renderData.bind(this));
			this.dataStore.addEvent('dataloadingfailure', function(p_dataStore){	
		    	this.dialog.error(g_language.RemoteDataStore.loadFailureMsg);
			}.bind(this));
		}
		
		this.createTree(p_rootNode);
	},
    /**
     * Creates the tree structure and the root node
	 * @param p_rootNode A <TreeNode> object representing the root node
     */
	createTree: function(p_rootNode){	
		if ($chk(this.bodyElement))
			this.bodyElement.empty();
		
		this.fireEvent('beforetreecreation', [this]);
		
		//************************* Elements height initialization *****************		
		if ((this.hasTopBar)||$chk(this.topBar))
			this.topBarHeight = 26; // toolbar height 25px + 1px bottom border
		
		if (this.hasBottomBar || $chk(this.bottomBar))
			this.bottomBarHeight = 26; // pagination toolbar height 25px + 1px bottom border
		
		// ************************* Body *****************************************	
		this.bodyElement = new Element('div');
		this.bodyElement.addClass('treeBody');		
		this.bodyElement.setStyle('width', this.getStyle('width'));				
		this.bodyHeight = this.getStyle('height').toInt() - this.topBarHeight-this.bottomBarHeight;  	
		this.bodyElement.setStyle('height', this.bodyHeight);		
		this.bodyElement.inject(this);
		
		this.fireEvent('treecreation', [this]);
		
		// ************************* Root Node **************************************	
		p_rootNode.controller = this;     		  // make sure our new TreeNode knows who it's owner control is
		p_rootNode.container = this.bodyElement;  // tells the root node which div to insert itself into
		this.root = new TreeNode(p_rootNode); 	  // create the root node of this tree control
						
		this.root.update(true);		
	},
    /**
     * Sets the tree data store
	 * @param p_dataStore A <DataStore> object.
     */
	setDataStore: function(p_dataStore){
		if($chk(p_dataStore)){
			this.dataStore = p_dataStore;
			this.dataStore.removeEvents();
			this.dataStore.addEvent('dataloaded', this.renderData.bind(this));
			this.dataStore.addEvent('dataloadingfailure', function(p_dataStore){	
		    	this.dialog.error(g_language.RemoteDataStore.loadFailureMsg);
		    	this.loading = false;
		    	if ($chk(this.loadingNode)){
					this.loadingNode.clear();
		    	}
			}.bind(this));
		}
	},	
	/**
	 * Creates a new node under the root node of this tree.
	 * @param options - an object containing the same options available to the <TreeNode> constructor.
	 * @returns A new <TreeNode> instance.
	 */	
	insert: function(options) {
		options.controller = this;
		return this.root.insert(options);
	},	
	/**
	 * Sets the currently selected node.
	 * This is called by <TreeNode> when a node is selected (e.g. by clicking it's title with the mouse).
	 * @param p_rootNode A <TreeNode> object to select.
	 */	
	select: function(node) {
		if ($chk(this.selected)) {
			// deselect previously selected node:
			this.selected.select(false);
			this.fireEvent('select', [this.selected, false]);
		}
		if (this.selected == node) {
			this.selected = null;
			return; // already selected
		}
		// select new node:
		this.selected = node;
		node.select(true);
		
		this.fireEvent('select', [node, true]);
	},
	/**
	 * Expands the entire tree, recursively.
	 */	
	expand: function() {
		this.root.toggle(true, true);
	},
	/**
	 * Collapses the entire tree, recursively.
	 */	
	collapse: function() {
		this.root.toggle(true, false);
	},
	/**
	 * Retrieves the node with the given id - or null, if no node with the given id exists.
	 * Node id can be assigned via the <TreeNode> constructor, e.g. using the <TreeNode.insert> method.
	 * @params id - a string, the id of the node you wish to retrieve.
	 */	
	get: function(id) {
		return this.index[id] || null;
	},
	/**
	 * Adopts a structure of nested ul/li/a elements as tree nodes, then removes the original elements.
	 * Node id can be assigned via the <TreeNode> constructor, e.g. using the <TreeNode.insert> method.
	 * @params id - a string representing the ul element to be adopted, or an element reference.
	 * @params parentNode - optional, a <TreeNode> object under which to import the specified ul element. Defaults to the root node of the parent control.
	 * @use:
	 *	The ul/li structure must be properly nested, and each li-element must contain one a-element, e.g.:
	 *	
	 *	<ul id="mytree">
	 *	  <li><a href="test.html">Item One</a></li>
	 *	  <li><a href="test.html">Item Two</a>
	 *	    <ul>
	 *	      <li><a href="test.html">Item Two Point One</a></li>
	 *	      <li><a href="test.html">Item Two Point Two</a></li>
	 *	    </ul>
	 *	  </li>
	 *	  <li><a href="test.html">Item Three</a></li>
	 *	</ul>
	 *	
	 *	The "href", "target", "title" and "name" attributes of the a-tags are picked up and stored in the
	 *	data property of the node.
	 */	
	adopt: function(id, parentNode) {
		if (parentNode == undefined) parentNode = this.root;
		this.disable();
		this._adopt(id, parentNode);
		parentNode.update(true);
		$(id).destroy();
		this.enable();
	},
	/**
	 * Used by adopt function
	 * @private
	 */	
	_adopt: function(id, parentNode) {
		// adopts a structure of ul/li elements into this tree 
		e = $(id);
		var i=0; var c = e.getChildren();
		for (i=0; i<c.length; i++) {
			if (c[i].nodeName == 'LI') {
				var con={text:''}; var comment=''; var node=null; var subul=null;
				var n=0; var z=0; var se=null; var s = c[i].getChildren();
				for (n=0; n<s.length; n++) {
					switch (s[n].nodeName) {
						case 'A':
							for (z=0; z<s[n].childNodes.length; z++) {
								se = s[n].childNodes[z];
								switch (se.nodeName) {
									case '#text': con.text += se.nodeValue; break;
									case '#comment': comment += se.nodeValue; break;
								}
							}
							con.data = s[n].getProperties('href','target','title','name');
						break;
						case 'UL':
							subul = s[n];
						break;
					}
				}
				if (con.label != '') {
					con.data.url = con.data['href']; // (for backwards compatibility)
					if (comment != '') {
						var bits = comment.split(';');
						for (z=0; z<bits.length; z++) {
							var pcs = bits[z].trim().split(':');
							if (pcs.length == 2) con[pcs[0].trim()] = pcs[1].trim();
						}
					}
					node = parentNode.insert(con);
					if (subul) this._adopt(subul, node);
				}
			}
		}
	},
	/**
	 * Load a node children
	 * @param p_rootNode A <TreeNode> object representing the subtree root.
	 */
	loadData: function(p_rootNode, p_recursive){		
		if ((!$chk(p_recursive))||(!p_recursive)){
			p_recursive = false;
		}else{
			p_recursive = true;
		}
		
		if (!$chk(p_rootNode)){
			p_rootNode = this.root;
		}		
		if ($chk(this.dataStore)){
			p_rootNode._toggle(false, true); // expand the node to make the loader visible		
			p_rootNode.clear();
			p_rootNode.insert(this.loader);
			this.dataStore.loadData({root: p_rootNode.id, recursive: p_recursive});
		}
	},		
	/**
	 * Creates nodes from last loaded data 
	 */
	renderData: function(){		
		this.disable();
		if ($chk(this.dataStore)&& (this.dataStore.data.length > 0)){		
			// Retrieve the loaded root node
			var l_loadedRootNode = this.get(this.dataStore.data[0].id);
			
			if ($chk(l_loadedRootNode)){
				this.fireEvent('beforerender', [this, l_loadedRootNode]);
				l_loadedRootNode.clear();
				l_loadedRootNode.leaf = this.dataStore.data[0].leaf;
				l_loadedRootNode.data = this.dataStore.data[0].data;
				this._createSubTree(l_loadedRootNode, this.dataStore.data[0].children);
			}else{
				this.dialog.error(g_language.Tree.renderingFailureMsg);
			}
		}
		this.enable();
		
		this.fireEvent('render', [this]);
	},		
	/**
	 * Used by renderData
	 * @private
	 */
	_createSubTree: function(p_parent, p_children){
		p_parent._toggle(false, true);
		for (var i=0; i<p_children.length; i++){
			var l_child = p_parent.insert(p_children[i]);
			if ($chk(p_children[i].children)){
				this._createSubTree(l_child, p_children[i].children);
			}
		}		
	},
	/**
	 * Call this to temporarily disable visual updates -- if you need to insert/remove many nodes
	 *	at a time, many visual updates would normally occur. By temporarily disabling the control,
	 *	these visual updates will be skipped.
	 *	
	 *	When you're done making changes, call <Tree.enable> to turn on visual updates
	 *	again, and automatically repaint all nodes that were changed.
	 */
	disable: function() {
		this.enabled = false;
	},
	/**
	 * Enables visual updates again after a call to <Tree.disable>
	 */
	enable: function() {
		this.enabled = true;
		this.root.update(true, true);
	}	
});
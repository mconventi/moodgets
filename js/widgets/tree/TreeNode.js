/**
 * A tree node object for Moodgets library: A widgets library built on mootools.
 * This class implements the functionality of a single node in a <Tree>.
 *
 * Generates events:
 * - expand(state, recursive) Called when the node is expanded or collapsed: where state is a boolean meaning true:expanded or false:collapsed.
 *
 * @name TreeNode
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired by Rasmus Schultz MooTreeNode, <http://www.mindplay.dk>
 * @license MIT Style License
 * @thanks to Rasmus Schultz
 * @use: 
 *  You should not manually create objects of this class -- rather, you should use
 *	<Tree.insert> to create nodes in the root of the tree, and then use
 *	the similar function <TreeNode.insert> to create subnodes.
 *	
 *	Both insert methods have a similar syntax, and both return the newly created
 *	<TreeNode> object.
 */
var TreeNode = new Class({
	Extends: Events,
	
	iconStructure: ['I','L','Lminus','Lplus','Rminus','Rplus','T','Tminus','Tplus','_closed','_doc','_open','minus','plus'],	
	nodeClass: 'treeNode',
	imgClass: 'treeNodeDefaultImg',
	textClass: 'treeNodeText',
	selectedNodeClass: 'treeSelectedNode',
	iconSize: 18,
	parent: null,             // this node's parent node (another TreeNode object)
	last: true,               // a flag telling whether this node is the last (bottom) node of it's parent
	selected: false,          // a flag telling whether this node is the currently selected node in it's tree
	text: '',			      // the text displayed by this node
	id: null,				  // the node's unique id
	nodes: new Array(),       // subnodes nested beneath this node (TreeNode objects)
	controller: null,		  // owner controller of this node's tree
	data: {},				  // optional object containing whatever data you wish to associate with the node (typically an url or an id)
	open: false,			  // flag: node open or closed?
	leaf: true, 			  // flag: is node a leaf?
	/**
	 * Creates the element into the tree and sets the object options
	 * @param p_options The object options
	 * @constructor
	 */
	initialize: function(p_options) {
	
		this.setOptions(p_options);
						
		// add the node to the controller's node index:
		if ($chk(this.id)) this.controller.index[this.id] = this;
		
		// create the necessary divs:
		this.container = {
			main: new Element('div').addClass(this.nodeClass),
			indent: new Element('div'),
			gadget: new Element('div'),
			icon: new Element('div'),
			text: new Element('div').addClass(this.textClass),
			sub: new Element('div')
		};
		
		// put the other divs under the main div:
		this.container.main.adopt(this.container.indent);
		this.container.main.adopt(this.container.gadget);
		this.container.main.adopt(this.container.icon);
		this.container.main.adopt(this.container.text);

		// put the main and sub divs in the specified parent div:
		$(p_options.container).adopt(this.container.main);
		$(p_options.container).adopt(this.container.sub);
		
		// attach event handler to gadget:
		this.container.gadget._node = this;
		this.container.gadget.onclick = this.container.gadget.ondblclick = function() {	
			this._node.toggle();		
		};
		
		// attach event handler to icon/text:
		this.container.icon._node = this.container.text._node = this;
		this.container.icon.onclick = this.container.icon.ondblclick = this.container.text.onclick = this.container.text.ondblclick = function() {
			this._node.controller.select(this._node);
		};
	},
	/**
	 * Creates a new node, nested inside this one.
	 * @param p_options An object containing the same options available to the <TreeNode> constructor.
	 * @returns A new <TreeNode> instance.
	 */
	insert: function(p_options) {		
		this.controller.fireEvent('beforenodecreation', [this]);
		
		// set the parent div and create the node:
		p_options.container = this.container.sub;
		p_options.controller = this.controller;
		var node = new TreeNode(p_options);
		
		// set the new node's parent:
		node.parent = this;
		
		// mark this node's last node as no longer being the last, then add the new last node:
		var n = this.nodes;
		if (n.length) n[n.length-1].last = false;
		n.push(node);
		
		this.controller.fireEvent('nodecreation', node);
		
		// repaint the new node:
		node.update();
		
		// repaint the new node's parent (this node):
		if (n.length == 1) this.update();
		
		// recursively repaint the new node's previous sibling node:
		if (n.length > 1) n[n.length-2].update(true);
		
		return node;
		
	},
	/**
	 * Removes this node, and all of it's child nodes. If you want to remove all the childnodes without removing the node itself, use <TreeNode.clear>
	 */
	remove: function() {
		var p = this.parent;
		this._remove();
		p.update(true);
	},
	/**
	 * Used by remove function
	 * @private
	 */
	_remove: function() {		
		// recursively remove this node's subnodes:
		var n = this.nodes;
		while (n.length) n[n.length-1]._remove();
		
		// remove the node id from the controller's index:
		delete this.controller.index[this.id];
		
		// remove this node's divs:
		this.container.main.destroy();
		this.container.sub.destroy();
		
		if (this.parent) {			
			// remove this node from the parent's collection of nodes:
			var p = this.parent.nodes;
			p.erase(this);
			
			// in case we removed the parent's last node, flag it's current last node as being the last:
			if (p.length) p[p.length-1].last = true;			
		}	
	},	
	/**
	 * Removes all child nodes under this node, without removing the node itself.
	 * To remove all nodes including this one, use <TreeNode.remove>
	 */
	clear: function() {
		this.controller.disable();
		while (this.nodes.length) this.nodes[this.nodes.length-1].remove();
		this.controller.enable();
	},
	/**
	 * Updates the tree node's visual appearance.
	 * @param recursive - boolean, defaults to false. If true, recursively updates all nodes beneath this one.
	 * @param invalidated - boolean, defaults to false. If true, updates only nodes that have been invalidated while the controller has been disabled.
	 */
	update: function(recursive, invalidated) {		
		var draw = true;
		
		if (!this.controller.enabled) {
			// controller is currently disabled, so we don't do any visual updates
			this.invalidated = true;
			draw = false;
		}
		
		if (invalidated) {
			if (!this.invalidated) {
				draw = false; // this one is still valid, don't draw
			} else {
				this.invalidated = false; // we're drawing this item now
			}
		}
		
		// mark this node as leaf
		this.leaf = this.leaf && (this.nodes.length==0);
		
		if (draw) {			
			var x;
			
			// make selected, or not:
			this.container.main.className = this.nodeClass + (this.selected ? ' ' + this.selectedNodeClass : '');
			
			// update indentations:
			var p = this;
			this.container.indent.empty();
			while (p.parent) {
				p = p.parent;
				this.getImg((p.last || !this.controller.grid) ? '' : 'I').inject(this.container.indent, 'top');
			}
			
			// update the text:
			x = this.container.text;
			x.empty();
			x.appendText(this.text);
			
			this.updateNodeImg();		
		}
		
		this.controller.fireEvent('nodeupdate', this);
		
		// if recursively updating, update all child nodes:
		if (recursive) this.nodes.forEach( function(node) {
			node.update(true, invalidated);
		});			
	},
	/**
	 * Private method called by TreeNode to update the node images
	 * @private
	 */
	updateNodeImg: function() {	
		// update the icon:		
		this.container.icon.empty();
		var l_iconImg = this.getImg( (!this.leaf) ? ( this.open ? '_open' : '_closed' ) : ( this.controller.mode == 'folders' ? '_closed' : '_doc') );
		if ($chk(l_iconImg))
			l_iconImg.inject(this.container.icon);
		// update the plus/minus gadget:
		this.container.gadget.empty();
		var l_gadgetImg = this.getImg( ( this.controller.grid ? ( this.controller.root == this ? ((!this.leaf) ? 'R' : '') : (this.last?'L':'T') ) : '') + ((!this.leaf) ? (this.open?'minus':'plus') : '') );
		if ($chk(l_gadgetImg))
			l_gadgetImg.inject(this.container.gadget);
		// show/hide subnodes:
		this.container.sub.style.display = this.open ? 'block' : 'none';
		this.controller.fireEvent('nodeimgupdate', this);
	},
	/**
	 * Creates a new image, in the form of HTML for a DIV element with appropriate style.
	 *	You should not need to manually call this method. (though if for some reason you want to, you can)
	 * @param name - the name of new image to create, defined by <this.iconStructure> or located in an external file.
	 * @returns The HTML for a new div Element.
	 * @private
	 */
	getImg: function(p_name) {		
		var i = 0;
		var l_imgElement = new Element('div', {
			'class': 'treeNodeImg'
		});
		if (p_name != '') {
			i = this.iconStructure.indexOf(p_name);	
			if (i == -1){
				i = 0;
			}
			l_imgElement.addClass(this.imgClass);
			l_imgElement.setStyle('background-position','-' + (i*this.iconSize) + 'px 0px');
		}
		return l_imgElement;	
	},
	/**
	 * By default (with no arguments) this function toggles the node between expanded/collapsed.
	 * Can also be used to recursively expand/collapse all or part of the tree.
	 * @param p_recursive - boolean, defaults to false. With recursive set to true, all child nodes are recursively toggle to this node's new state.
	 * @param p_state - boolean. If undefined, the node's state is toggled. If true or false, the node can be explicitly opened or closed.
	 */
	toggle: function(p_recursive, p_state) {		
		this._toggle(p_recursive, p_state);
		this.fireEvent('expand', [this.open, p_recursive]);
		this.controller.fireEvent('expand', [this, this.open, p_recursive]);		
	},
	/**
	 * Private method called by tree to toggle node without fire toggle event
	 * @param p_recursive - boolean, defaults to false. With recursive set to true, all child nodes are recursively toggle to this node's new state.
	 * @param p_state - boolean. If undefined, the node's state is toggled. If true or false, the node can be explicitly opened or closed.
	 * @private
	 */
	_toggle: function(p_recursive, p_state) {	
		this.open = (p_state == undefined ? !this.open : p_state);	
		this.updateNodeImg();
		if (p_recursive) this.nodes.forEach( function(node) {
			node.toggle(true, this.open);
		}, this);		
	},
	/**
	 * Called by <Tree> when the selection changes.
	 *	You should not manually call this method - to set the selection, use the <Tree.select> method.
	 */
	select: function(p_state) {
		this.selected = p_state;
		if (this.selected)
			this.container.main.addClass(this.selectedNodeClass);
		else
			this.container.main.removeClass(this.selectedNodeClass);
	},	
	/**
	 * Loads subtree starting from the node
	 */
	loadData: function(p_recursive) {
		this.controller.loadData(this, p_recursive);
	},
    /**
     * Sets the node options
     * @param p_options The object options that must be setted
     */
    setOptions: function(p_options){
    	for (var l_obj in p_options) {
			this[l_obj] = p_options[l_obj];
		}
    }
});

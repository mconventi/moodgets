/**
 * A useful plugin to create a selectable tree that considers constraints of dependences.
 * NOTE: this plugin doesn't consider the recursive constraints!
 * It uses the attribute "dependences" of nodes.
 * Moodgets library: A widgets library built on mootools.
 *
 * @name ConstrainedSelectionTreePlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a ConstrainedSelectionTreePlugin object passing the tree as parameter.
 */
var ConstrainedSelectionTreePlugin = new Class({
	Extends: TreePlugin,
	
	id: 'ConstrainedSelectionTreePlugin',
	
    /**
     * Returns the tree events used by the plugin
     * @private
     */
	getTreeEvents: function(){
		return {
			nodeupdate: this.onNodeUpdateHandler.bind(this),
			nodeimgupdate: this.onNodeUpdateHandler.bind(this),
			nodecreation: this.onNodeCreationHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onNodeCreationHandler: function(p_node){   
		if ($chk(p_node.parent)){
			p_node.checked = p_node.parent.checked;
			if (p_node.checked)
				this.addDependeces(this.tree.root, p_node.dependences);
		}
    },
    /**
     * @private
     */
    onNodeUpdateHandler: function(p_node){   
		if (!p_node.container.main.hasClass('treeLoaderNode')){
			p_node.container.icon.empty(); 		 
			var l_checkbox = new Checkbox(p_node.container.icon, {
				styles:{'float': 'left'},
				checked: p_node.checked
			});
			l_checkbox.dependences= p_node.dependences;
			l_checkbox.nodeId= p_node.id;
			l_checkbox.store('nodeid',p_node.id);
			l_checkbox.addClass('constraintSelectionCheckbox');
			l_checkbox.addEvent('check', this.onNodeCheckHandler.bind(this));
		}
    },
    /**
     * @private
     */
    onNodeCheckHandler: function(p_checkbox){ 	
		var l_checked_node = this.tree.get(p_checkbox.nodeId);
		l_checked_node.checked = p_checkbox.isChecked();
		if (!l_checked_node.leaf){
			this.checkChildren(l_checked_node, p_checkbox.isChecked());
		}
		if (p_checkbox.isChecked()){
			this.addDependeces(this.tree.root, p_checkbox.dependences);
		}else{
			this.removeDependeces(this.tree.root, p_checkbox.nodeId);
		}
    },
    /**
     * @private
     */
    addDependeces: function(p_rootNode, p_dependences){ 
		if(p_dependences && $type(p_dependences)=='array' && p_dependences.length > 0){			
			for (var i=0; i<p_dependences.length; i++){
				var l_node = this.tree.get(p_dependences[i]);
				l_node.checked = true;
				if ($chk(l_node)){
					var l_nodeCheck = l_node.container.icon.getElement('.constraintSelectionCheckbox');
					if (l_nodeCheck){
						l_nodeCheck.set('checked', true); 
					}
				}
			}
			
			for (var i=0; i<p_rootNode.nodes.length; i++){
				this.addDependeces(p_rootNode.nodes[i], p_dependences);
			}
		}
    },
    /**
     * @private
     */
    removeDependeces: function(p_rootNode, p_nodeId){ 
		
		if(p_rootNode.dependences && $type(p_rootNode.dependences)=='array' && p_rootNode.dependences.length > 0){		
			if (p_rootNode.dependences.indexOf(p_nodeId) != -1){
				var l_nodeCheck = p_rootNode.container.icon.getElement('.constraintSelectionCheckbox');
				p_rootNode.checked = false;
				if (l_nodeCheck){
					l_nodeCheck.set('checked', false); 
				}
			}
		}
			
		for (var i=0; i<p_rootNode.nodes.length; i++){
			this.removeDependeces(p_rootNode.nodes[i], p_nodeId);
		}
    },
    /**
     * @private
     */
    checkChildren: function(p_rootNode, p_state){ 
		if($chk(p_rootNode)){					
			for (var i=0; i<p_rootNode.nodes.length; i++){					
				var l_nodeCheck = p_rootNode.nodes[i].container.icon.getElement('.constraintSelectionCheckbox');
				p_rootNode.nodes[i].checked = p_state;
				if (l_nodeCheck){
					l_nodeCheck.set('checked', p_state); 
				}
				this.checkChildren(p_rootNode.nodes[i], p_state);
			}
		}
    }
});
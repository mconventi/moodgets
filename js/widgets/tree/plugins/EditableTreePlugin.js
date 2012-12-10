/**
 * A useful plugin to create an editable tree
 * Moodgets library: A widgets library built on mootools.
 *
 * @name EditableTreePlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a EditableTreePlugin object passing the tree as parameter.
 */
var EditableTreePlugin = new Class({
	Extends: TreePlugin,
	
	id: 'EditableTreePlugin',
	
    /**
     * Returns the tree events used by the plugin
     * @private
     */
	getTreeEvents: function(){
		return {
			beforetreecreation: this.onBeforeTreeCreationHandler.bind(this),
			nodecreation: this.onNodeCreationHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onBeforeTreeCreationHandler: function(){    	
    	if ($chk(this.tree)){
    		this.tree.topBar = new Toolbar(this.tree);
    		
    		var l_group = new Group(this.tree.topBar);
			this.addNodeBtn = new Button(l_group);
			this.addNodeBtn.addClass('addNodeBtn');
			this.addNodeBtn.setLabel(g_language.EditableTreePlugin.createBtnLbl);
			this.addNodeBtn.addEvent('click', this.onAddNodeBtnClickHandler.bind(this));
			
			new ButtonsSeparator(this.tree.topBar);		
			
    		l_group = new Group(this.tree.topBar);
			this.removeNodeBtn = new Button(l_group);
			this.removeNodeBtn.addClass('removeNodeBtn');
			this.removeNodeBtn.setLabel(g_language.EditableTreePlugin.deleteBtnLbl);
			this.removeNodeBtn.addEvent('click', this.onRemoveNodeBtnClickHandler.bind(this));
			
			new ButtonsSeparator(this.tree.topBar);		
			
    		var l_group = new Group(this.tree.topBar);
			this.editNodeBtn = new Button(l_group);
			this.editNodeBtn.addClass('editNodeBtn');
			this.editNodeBtn.setLabel(g_language.EditableTreePlugin.editBtnLbl);
			this.editNodeBtn.addEvent('click', this.onEditBtnClickHandler.bind(this));
			
			new ButtonsSeparator(this.tree.topBar);			
			
    		l_group = new Group(this.tree.topBar);
			this.saveTreeBtn = new Button(l_group);
			this.saveTreeBtn.addClass('saveTreeBtn');
			this.saveTreeBtn.setLabel(g_language.EditableTreePlugin.saveBtnLbl);
			this.saveTreeBtn.addEvent('click', this.onSaveTreeBtnClickHandler.bind(this));	
			new ButtonsSeparator(this.tree.topBar);			
			
    		l_group = new Group(this.tree.topBar);
			this.resetSubTreeBtn = new Button(l_group);
			this.resetSubTreeBtn.addClass('subTreeReset');
			this.resetSubTreeBtn.setLabel(g_language.EditableTreePlugin.resetBtnLbl);
			this.resetSubTreeBtn.addEvent('click', this.onResetSubTreeBtnClickHandler.bind(this));		
    	}  	     	
    },
    /**
     * @private
     */
    onEditBtnClickHandler: function(){ 		
		if ($chk(this.tree.dialog)){
			if ($chk(this.tree.selected)) {
				this.tree.dialog.addEvent('closestart', function(p_dialog) {
					if (p_dialog.onReturn){
						this.tree.disable(); // this stops visual updates while we're building the tree...
						var l_newValue = this.tree.dialog.PromptInput.get('value');
						if (!$chk(this.tree.selected.oldText)){
							this.tree.selected.oldText = this.tree.selected.text;
						}
						this.tree.selected.text = l_newValue;
						this.tree.selected.container.text.set('text', l_newValue);
						if (this.tree.selected.oldText != this.tree.selected.text)
							this.tree.selected.container.text.addClass('modified');
						else							
							this.tree.selected.container.text.removeClass('modified');
						this.tree.enable(); // this turns visual updates on again.
					}
					p_dialog.removeEvents('closestart');
				}.bind(this));
				this.tree.dialog.prompt(g_language.EditableTreePlugin.insertNodeTextMsg, this.tree.selected.container.text.get('text'));	
		    }else{
		    	this.tree.dialog.alert(g_language.EditableTreePlugin.selectParentNodeMsg);
		    }
		}
    },
    /**
     * @private
     */
    checkLoadedNode: function(p_node){
		if((!p_node.leaf)&&(p_node.nodes.length==0)){
			this.tree.dialog.addEvent('closestart', function(p_dialog) {
				if (this.tree.dialog.onReturn){
					this.tree.addEvent('beforerender', function(p_tree, p_loadedRootNode){
						p_tree.removeEvents('beforerender');
						this.onAddNodeBtnClickHandler();
					}.bind(this));
					this.tree.disable(); 
					p_node.loadData();
				}				
				this.tree.dialog.removeEvents('closestart');
			}.bind(this));
			this.tree.dialog.confirm(g_language.EditableTreePlugin.loadDataMsg);		
			return false;
		}	
		return true;
	},
    /**
     * @private
     */
    onRemoveNodeBtnClickHandler: function(){      	
		if ($chk(this.tree.dialog)){
			if ($chk(this.tree.selected)) {
				this.tree.dialog.addEvent('closestart', function(p_dialog) {
					this.deleteSubTree(this.tree.selected);
					this.tree.dialog.removeEvents('closestart');
				}.bind(this));
				this.tree.dialog.alert(g_language.EditableTreePlugin.deleteMsg);	
		    }else{
		    	this.tree.dialog.alert(g_language.EditableTreePlugin.noSelectedNodeMsg);
		    }
		}
    },
    /**
     * @private
     */
    onNodeCreationHandler: function(p_node){   
		if ($chk(p_node.parent) && p_node.parent.container.text.hasClass('deleted'))
			p_node.container.text.addClass('deleted');
    },
    /**
     * @private
     */
    onAddNodeBtnClickHandler: function(){      	
		if ($chk(this.tree.dialog)){
			if ($chk(this.tree.selected)) {
				if (this.checkLoadedNode(this.tree.selected)) {
					this.tree.dialog.addEvent('closestart', function(p_dialog) {
						if (p_dialog.onReturn){
							this.tree.disable(); // this stops visual updates while we're building the tree...
							var l_newNode = this.tree.selected.insert({
								text: this.tree.dialog.PromptInput.get('value')
							});							
							l_newNode.container.text.addClass('modified');
							this.tree.selected.leaf = false;
							this.tree.enable(); // this turns visual updates on again.
						}
						p_dialog.removeEvents('closestart');
					}.bind(this));
					this.tree.dialog.prompt(g_language.EditableTreePlugin.insertNodeTextMsg);	 
				}
		    }else{
		    	this.tree.dialog.alert(g_language.EditableTreePlugin.selectParentNodeMsg);
		    }
		}
    },
    /**
     * @private
     */
    deleteSubTree: function(p_rootNode){ 
		if (p_rootNode.id != this.tree.root.id){
			p_rootNode.container.text.addClass('deleted');
		}
		for (var i=0; i<p_rootNode.nodes.length; i++){
			this.deleteSubTree(p_rootNode.nodes[i]);
		}
    },
    /**
     * @private
     */
    onResetSubTreeBtnClickHandler: function(){      	
		if ($chk(this.tree.dialog)){
			if ($chk(this.tree.selected)) {
				this.tree.dialog.addEvent('closestart', function(p_dialog) {
					if (p_dialog.onReturn){
						this.resetSubTree(this.tree.selected);
					}
					this.tree.dialog.removeEvents('closestart');
				}.bind(this));
				this.tree.dialog.confirm(g_language.EditableTreePlugin.resetSubTreeMsg);	
		    }else{
		    	this.tree.dialog.alert(g_language.EditableTreePlugin.noSelectedNodeMsg);
		    }
		}
    },
    /**
     * @private
     */
    resetSubTree: function(p_rootNode){ 
		if ($chk(p_rootNode.id)){
			p_rootNode.container.text.removeClass('modified');
			p_rootNode.container.text.removeClass('deleted');
			if ($chk(p_rootNode.oldText))
				p_rootNode.text = p_rootNode.oldText;
			p_rootNode.update();
			
			for (var i=0; i<p_rootNode.nodes.length; i++){
				this.resetSubTree(p_rootNode.nodes[i]);
			}		
		}else{
			p_rootNode.clear();
			p_rootNode.remove();
		}
    },	
    /**
     * @private
     */
    onSaveTreeBtnClickHandler: function(){  
    	if(!$chk(this.tree.dialog)){
    		this.tree.dialog = new DialogBox(this.tree);
    	}
	    	
		this.tree.dialog.wait(g_language.EditableTreePlugin.savingMsg);
		//Find updated nodes
		this.updatedNodes = new Array();
		this.deletedNodes = new Array();
		this.findUpdatedNodes(this.tree.root);
		
		var l_params = {deleted: JSON.encode(this.deletedNodes), updated: JSON.encode(this.updatedNodes)};
		this.requestOptions.data = l_params;
		this.execRequest();
    },
	findUpdatedNodes: function(p_rootNode){
		if (p_rootNode.container.text.hasClass('modified')){
			this.updatedNodes.include({
				id: p_rootNode.id,
				text: p_rootNode.text,
				data: p_rootNode.data,
				parentId: ($chk(p_rootNode.parent) ? p_rootNode.parent.id : 1)
			});
		}
			
		if (p_rootNode.container.text.hasClass('deleted')){
			this.deletedNodes.include({
				id: p_rootNode.id,
				text: p_rootNode.text,
				data: p_rootNode.data,
				parentId: ($chk(p_rootNode.parent) ? p_rootNode.parent.id : 1)
			});
		}
		
		for (var i=0; i<p_rootNode.nodes.length; i++){
			this.findUpdatedNodes(p_rootNode.nodes[i]);
		}	
	},
    /**
     * @private
     */
	execRequest: function(){		
    	var l_remoteRequest = new Request(this.requestOptions);
    	l_remoteRequest.addEvent('success', this.onSaveSuccess.bind(this));
    	l_remoteRequest.addEvent('failure', this.onSaveFailure.bind(this));
    	l_remoteRequest.send();
	},
    /**
     * @private
     */
    onSaveSuccess: function(responseText, responseXML){
    	this.data = JSON.decode(responseText);
    	if(!$chk(this.tree.dialog)){
    		this.tree.dialog = new DialogBox(this.tree);
    	}
    	this.tree.dialog.info(g_language.EditableTreePlugin.saveSuccessMsg);
    	this.tree.loadData();
    },
    /**
     * @private
     */
    onSaveFailure: function(){   
    	if(!$chk(this.tree.dialog)){
    		this.tree.dialog = new DialogBox(this.tree);
    	}
    	this.tree.dialog.error(g_language.EditableTreePlugin.saveFailureMsg);
    }
});
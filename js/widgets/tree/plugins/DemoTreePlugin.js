/**
 * A simple demo tree plugin 
 * Moodgets library: A widgets library built on mootools.
 *
 * @name DemoTreePlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 * @use: create a DemoTreePlugin object passing the tree as parameter.
 */
var DemoTreePlugin = new Class({
	Extends: TreePlugin,
	
	id: 'DemoTreePlugin',
	
    /**
     * Returns the tree events used by the plugin
     * @private
     */
	getTreeEvents: function(){
		return {
			beforetreecreation: this.onBeforeTreeCreationHandler.bind(this),
			treecreation: this.onTreeCreationHandler.bind(this)
		}
	},
    /**
     * @private
     */
    onBeforeTreeCreationHandler: function(){    	
    	if ($chk(this.tree)){
    		this.tree.hasBottomBar= true;		
    	}  	     	
    },
    /**
     * @private
     */
    onTreeCreationHandler: function(){    	
    	if ($chk(this.tree)){
    		this.tree.bottomBar = new Toolbar(this.tree);
			
    		var l_group = new Group(this.tree.bottomBar);
			this.getSelectionBtn = new Button(l_group);
			this.getSelectionBtn.addClass('selectedNodeBtn');
			this.getSelectionBtn.setLabel('Selected Node');
			this.getSelectionBtn.addEvent('click', this.onGetSelectionBtnClickHandler.bind(this));
			
			new ButtonsSeparator(this.tree.bottomBar);			
			
    		l_group = new Group(this.tree.bottomBar);
			this.expandAllBtn = new Button(l_group);
			this.expandAllBtn.addClass('expandAllBtn');
			this.expandAllBtn.setLabel('Expand All');
			this.expandAllBtn.addEvent('click', this.onExpandAllBtnClickHandler.bind(this));
			
			new ButtonsSeparator(this.tree.bottomBar);			
			
    		l_group = new Group(this.tree.bottomBar);
			this.collapseAllBtn = new Button(l_group);
			this.collapseAllBtn.addClass('collapseAllBtn');
			this.collapseAllBtn.setLabel('Collapse All');
			this.collapseAllBtn.addEvent('click', this.onCollapseAllBtnClickHandler.bind(this));			
    	}  	     	
    },
    /**
     * @private
     */
    onGetSelectionBtnClickHandler: function(){      	
		if ($chk(this.tree.dialog)){
			if ($chk(this.tree.selected)) {
		    	this.tree.dialog.info(this.tree.selected.text);
		    }else{
		    	this.tree.dialog.alert(g_language.EditableTreePlugin.noSelectedNodeMsg);
		    }
		}
    },
    /**
     * @private
     */
    onExpandAllBtnClickHandler: function(){      
    	this.tree.expand();	
    },
    /**
     * @private
     */
    onCollapseAllBtnClickHandler: function(){      
    	this.tree.collapse();	
    }
});
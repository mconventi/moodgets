/**
 * Demo file for Moodgets library test: A widgets library built on mootools
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 */
window.addEvent('domready', function() {
    initDemo();
});

/**
 * Tree Creation with local defined data store
 */
function localLoading(p_tree){
	var l_dataStore = [
		{text:'Root Node', id:'0', children:[
			{text:'Subnode 1', id:'1'},
			{text:'Subnode 2', id:'2', open: false, children:[
				{text:'Subnode 2.1', id:'2.1', children: [
					{text:'Subnode 2.2.1', id:'2.2.1', children: [
						{text:'Subnode 2.2.1.1', id:'2.2.1.1', dependences:['2', '2.1', '2.2.1']}
					]}															
				]},
				{text:'Subnode 2.2', id:'2.2', dependences:['1', '2']},
				{text:'Subnode 2.3', id:'2.3'}
			]},
			{text:'Subnode 3', id:'3'},
			{text:'Subnode 4', id:'4'}
		]}
	 ];
	 
	p_tree.setDataStore(new DataStore(l_dataStore));
	p_tree.loadData();
}

/**
 * Manual creation "via javascript"
 */
function manualLoading(p_tree) {
	p_tree.disable(); // this stops visual updates while we're building the tree...
	var node1 = p_tree.insert({text:'Subnode 1', id:'1'});
	var node2 = p_tree.insert({text:'Subnode 2', id:'2'});
	var node3 = p_tree.insert({text:'Subnode 3', id:'3'});
	
	var node2_1 = node2.insert({text:'Subnode 2.1', id:'2.1'});
	var node2_2 = node2.insert({text:'Subnode 2.2', id:'2.2'});
	var node2_3 = node2.insert({text:'Subnode 2.3', id:'2.3'});
	
	var node2_2_1 = node2_2.insert({text:'Subnode 2.2.1', id:'2.2.1'});
	var node2_2_1_1 = node2_2_1.insert({text:'Subnode 2.2.1.1', id:'2.2.1.1'});	
	var node4 = p_tree.insert({text:'Subnode 4', id:'4'});
	p_tree.expand();
	
	p_tree.enable(); // this turns visual updates on again.
}

/** 
 * Tree loading with a remote data store
 */
function remoteLoading(p_tree){
	p_tree.setDataStore(new RemoteDataStore({requestOptions:{url: 'http://localhost:8081/moodgets/web/frontend_dev.php/demo_tree_panel/list'}})
);
	p_tree.addEvent('expand', function(p_treeNode, p_open, p_recursive){
		if((p_open)&&(!p_treeNode.leaf)&&(p_treeNode.nodes.length==0)){
			p_treeNode.loadData(p_recursive);
		}
	})
	p_tree.loadData();
}
			
function initDemo() {		   	
	var g_tree = new Tree($('tree'),{
		text: 'Root Node',
		id: 0
	},{ 
		treePlugins: [
			//new EditableTreePlugin({requestOptions:{url: 'http://localhost:8081/moodgets/web/frontend_dev.php/demo_tree_panel/update'}}),
			new DemoTreePlugin()
		]
	});
			   	
	var g_tree2 = new Tree($('tree2'),{
		text: 'Root Node',
		id: 0
	},{ 
		treePlugins: [
			new ConstrainedSelectionTreePlugin()
		]
	});
	//remoteLoading(g_tree);
	manualLoading(g_tree);
	localLoading(g_tree2);
};

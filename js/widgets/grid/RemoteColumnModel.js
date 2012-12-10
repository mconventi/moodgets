/**
 * A remote column model for Moodgets library: A widgets library built on mootools.
 * Used to define a grid columns structure.
 * Request the grid structure to the server.
 * It uses the requestOptions options to execute the request.
 *
 * Generates events:
 * - modelready When column model is loaded with success
 * - modelloadingfailure When the remote request failed
 *
 * @name RemoteColumnModel
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 */
var RemoteColumnModel = new Class({
	Extends: Events,
	
	requestOptions: {},
	defaultColumnWidth: 100,
	model: [],
	idColumn: null,
	numOfColumns: 0,
	/**
	 * Creates a column model that handles a remote connection to load data
	 * @param p_requestOptions An object containing the request params
     * @see The mootools Request object http://mootools.net/docs/Request/Request
	 * @constructor
	 */
    initialize: function(p_requestOptions){
    	this.requestOptions = p_requestOptions.requestOptions;
    },
    /**
     * Load the column model handling the remote connection
     */
    loadModel: function(){
    	var l_remoteRequest = new Request(this.requestOptions);
    	l_remoteRequest.addEvent('success', this.onSuccess.bind(this));
    	l_remoteRequest.addEvent('failure', this.onFailure.bind(this));
    	l_remoteRequest.send();
    },
    /**
     * On request success handler
     * @private
     */
    onSuccess: function(responseText, responseXML){
    	var l_responseObj = JSON.decode(responseText);
    	this.model = l_responseObj.model;
    	this.idColumn = l_responseObj.idColumn;
    	
    	if ($chk(this.model))
    		this.numOfColumns = this.model.length; 	
    	else
    		this.model = [];
    	this.fireEvent('modelready', this);
    },
    /**
     * On request failure handler
     * @private
     */
    onFailure: function(){
    	if(!$chk(this.grid.dialog)){
    		this.grid.dialog = new DialogBox(this.grid);
    	}
    	this.grid.dialog.error(g_language.RemoteColumnModel.loadFailureMsg);
    	this.fireEvent('modelloadingfailure', this);
    }
});
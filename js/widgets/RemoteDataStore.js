/**
 * A remote data store for Moodgets library: A widgets library built on mootools.
 *
 * Generates events:
 * - dataloaded When data is loaded with success
 * - dataloadingfailure When the remote request failed
 *
 * @name RemoteDataStore
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License
 */
var RemoteDataStore = new Class({
	Extends: Events,
	
	requestOptions: {},
	data: [] ,
	total: null,
	/**
	 * Creates a data store that handles a remote connection to load data
	 * @param p_requestOptions An object containing the request params
     * @see The mootools Request object http://mootools.net/docs/Request/Request
	 * @constructor
	 */
    initialize: function(p_requestOptions){
    	this.requestOptions = p_requestOptions.requestOptions;
    },
    /**
     * Load data from server
     * @param p_params Object containing the request params
     */
    loadData: function(p_params){
    	this.requestOptions.data = p_params;
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
    	this.data = l_responseObj.data;
    	this.total = l_responseObj.total;

    	if (!$chk(this.data)){
    		this.total = 0;	
    		this.data = [];
    	}
    	
    	this.fireEvent('dataloaded', this);
    },
    /**
     * On request failure handler
     * @private
     */
    onFailure: function(){
    	this.fireEvent('dataloadingfailure', this);
    }
});
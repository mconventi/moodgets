/**
 * The english language file. 
 * Contains all the labels used in the application.
 * Moodgets library: A widgets library built on mootools.
 *
 * @name language_en.js
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: link this file before all others in your page if you want an english version of your application.
 */
 g_language = {
	 DatePicker: {
	 	dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		splitter: '/',
		format: 'dd/mm/yyyy',
	 	monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	 },
	 Paginator: {
	 	pageLbl: 'Page ',
	 	pageOfLbl: ' of ',
	 	pageStatLbl: ['Displaying', 'to', 'of', 'items'],
	 	noItems: 'No items found'
	 },
	 EditableGridPlugin: {
		createBtnLbl: 'Add',
		deleteBtnLbl: 'Delete',
		saveBtnLbl: 'Save',
	 	deleteMsg: 'Note: the delete will be effect only after save',
	 	savingMsg: 'Saving data, wait please',
	 	saveSuccessMsg: 'Data saved correctly',
	 	saveFailureMsg: 'Attention, error during server connection',
	 	validationFailureMsg: 'Attention, not all fields can be validated',
	 	formValidatorLbls: {
	 		url:'Please enter a valid URL such as http://www.moodgets.com',
	 		email:'Please enter a valid email address. For example "fred@domain.com".',
	 		date:'Please enter a valid date such as DD/MM/YYYY (i.e. "31/12/1999")',
	 		alpha:'Please use letters only (a-z) with in this field. No spaces or other characters are allowed.',
	 		alphanum:'Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed.',
	 		required:'This field is required.',
	 		digits:'Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).',
	 		minLength:'Please enter at least {minLength} characters.',
	 		maxLength:'Please enter no more than {maxLength} characters.',
	 		integer:'Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.',
	 		numeric:'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").'
	 	}	 	
	 },
	 RemoteColumnModel: {
	 	loadFailureMsg: 'Attention, error during server connection'
	 },
	 RemoteDataStore: {
	 	loadFailureMsg: 'Attention, error during server connection'
	 },
	 Tree: {
	 	loaderText: 'Loading...',
	 	renderingFailureMsg: 'Attention, error during tree creation'
	 },
	 EditableTreePlugin: {
		createBtnLbl: 'Add',
		deleteBtnLbl: 'Delete',
		editBtnLbl: 'Edit Node',
		saveBtnLbl: 'Save Tree',
		resetBtnLbl: 'Reset',
	 	deleteMsg: 'Note: the delete will be effect only after save',
	 	resetSubTreeMsg: 'All changes will be cancelled, do you really want reset the selected node and the entire subtree',
	 	noSelectedNodeMsg: 'Attention, there are not selected nodes',
	 	insertNodeTextMsg: 'Insert the node text',
	 	selectParentNodeMsg: 'Attention, you have to select the parent node',
	 	loadDataMsg: 'Attention, the node is not loaded, do you want load it now',
	 	savingMsg: 'Saving data, wait please',
	 	saveSuccessMsg: 'Data saved correctly',
	 	saveFailureMsg: 'Attention, error during server connection'
	 },
	 RssReader: {
	 	loadFailureMsg: 'Attention, error during server connection',
	 	invalidRssResultMsg: 'Attention, the rss channel is not valid'
	 }
 }
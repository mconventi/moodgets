/**
 * A plugin useful to build an editable grid. 
 * Moodgets library: A widgets library built on mootools.
 *
 * In order to avoid to use the editable plugin on a row, the row must have the 'no-editable' class
 *
 * Generates events:
 * - edited(p_groupNode, p_inputValue) When a cell is edited
 *
 * @name EditableGridPlugin
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @license MIT Style License 
 * @use: create an EditableGridPlugin object passing the grid as parameter.
 * In the column model you can define a default validator option: 
 * - validate-url, 
 * - validate-email,
 * - validate-date,
 * - validate-alphanum,
 * - validate-alpha,
 * - validate-digits,
 * - validate-integer,
 * - validate-numeric,
 * - maxLength:10,
 * - minLength:10,
 * - required
 * @see http://mootools.net/docs/more/Forms/FormValidator#Validators
 */
var EditableGridPlugin = new Class({
	Extends: GridPlugin,
	
	id: 'EditableGridPlugin',
	rowIndex: 0,
	cellIndex: 0,
	hasCreateBtn: true,
	createBtn: null,
	hasDeleteBtn: true,
	undoDelete: true,
	deleteBtn: null,
	hasSaveBtn: true,
	saveBtn: null,
	form: null,
	formValidator: null,
	
    /**
     * Returns the grid events used by the plugin
     * @private
     */
	getGridEvents: function(){
		return {
			beforenewheader: this.onBeforeNewHeaderHandler.bind(this),
			beforerenderdata: this.onBeforeRenderDataHandler.bind(this),
			bodycreation: this.onBodyCreationHandler.bind(this),
			newrow: this.onNewRowHandler.bind(this),
			newcell: this.onNewCellHandler.bind(this)
		}
	},	
    /**
     * @private
     */
    onNewCellHandler: function(p_columnModel, p_cell, p_value){
    	var l_isEditableColumn = p_columnModel.isEditable;
    	var l_group = p_cell.getParent();
    	l_group.addEvent('cellresize', this.onCellResizeHandler.bind(this));
	  	p_cell.store('oldValue', p_value.toString());
	  	p_cell.store('isEditable', l_isEditableColumn);
    	if (p_value == '&nbsp;') p_value = '';
	  	if (l_isEditableColumn){
		  	if (p_columnModel.editableFieldType == "checkbox") {				
				var l_input = new Checkbox(l_group, {
					'class': 'hidden editableObj',
					'autoComplete': 'off'
				});
				var l_marginX = parseInt((p_columnModel.width - l_input.getStyle('width').toInt())/2);
				l_input.setStyle('margin-left', (Browser.Engine.trident ? l_marginX - 9 : l_marginX + 3));
				l_input.setStyle('margin-right', (Browser.Engine.trident ? l_marginX - 9 : l_marginX + 0));
				l_input.setStyle('margin-top', Browser.Engine.trident ? 5 : 5);
				l_input.setOptions(p_columnModel.options);
				l_input.setDefaultValue(p_value);
		  	}else if(p_columnModel.editableFieldType == "date"){
				var l_input = new DateInput(l_group, {
					'class': 'hidden editableObj',
					'autoComplete': 'off',
					name: this.rowIndex+'_'+p_columnModel.dataIndex,
					value: p_value
				});
				l_input.setStyle('width', p_columnModel.width-(Browser.Engine.trident ? 22 : 22)); 
		  	}else if(p_columnModel.editableFieldType == "select"){
				var l_input = new Select(l_group, {
					'class': 'hidden editableObj',
					'autoComplete': 'off'
				});
				l_input.setStyle('width', p_columnModel.width-2); 
				l_input.setDefaultValue(p_value);
				l_input.setOptions(p_columnModel.options);
		  	}else{
				var l_input = new Input(l_group, {
					'class': 'hidden editableObj',
					'autoComplete': 'off',
					'value': p_value
				});
				l_input.setStyle('width', p_columnModel.width-(Browser.Engine.trident ? 8 : 6)); 
			}
			if (!l_group.getParent().hasClass('no-editable')){
				if ($chk(p_columnModel.validator))
					l_input.addClass(p_columnModel.validator);					
				l_input.set('tabindex', this.cellIndex);
				l_input.addEvent('tabkey', this.onTabKeyHandler.bind(this));
				l_input.addEvent('click', function(evt){evt.stopPropagation();});
				l_input.addEvent('dblclick', function(evt){evt.stopPropagation();});
			}
		}
		this.cellIndex++;
    },
    /**
     * @private
     */
    onBeforeNewHeaderHandler: function(){  
    	if ((!this.grid.topBar)&&(this.hasCreateBtn || this.hasDeleteBtn || this.hasSaveBtn)){
    		this.grid.topBar = new Toolbar(this.grid);
    	}  	 
    	
    	if (this.hasCreateBtn){
    		var l_group = new Group(this.grid.topBar);
			this.createBtn = new Button(l_group);
			this.createBtn.setLabel(g_language.EditableGridPlugin.createBtnLbl);
			this.createBtn.addClass('createRowBtn');
			this.createBtn.addEvent('click', this.onCreateBtnClickHandler.bind(this));
    	}
    	if (this.hasDeleteBtn){
    		var l_group = new Group(this.grid.topBar);
			this.deleteBtn = new Button(l_group);
			this.deleteBtn.setLabel(g_language.EditableGridPlugin.deleteBtnLbl);
			this.deleteBtn.addClass('deleteRowBtn');
			this.deleteBtn.addEvent('click', this.onDeleteBtnClickHandler.bind(this));
    	} 
    	if (this.hasSaveBtn){
    		var l_group = new Group(this.grid.topBar);
			this.saveBtn = new Button(l_group);
			this.saveBtn.setLabel(g_language.EditableGridPlugin.saveBtnLbl);
			this.saveBtn.addClass('saveRowBtn');
			this.saveBtn.addEvent('click', this.onSaveBtnClickHandler.bind(this));
    	}  	 	
    	this.form = new Element('form');
    	this.form.wraps(this.grid);
    },
    /**
     * @private
     */
    onBodyCreationHandler: function(){ 
    	this.formValidator = new FormValidator(this.form, {
    		evaluateFieldsOnChange: true,
    		onElementPass: this.onElementValidationPassHandler.bind(this),
    		onElementFail: this.onElementValidationFailHandler.bind(this)
    	});  
    	MooTools.lang.set("en-US","FormValidator",g_language.EditableGridPlugin.formValidatorLbls);
    },
    /**
     * @private
     */
    onElementValidationPassHandler: function(p_element){ 
    	p_element.getParent().removeClass('invalidElement');
    	p_element.getParent().set('title', '');
    },
    /**
     * @private
     */
    onElementValidationFailHandler: function(p_element, p_validators){ 
    	p_element.getParent().addClass('invalidElement');
    	//Keep the first part
    	var l_validatorId = p_validators[0].split(' ')[0].split(':')[0];
    	if (l_validatorId.contains('-')){
    		l_validatorId = l_validatorId.split('-').getLast();
    	}
    	if ((l_validatorId == 'minLength')||(l_validatorId == 'maxLength')){
    		var l_errorObj = JSON.decode('{'+p_validators[0]+'}');
    		p_element.getParent().set('title', g_language.EditableGridPlugin.formValidatorLbls[l_validatorId].substitute(l_errorObj));
    	}else{
    		p_element.getParent().set('title', g_language.EditableGridPlugin.formValidatorLbls[l_validatorId]);
    	}
    },
    /**
     * @private
     */
    onCreateBtnClickHandler: function(){ 
		var l_firstEditableObj = null;
		
		var l_row = new Element('li');
		l_row.setStyle('width', this.grid.sumWidth+2*this.grid.visibleColumns);	// + 2*this.visibleColumns to consider the cells width
		
		var l_bodyTreeElement = this.grid.bodyElement.getElement('ul.gridBodyTree');
		if (!$chk(l_bodyTreeElement)){
			l_bodyTreeElement = new Element('ul');
			l_bodyTreeElement.addClass('gridBodyTree');
			l_bodyTreeElement.inject(this.grid.bodyElement);
		}
		l_row.inject(l_bodyTreeElement, 'top');
		this.grid.fireEvent('newrow', l_row);	
					
		var l_columnCount = this.grid.columnModel.numOfColumns;
		for (var c=0; c<l_columnCount; c++) {
			var l_columnModel = this.grid.columnModel.model[c];
			
			var l_group = new Group(l_row);	//A group div is used to allow to add elements into the cell	
						
			var l_cell = new Element('div');
			l_cell.addClass('td');		
			if ($chk(l_columnModel.additionalClass)){
				l_cell.addClass(l_columnModel.additionalClass);
			}
			l_cell.setStyle('width', l_columnModel.width); 
			l_cell.inject(l_group);					
			if (l_columnModel.hidden) l_cell.setStyle('display', 'none');
			var l_cellValue = '&nbsp;';												
			if ($chk(l_columnModel.defaultValue))
				l_cellValue = l_columnModel.defaultValue;						
			l_cell.set('html', l_cellValue);
			l_cell.store('value', l_cellValue);
			
			this.grid.fireEvent('newcell', [l_columnModel, l_cell, l_cellValue]);	
			if (!$chk(l_firstEditableObj)&&(l_columnModel.isEditable)&&(!l_columnModel.hidden)){
				l_firstEditableObj = l_group;
			}			
		} // for column	
		
		this.grid.rows = l_bodyTreeElement.getElements('li');
		
		//Set the focus at the first editable obj
		if ($chk(l_firstEditableObj)){
			this.resetEditableColumns();
			this.toggleEditableCell(l_firstEditableObj);
		}
    },
    /**
     * @private
     */
    onDeleteBtnClickHandler: function(){   
    	//Find selected rows
    	var l_bodyTree = this.grid.bodyElement.getElement('ul.gridBodyTree');
    	if ($chk(l_bodyTree)){
	    	if(!$chk(this.grid.dialog)){
	    		this.grid.dialog = new DialogBox(this.grid);
	    	}
	    	this.grid.dialog.addEvent('closestart', function(p_dialog) {
		    	if (p_dialog.onReturn){
   					var l_selectedRows = l_bodyTree.getElements('li.selected');
		    		for (var i = 0; i < l_selectedRows.length; i++){
		    			l_selectedRows[i].removeClass('selected');
		    			l_selectedRows[i].addClass('deleted');
		    		}	
	    		}
		    	p_dialog.removeEvents('closestart');
		    }.bind(this));
    		this.grid.dialog.alert(g_language.EditableGridPlugin.deleteMsg);
    	}    	
    },
    /**
     * @private
     */
    onSaveBtnClickHandler: function(){  
    	if(!$chk(this.grid.dialog)){
    		this.grid.dialog = new DialogBox(this.grid);
    	}
	    	
	    if (this.formValidator.validate()){
	    	this.grid.dialog.wait(g_language.EditableGridPlugin.savingMsg);
	    	//Find updated rows
	    	var l_bodyTree = this.grid.bodyElement.getElement('ul.gridBodyTree');
	    	if ($chk(l_bodyTree)){
	    		// Check deleted rows
	    		var l_deletedRows = l_bodyTree.getElements('li.deleted');
	    		var l_deletedRecords = new Array();
	    		for (var i = 0; i < l_deletedRows.length; i++){
	    			var l_cells = l_deletedRows[i].getElements('.td');
	    			var l_record  = {};
	    			for (var j = 0; j < l_cells.length; j++){
	    				l_record[this.grid.columnModel.model[j].dataIndex] = l_cells[j].retrieve('value');
	    			}
	    			l_deletedRecords.include(l_record);
	    		}
	    		// Check updated rows
	    		var l_updatedRecords= new Array();
	    		var l_rows = l_bodyTree.getElements('li');
	    		for (var i = 0; i < l_rows.length; i++){
	    			var l_row = l_rows[i];
	    			if ((!l_row.hasClass('deleted'))&&(l_row.getElement('.modifiedCell'))){
		    			var l_cells = l_row.getElements('.td');
		    			var l_record  = {};
		    			for (var j = 0; j < l_cells.length; j++){
		    				l_record[this.grid.columnModel.model[j].dataIndex] = l_cells[j].retrieve('value');
		    			}
		    			l_updatedRecords.include(l_record);
	    			}    			
	    		}
	    		var l_params = {deleted: JSON.encode(l_deletedRecords), updated: JSON.encode(l_updatedRecords)};
	    		this.requestOptions.data = l_params;
		    	this.execRequest();
	    	}
    	}else{    	
    		this.grid.dialog.alert(g_language.EditableGridPlugin.validationFailureMsg);
    	}
    },
    /**
     * @private
     */
    onBeforeRenderDataHandler: function(){    	
		this.rowIndex = 0;
		this.cellIndex = 0;
    },
    /**
     * @private
     */
    onNewRowHandler: function(p_row){    	
		if (!p_row.hasClass('no-editable')){
			p_row.addEvent('dblclick', this.cellEditHandler.bind(this));
			p_row.addEvent('enterkey', this.cellEditHandler.bind(this));
		}
		this.rowIndex++;
		this.cellIndex = 0;
    },
    /**
     * @private
     */
    onCellResizeHandler: function(p_group, p_oldWidth, p_newWidth){
    	var l_inputObj = p_group.getElement('.editableObj');
    	var l_widthOffset = p_newWidth - p_oldWidth;
		if ($chk(l_inputObj)){
			if (l_inputObj.retrieve('noResize')){
				l_widthOffset = parseInt(l_widthOffset/2);
				l_inputObj.setStyle('margin-left', l_inputObj.getStyle('margin-left').toInt()+l_widthOffset);
				l_inputObj.setStyle('margin-right', l_inputObj.getStyle('margin-right').toInt()+l_widthOffset);
			}else{
				l_newWidth = l_inputObj.getStyle('width').toInt() + l_widthOffset;
				if(l_newWidth > 0)
					l_inputObj.setStyle('width', l_newWidth);
			}
		}
    },
    /**
     * @private
     */
    cellEditHandler: function (evt){	
		var l_groupNode = evt.target.getParent();
		
		var td = l_groupNode.getElement('.td');
		if ($chk(td))
			var l_isEditable = td.retrieve('isEditable');
		else
			var l_isEditable = false;
			
		this.resetEditableColumns(l_groupNode);
		if ($chk(l_isEditable)&&(l_isEditable)){
			this.toggleEditableCell(l_groupNode);
		}
	},	
    /**
     * @private
     */
    onTabKeyHandler: function (evt){	
    	//Pass the keytab to the next editable object if it exists
		var l_groupNode = evt.target.getParent();
		var l_nextGroup = l_groupNode.getNext();
		if($chk(l_nextGroup)){
			l_nextGroup = this.getNextEditableObj(l_nextGroup);
		}else{
			//Check on the next line
			var l_row = l_groupNode.getParent();
			l_nextRow = l_row.getNext();
			if($chk(l_nextRow)&&(!l_nextRow.hasClass('no-editable'))){	
				l_nextGroup = l_nextRow.getElement('.group');
				l_nextGroup = this.getNextEditableObj(l_nextGroup);
			}
		}		
		
		if($chk(l_nextGroup)){
			this.toggleEditableCell(l_groupNode);
			this.toggleEditableCell(l_nextGroup);			
			evt.stop();
		}else{
			this.toggleEditableCell(l_groupNode);
		}
	},	
    /**
     * Returns a group object
     * @private
     */
	getNextEditableObj: function(p_groupNode){
		if (!$chk(p_groupNode))
			return null;
		var l_editableObj = p_groupNode.getElement('.editableObj');
		if ($chk(l_editableObj)){
 			return l_editableObj.getParent();
 		}else{
	   		var l_allNext = p_groupNode.getAllNext();
	   		for (var i = 0; i < l_allNext.length; i++){
	   			var l_editableObj = l_allNext[i].getElement('.editableObj');
	   			if ($chk(l_editableObj)){
	   				return l_editableObj.getParent();
	   			}
	   		}
   		}
   		return null;
   	},
    /**
     * @private
     */
	toggleEditableCell: function(p_groupNode){
	
		var td = p_groupNode.getElement('.td');
		var input = p_groupNode.getElement('.editableObj');
		if ($chk(input)){	
			input.toggleClass('hidden');
			input.toggleClass('visible');
			if (!input.hasClass('hidden')){
				input.focus();
			}
			td.toggleClass('hidden');
			
			l_inputValue = input.get('value');
			l_inputValue = l_inputValue.trim();
			if ((l_inputValue == null)||(l_inputValue.length == 0))
				l_inputValue = '&nbsp;';
				
			var l_oldValue = td.retrieve('oldValue');
			if(l_inputValue == l_oldValue){
				p_groupNode.removeClass('modifiedCell');
			}else{
				p_groupNode.addClass('modifiedCell');
			}
			var l_previousValue = td.get('html');
			
			td.set('html', l_inputValue);
			td.store('value', l_inputValue);
			if (input.hasClass('hidden')&&this.formValidator.validateField(input)){
				p_groupNode.fireEvent('edited', [p_groupNode, l_inputValue]);
			}
		}
	},
    /**
     * @private
     */
	resetEditableColumns: function(p_exception){
		var l_editableObjs = this.grid.bodyElement.getElements('.editableObj.visible');
		for (var i=0; i<l_editableObjs.length; i++){		
			var l_groupNode = l_editableObjs[i].getParent();
			if(!p_exception||(p_exception!=l_groupNode)){
				this.toggleEditableCell(l_groupNode);
			}
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
    	if(!$chk(this.grid.dialog)){
    		this.grid.dialog = new DialogBox(this.grid);
    	}
    	this.grid.dialog.info(g_language.EditableGridPlugin.saveSuccessMsg);
    	this.grid.loadData();
    },
    /**
     * @private
     */
    onSaveFailure: function(){   
    	if(!$chk(this.grid.dialog)){
    		this.grid.dialog = new DialogBox(this.grid);
    	}
    	this.grid.dialog.error(g_language.EditableGridPlugin.saveFailureMsg);
    }
});
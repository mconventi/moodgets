/**
 * Dialog Box - for moodgets. Clone class of original javascript function : 'alert', 'confirm' and 'prompt' 
 * @name DialogBox
 * @author Maurizio Conventi conventi@inwind.it http://www.moodgets.com
 * @inspired and based on by Eduardo D. Sada 'SexiAlert'
 * @license MIT Style License
 * @thanks to Eduardo D. Sada
 * @features:
 * * Chain Implemented
 * * More styles (info, error, alert, prompt, confirm)
 * * ESC would close the window
 * * Focus on a default button
 * @attributes:
 * 	name - name of the box for use different style
 *	zIndex - integer, zindex of the box
 *	onReturn - return value when box is closed. defaults to false
 *	BoxStyles - stylesheets of the box
 *	OverlayStyles - stylesheets of overlay
 *	showDuration - duration of the box transition when showing (defaults to 200 ms)
 *	showEffect - transitions, to be used when showing
 *	closeDuration - Duration of the box transition when closing (defaults to 100 ms)
 *	closeEffect - transitions, to be used when closing
 */
var DialogBox = new Class({
	Extends: Widget,
	Implements: [Chain],

	name            : 'DialogBox',
	zIndex          : 65555,
	onReturn        : false,
	BoxStyles       : { 'width': 500 },
	OverlayStyles   : { 'background-color': '#000', 'opacity': 0.7 },
	showDuration    : 200,
	showEffect      : Fx.Transitions.linear,
	closeDuration   : 100,
	closeEffect     : Fx.Transitions.linear,
	moveDuration    : 500,
	moveEffect      : Fx.Transitions.Back.easeOut,

	/**
	 * Creates the element into the parent and sets the object options
	 * @param p_parent The parent element
	 * @param p_options The object options
	 * @constructor
	 */
	initialize: function(p_parent, p_options) {
    	this.i=0;
    	
		this.setOptions(p_options);
		this.parent('div', p_parent, {
			'id'    : 'BoxOverlay',
			'styles': {
				'display'           : 'none',
				'position'          : 'absolute',
				'top'               : '0',
				'left'              : '0',
				//'opacity'           : 0,
				'z-index'           : this.zIndex,
				'background-color'  : this.OverlayStyles['background-color'],
				'height'            : p_parent.getStyle('height'),
				'width'             : p_parent.getStyle('width')
			}
		});
		this.Overlay = this.element;
		this.Content = new Element('div', {
			'id': this.name + '-BoxContainer'
		});

	    this.Container = new Element('div', {
	      'id': this.name + '-BoxContent'
	    }).adopt(this.Content);

		this.InBox = new Element('div', {
			'id': this.name + '-InBox'
		}).adopt(this.Container);
		
		this.Box = new Element('div', {
			'id': this.name + '-Box',
			'styles': {
				'display': 'none',
				'z-index': this.zIndex + 2,
				'position': 'absolute',
				'top': '0',
				'left': '0',
				'width': this.BoxStyles['width'] + 'px'
			}
		}).adopt(this.InBox);

	    this.Box.injectInside(p_parent);
	
	    this.preloadImages();
    
		window.addEvent('resize', function() {
			if(this.display == 1) {
				this.Overlay.setStyles({
					'height': p_parent.getStyle('height'),
					'width': p_parent.getStyle('width')
				});
				this.replaceBox();
			}
		}.bind(this));
		
		this.Box.addEvent('keydown', function(event) {
	        if (event.key == 'esc'){
	          this.onReturn = false;
	          this.hide();
	        }
	    }.bind(this));
		
		window.addEvent('scroll', this.replaceBox.bind(this));
	},

    /**
     * @private
     */
  preloadImages: function() {
    var img = new Array(2);
    img[0] = new Image();img[1] = new Image();img[2] = new Image();
    img[0].src = this.Box.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
    img[1].src = this.InBox.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
    img[2].src = this.Container.getStyle('background-image').replace(new RegExp("url\\('?([^']*)'?\\)", 'gi'), "$1");
  },


    /**
     * @private
     */
  togFlashObjects: function(state) {
    var hideobj=new Array("embed", "iframe", "object");
    for (y = 0; y < hideobj.length; y++) {
     var objs = document.getElementsByTagName(hideobj[y]);
     for(i = 0; i < objs.length; i++) {
      objs[i].style.visibility = state;
     }
    }
  },


	/**
	 *	Show box
	 */	
	show: function(){
		if(this.Transition)
			this.Transition.cancel();				

      if(Browser.Engine.trident4)
        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'hidden' });
        
      this.togFlashObjects('hidden');

			this.Overlay.setStyle('display', 'block');
			this.display = 1;
			this.fireEvent('showstart', [this]);

			this.Transition = new Fx.Tween(this.Overlay,
				{
					property: 'opacity',
					duration: this.showDuration,
					transition: this.showEffect,
					onComplete: function() {

						sizes = this.getParent().getSize();
						scrollito = window.getScroll();

						this.Box.setStyles({
							'display': 'block',
							'left': (scrollito.x + (sizes.x - this.BoxStyles['width']) / 2).toInt()
						});

						this.replaceBox();
						this.fireEvent('showcomplete', [this]);
					}.bind(this)
				}
			).start(this.OverlayStyles['opacity']);
			

	},
	/**
	 *	Hide box
	 */	
	hide: function(){	

      if(Browser.Engine.trident4)
        $$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'visible' });

      this.togFlashObjects('visible');

      this.queue.delay(500,this);

		this.Box.setStyles({
			'display': 'none',
			'top': 0
		});
		this.Content.empty();
		this.display = 0;
	
		this.fireEvent('closestart', [this]);

      if(this.i==1) {
       this.Transition = new Fx.Tween(this.Overlay,
          {
            property: 'opacity',
            duration: this.closeDuration,
            transition: this.closeEffect,
            onComplete: function() {
                this.fireEvent('closecomplete', [this]);
            }.bind(this)
          }
        ).start(0);
      }
	},

	/**
	 *	Move Box in screen center when brower is resize or scroll
	 */
	replaceBox: function() {
		if(this.display == 1) {
			sizes = this.getParent().getSize();
      scrollito = window.getScroll();

			if(this.MoveBox)
				this.MoveBox.cancel();
			
			this.MoveBox = new Fx.Morph(this.Box, {
				duration: this.moveDuration,
				transition: this.moveEffect
			}).start({

				'left': (scrollito.x + (sizes.x - this.BoxStyles['width']) / 2).toInt(),
				'top': (scrollito.y + (sizes.y - this.Box.offsetHeight) / 2).toInt()

			});
			
      this.focusin.delay(this.moveDuration,this);
			
		}
	},

    /**
     * @private
     */
  focusin: function() {
    if ($chk($('BoxAlertBtnOk'))) {
      $('BoxAlertBtnOk').focus();
    } else if ($chk($('BoxPromptInput'))) {
        $('BoxPromptInput').focus();
    } else if ($chk($('BoxConfirmBtnOk'))) {
      $('BoxConfirmBtnOk').focus();
    }
  },

    /**
     * @private
     */
	queue: function() {
		this.i--;
		this.callChain();
	},


	/**
	 * Property: messageBox
	 *	Core system for show all type of box
	 *	
	 * Argument:
	 *	type - string, 'alert' or 'confirm' or 'prompt'
	 *	message - text to show in the box
	 *	properties - see Options below
	 *	input - text value of default 'input' when prompt
	 *	
	 * Options:
	 *	textBoxBtnOk - text value of 'Ok' button
	 *	textBoxBtnCancel - text value of 'Cancel' button
	 *	onComplete - a function to fire when return box value
     * @private
	*/	
	messageBox: function(type, message, properties, input) {

		this.chain(function () {

		properties = $extend({
		  'textBoxBtnOk': 'OK',
		  'textBoxBtnCancel': 'Cancel',
		  'textBoxInputPrompt': null,
		  'password': false
		}, properties || {});
				
		this.ButtonsContainer = new Element('div', {      
		  'id': this.name + '-Buttons',
		  'styles': {
		    'text-align': 'right'
		  }
		});
      
		//Table used to distribute the buttons to the right
		var l_table = new Element('table', {'width':'100%'});
		l_table.inject(this.ButtonsContainer);
		var tbody = new Element("tbody");
		tbody.inject(l_table);          
		var l_row = new Element('tr', {'align':'right'});
		l_row.inject(tbody);
		var l_firstColumn = new Element('td');
		l_firstColumn.inject(l_row);
      
      if (type == 'wait'){
          this.className = 'BoxAlert';        
          this.Content.setProperty('class',this.className).set('html',message);
		  this.ButtonsContainer.injectInside(this.Content);
		  this.ButtonsContainer.setStyle('height', '50px');
          this.show();
      }else if(type == 'alert' || type == 'info' || type == 'error'){
          this.AlertBtnOk = new Button(l_firstColumn, {
            'id': 'BoxAlertBtnOk',
            'class': 'okBtn'
          });
          
          this.AlertBtnOk.addEvent('click', function() {
            this.onReturn = true;
            this.hide();
          }.bind(this));
        
          if(type == 'alert')
            this.className = 'BoxAlert';
          else if(type == 'error')
            this.className = 'BoxError';
          else if(type == 'info')
            this.className = 'BoxInfo';
        
          this.Content.setProperty('class',this.className).set('html',message);
          
          this.ButtonsContainer.injectInside(this.Content);
          this.show();
      }
      else if(type == 'confirm') {
          this.Content.setProperty('class','BoxConfirm').set('html',message);
          
          this.ConfirmBtnOk = new Button(l_firstColumn, {
            'id': 'BoxConfirmBtnOk',
            'class': 'okBtn'
          });

      	  var l_secondColumn = new Element('td', {'width':'20px'});
      	  l_secondColumn.inject(l_row);
          this.ConfirmBtnCancel = new Button(l_secondColumn, {
            'id': 'BoxConfirmBtnCancel',
            'class': 'cancelBtn'
          });
          
          this.ConfirmBtnOk.addEvent('click', function() {
            this.onReturn = true;
            this.hide();
          }.bind(this));

          this.ConfirmBtnCancel.addEvent('click', function() {
            this.onReturn = false;
            this.hide();
          }.bind(this));

		  this.ButtonsContainer.injectInside(this.Content);
          this.show();
      }
      else if(type == 'prompt')
      {
          this.PromptBtnOk = new Button(l_firstColumn, {
            'id': 'BoxPromptBtnOk',
            'class': 'okBtn'
          });

      	  var l_secondColumn = new Element('td', {'width':'20px'});
      	  l_secondColumn.inject(l_row);
          this.PromptBtnCancel = new Button(l_secondColumn, {
            'id': 'BoxPromptBtnCancel',
            'class': 'cancelBtn'
          });
          
          type = properties.password ? 'password' : 'text';
          this.PromptInput = new Element('input', {
            'id': 'BoxPromptInput',
            'type': type,
            'value': input,
            'styles': {
              'width': '370px'
            }
          });
          
          this.PromptBtnOk.addEvent('click', function() {
            this.onReturn = this.PromptInput.value;
            this.hide();
          }.bind(this));

          this.PromptBtnCancel.addEvent('click', function() {
            this.onReturn = false;
            this.hide();
          }.bind(this));

          this.Content.setProperty('class','BoxPrompt').set('html',message + '<br />');
          this.PromptInput.injectInside(this.Content);
          new Element('br').injectInside(this.Content);


          this.ButtonsContainer.injectInside(this.Content);

          this.show();
      }
      else
      {
          this.onReturn = false;
          this.displayBox(0);		
      }
		
    });

		this.i++;

		if(this.i==1) this.callChain();

	},

	/**
	 *	Show an alert with a conferm button
	 *	
	 *  @param message A string containing the message to show
	 *  @param properties The properties object
	 */		
	alert: function(message, properties){
		this.messageBox('alert', message, properties);
	},
	
	/**
	 *	Show an info box with a conferm button
	 *	
	 *  @param message A string containing the message to show
	 *  @param properties The properties object
	 */		
	info: function(message, properties){
		this.messageBox('info', message, properties);
	},

	/**
	 *	Show an error box with a conferm button
	 *	
	 *  @param message A string containing the message to show
	 *  @param properties The properties object
	 */			
	error: function(message, properties){
		this.messageBox('error', message, properties);
	},
	
	/**
	 *	Show a confirm dialog with a conferm and cancel buttons
	 *	
	 *  @param message A string containing the message to show
	 *  @param properties The properties object
	 */		
	confirm: function(message, properties){
		this.messageBox('confirm', message, properties);
	},
	
	/**
	 *	Show a prompt dialog with input element, conferm and cancel buttons
	 *	
	 *  @param message A string containing the message to show
	 *  @param input The input element value
	 *  @param properties The properties object
	 */		
	prompt: function(message, input, properties){
		this.messageBox('prompt', message, properties, input);
	},
	
	/**
	 *	Show a wait box
	 *	
	 *  @param message A string containing the message to show
	 *  @param properties The properties object
	 */		
	wait: function(message, properties){      
		this.ButtonsContainer = new Element('div', {      
		  'id': this.name + '-Buttons',
		  'styles': {
		    'text-align': 'right'
		  }
		});
      
		this.className = 'BoxWait';        
		this.Content.setProperty('class',this.className).set('html',message);
		this.ButtonsContainer.injectInside(this.Content);
		this.ButtonsContainer.setStyle('height', '50px');
		this.show();
	}
});
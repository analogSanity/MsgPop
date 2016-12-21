/*!
 *  MsgPop by Anthony J. Laurene - 10/1/2014
 *  License - (JS: MIT License, CSS: MIT License)
 */
var MsgPop = initMsgPop();

function initMsgPop()
{
	MsgPop = {};
	
	//Public properties
	MsgPop.effectSpeed = 350;
	MsgPop.limit = 4;
	MsgPop.displaySmall = false;
	MsgPop.position = "top-right";
	
	//Protected properties
	var msgPopCount = 0;
	var msgPopActionID = 0;
	var msgPopContainer, closeAllBtn, loadMoreBtn;
	
	//Browser check
	var deviceAgent = navigator.userAgent.toLowerCase();
	var notMobile = (deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/)) ? false : true;
	
	window.addEventListener("resize", moveAnchoredMessages);		

	function moveAnchoredMessages(){
		for (var property in MsgPop) {
			if (MsgPop.hasOwnProperty(property) && property.indexOf("msgPop") !== -1 && MsgPop[property]["AnchorTo"] != null) {
				var msg = document.getElementById(MsgPop[property]['MsgID']);
				var anchor = document.getElementById(MsgPop[property]['AnchorTo']);
				if(msg!=null){
					msg.style.left = anchor.offsetLeft-16+'px';
				}
			}
		}
	}
	
	//Protected Methods
	var	createContainer = function(){
	    container = document.getElementById('msgPopContainer');

	    if (container == null)
	    {
	        container = document.createElement('div');
	        container.setAttribute('id','msgPopContainer');
	        if (document.body != null) {
	           document.body.appendChild(container);
	        }
	        else {
	            document.addEventListener('DOMContentLoaded', function () {
	                document.body.appendChild(container);
	            });
	        }
	    }

		if(MsgPop.displaySmall && notMobile){
			container.setAttribute('class','msgPop-'+MsgPop.position+' msgPopContainerSmall msgPopContainerOverflow');
		}
		else{
			container.setAttribute('class','msgPop-top-right');
		}
		
		return container;
	}
	var createLoadMore = function (container) {
	    var msgMoreBtn = document.getElementById('msgDivMore');

	    if (msgMoreBtn == null) {
			msgMoreBtn = document.createElement('div');
			msgMoreBtn.setAttribute('id','msgDivMore');
			msgMoreBtn.setAttribute('class','msgPopLoadMore');
			msgMoreBtn.innerHTML = '<span onclick="javascript:MsgPop.showMoreMessages();">=== Load More Messages ===</span>';
						
			container.appendChild(msgMoreBtn);
		}
		
		return msgMoreBtn;
	}
	var createCloseAll = function (container) {
	    var msgDivCloseAll = document.getElementById('msgPopCloseAllBtn');

	    if (msgDivCloseAll == null)
	    {
	        msgDivCloseAll = document.createElement('div');
	        msgDivCloseAll.setAttribute('type', 'button');
	        msgDivCloseAll.setAttribute('id', 'msgPopCloseAllBtn');
	        msgDivCloseAll.setAttribute('onclick', 'MsgPop.closeAll()');
	        msgDivCloseAll.innerHTML = 'Close All Messages';

	        container.appendChild(msgDivCloseAll);
	    }

		return msgDivCloseAll;
	}
	var closeLogic = function(obj, message){
	    if (typeof obj["BeforeClose"] === "function") 
		{
			obj.BeforeClose()
		}

	    animate(message, MsgPop.effectSpeed).close(function () {
	        if(message.parentNode != null){
	            message.parentNode.removeChild(message);
	        }

			if (typeof obj["AfterClose"] === "function") {
				obj.AfterClose();
			}

	        if (msgPopCount == 0 && msgPopContainer.parentNode != null) {
	            msgPopContainer.parentNode.removeChild(msgPopContainer);
	        }
		});

		msgPopCount = ((msgPopCount - 1) < 0) ? 0 : msgPopCount -= 1;
		
		if(msgPopCount < 3)
		{
			closeAllBtn.style.display = 'none';
		}
		
		clearTimeout(obj.AutoCloseID);
		delete obj;	
	}
	var showLogic = function(currentItem, obj){
	    animate(currentItem, MsgPop.effectSpeed).open(function () {
	        if (typeof obj["AfterOpen"] === "function") {
	            obj.AfterOpen();
	        }
	    });
	}
	var openLogic = function(msg, obj){
		//Call Before Open
		if (typeof obj["BeforeOpen"] === "function") {
			obj.BeforeOpen();
		}

		animate(msg, MsgPop.effectSpeed).open(function () {
			if (typeof obj["AfterOpen"] === "function") {
				obj.AfterOpen();
			}

			//Choose display mode		
			if(MsgPop.displaySmall)
			{
				msgPopContainer.className += " msgPopContainerSmall ";
			}		
			else{
				msgPopContainer.className = msgPopContainer.className.replace(/\bmsgPopContainerSmall\b/,'').trim();
			}	
		});

		
		if (obj.AutoClose) {
			MsgPop.close(obj,false);
		}
	}
	var cloneObj = function (obj1, obj2) {

	    for (var p in obj2) {
	        try {
	            // Property in destination object set; update its value.
	            if (obj2[p].constructor == Object) {
	                obj1[p] = MergeRecursive(obj1[p], obj2[p]);

	            } else {
	                obj1[p] = obj2[p];

	            }

	        } catch (e) {
	            // Property in destination object not set; create it and set its value.
	            obj1[p] = obj2[p];

	        }
	    }

	    return obj1;
	}
	var animate = function (element, effectSpd) {
	    effectSpd = (typeof (effectSpd) === 'undefined') ? 350 : effectSpd;

	    element.className += ' selPopAnimate ';
	    element.style.webkitTransition = 'height ' + effectSpd + 'ms';
	    element.style.transition = 'height ' + effectSpd + 'ms';
	    var animateTimer = null;

	    var obj = {
	        open: function (afterOpen) {
	            var visibleHeight = this.getHeight(element);

	            element.style.height = '0px';
	            element.style.visibility = 'visible';
	            element.style.overflow = 'hidden';
	            element.style.display = 'block';

	           setTimeout(function () {
	                element.style.height = visibleHeight + 'px';

	                setTimeout(function () {
	                    element.style.removeProperty('overflow');
	                    element.style.removeProperty('visibility');
	                    element.style.removeProperty('transition');
	                    element.style.removeProperty('height');

	                    if (typeof (afterOpen) !== 'undefined') {
							afterOpen();
	                    }

	                }, effectSpd);
	            }, 50);

	        },
	        close: function (afterClose) {
	            var visibleHeight = this.getHeight(element);

	            element.style.height = visibleHeight + 'px';
	            element.style.visibility = 'visible';
	            element.style.overflow = 'hidden';

	            animateTimer = setTimeout(function () {
	                element.style.height = '0px';
	                element.style.display = 'block';

	                setTimeout(function () {
	                    element.style.removeProperty('overflow');
	                    element.style.removeProperty('visibility');
	                    element.style.removeProperty('transition');
	                    element.style.removeProperty('height');
	                    element.style.display = 'none';

	                    if (typeof (afterClose) !== 'undefined') {
	                        afterClose();
	                    }

	                }, effectSpd);
	            }, 50);
	        },
	        getHeight: function (element) {
	            var visibleHeight = element.offsetHeight;

	            if (visibleHeight == 0) {
	                var clone = element.cloneNode(true);
	                clone.setAttribute('style', 'postion:absolute; visibility:hidden; display:block; clear: both;');
	                clone.setAttribute("id", clone.getAttribute('id') + 'clone');

	                element.parentElement.appendChild(clone);
	                visibleHeight = clone.clientHeight;
	                element.parentElement.removeChild(clone);

	                delete clone;
	            }

	            return visibleHeight;
	        }
	    }

	    element.className = element.className.replace(/\bselPopAnimate\b/, '').trim();

	    return obj;
	}
	
    //Public Methods
	MsgPop.open = function(obj){
		//Increment count build ID
		msgPopCount += 1;
		msgPopActionID += 1;
		var msgPopMessageID = 'msgPop' + msgPopActionID;
		
		//Create MsgPopContainer
		msgPopContainer = createContainer();
		
		//Merge Objects
		var defaultObject = {
			Type: "message",				// (message : success : error : warning)
			AutoClose: true,		  		// (force : auto) -- force: user will have to click to close
			CloseTimer: 7000,		  		//  only applies to auto. Sets the timer in milliseconds before box closes
			ClickAnyClose: true,		  	// (true : false) -- true: user clicks anywhere on message to close -- false: user must click "X" to close
			HideCloseBtn: false,		  	// (true : false) -- show / hide close button
			BeforeOpen: null, 	// Fires when the message has fully opened
			AfterOpen: null, 	// Fires when the message begins opening
			BeforeClose: null, 				// Fires when the message begins to close
			AfterClose: null, 				// Fires when the message has closed
			ShowIcon: true,					// Show / Hide icon next to message 
			MsgID: msgPopMessageID,	  		// Sets message ID for this specific call
			CssClass: "",					// Adds additional css classes to the message
			Icon: null,						// Default Icon
			AnchorTo: null,					//Where to anchor control.
			Animation: null,				//('shake') adds an animation to the message once it is open.
			DelayOpen: 0
		}

		//overwrites any missing values with defaults
		obj = cloneObj(defaultObject, obj);
		MsgPop[obj.MsgID] = obj; //creates a property on msgPop object that stores the current object.

		var showMsg = (msgPopCount <= MsgPop.limit) ? true : false;
		
		//Create Message	
		var closeAnywhere = 'MsgPop.close(\''+obj.MsgID+'\')';
		
		var msg = document.createElement('div');
		msg.setAttribute('id',obj.MsgID);
		msg.setAttribute('role','alert');
		msg.setAttribute('title',obj.Type);
		
		if(obj.ClickAnyClose){
			msg.setAttribute('onclick',closeAnywhere);		
		}
	
		switch (obj.Type) {
			case "success":
				msg.setAttribute('class', 'msgPopSuccess ' + obj.CssClass);
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-check-circle"></i>' : obj.Icon;
				break;
			case "error":
				msg.setAttribute('class', 'msgPopError ' + obj.CssClass);
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-ban"></i>' : obj.Icon;
				break;
			case "warning":
				msg.setAttribute('class', 'msgPopWarning ' + obj.CssClass);		
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-exclamation-triangle"></i>' : obj.Icon;
				break;
			case "message":
				msg.setAttribute('class', 'msgPopMessage ' + obj.CssClass);				
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-info-circle"></i>' : obj.Icon;
				break;
			default:
				msg.setAttribute('class', 'msgPopMessage ' + obj.CssClass);	
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-info-circle"></i>' : obj.Icon;
		}
	
		//Create message content
		var msgDivContent = '';
		if(obj.AnchorTo != null){
			msgDivContent += '<div class="msgPopTriangle-Up">&nbsp;</div>';				
		}

		msgDivContent += '<div class="outerMsgPopTbl">';

		msgDivContent += '<div class="innerMsgPopTbl"><div class="msgPopTable">';
		msgDivContent += '<div class="msgPopTable-cell msgPopSpacer">&nbsp;</div>';
		msgDivContent += '<div class="msgPopTable-cell"><div class="msgPopTable-table">';
		if (obj.ShowIcon) {
			msgDivContent += '<div class="msgPopTable-cell" id="msgPopIconCell">' + obj.Icon + '</div>';
		}
		msgDivContent += '<div class="msgPopTable-cell">' + obj.Content + '</div>';
		msgDivContent += '</div></div>';
		msgDivContent += '<div class="msgPopTable-cell msgPop-align-right msgPopSpacer msgPopCloseCell" id="'+obj.MsgID+'CloseBtn">';
		if(obj.HideCloseBtn == false)
		{
			var closeBtnClick = (obj.ClickAnyClose) ? '' : 'onclick="MsgPop.close(\''+ obj.MsgID +'\')"';
			msgDivContent += '<a class="msgPopCloseLnk" title="Close" '+closeBtnClick+'><i class="fa fa-times"></i></a>';
		}		
		msgDivContent += '</div>';
		msgDivContent += '</div></div></div>';
		msg.innerHTML = msgDivContent;
		
		
		//Create Load More & Close All Buttons
		loadMoreBtn = createLoadMore(msgPopContainer);
		closeAllBtn = createCloseAll(msgPopContainer);
		
		setTimeout(function(){
			if(obj.AnchorTo == null)
			{
				if(obj.Animation != null)
				{
					msg.className += ' msgPopShake ';
				}

				msgPopContainer.insertBefore(msg, loadMoreBtn);

				if(showMsg)
				{
					openLogic(msg, obj);
				}
				else{
					loadMoreBtn.style.display = 'block';
				}

				if(msgPopCount > 1){
					closeAllBtn.style.display = 'block';
				}
				else{
					closeAllBtn.style.display = 'none';
				}
			}
			else{
				//Attach Message
				msg.className += ' msgPopAnchored ';

				var anchorElem = document.getElementById(obj.AnchorTo);
				msg.style.left = anchorElem.offsetLeft-16+'px';
				msg.style.marginTop = '16px';
				anchorElem.parentNode.insertBefore(msg, anchorElem.nextSibling);

				openLogic(msg, obj);
			}
		},obj.DelayOpen);

		return obj.MsgID;
	};
	MsgPop.close = function (obj, isCloseAll) {
		var manualClose = false;
		
		if(typeof(obj) == "string")
		{
			manualClose = true;
			obj = MsgPop[obj];
		}

		if (typeof(obj) != "undefined") 
		{
			var message = document.getElementById(obj.MsgID);

			if(obj.AutoClose && manualClose == false)
			{
				obj.AutoCloseID = setTimeout(function(){
					closeLogic(obj, message);
				},obj.CloseTimer+MsgPop.effectSpeed);
			}
			else{
				closeLogic(obj, message);
			}

			MsgPop.cleanUp(isCloseAll);	
		}
	};
	MsgPop.closeAll = function (settings) {
	    if (settings == null)
	    {
	        settings = { ClearEvents: false };
	    }

	    if (settings.ClearEvents)
		 {
			 UserSettings = {};
			 UserSettings.effectSpeed = MsgPop.effectSpeed;
			 UserSettings.limit = MsgPop.limit;
			 UserSettings.displaySmall = MsgPop.displaySmall;
			 UserSettings.position = MsgPop.position;
			
			 initMsgPop();
			
			 MsgPop.effectSpeed = UserSettings.effectSpeed;
			 MsgPop.limit = UserSettings.limit;
			 
			 MsgPop.displaySmall = UserSettings.displaySmall;
			 MsgPop.position = UserSettings.position;

			 if(msgPopContainer.parentNode != null){
		         msgPopContainer.parentNode.removeChild(msgPopContainer);
		     }
		 }
		 else
		 {
			var collection = document.querySelectorAll(".msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess");
			for (i = 0; i < collection.length; i++) {
				var id = collection[i].getAttribute("id");
				MsgPop.close(id, true);
			}
		}
	}
	MsgPop.showMoreMessages = function(){
		var currentMsg;
		var count = 0;
		var obj;
		
		var collection = document.querySelectorAll(".msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess");

		for (i = 0; i < collection.length; i++) {
			if(collection[i].offsetHeight == 0 && count < MsgPop.limit)
			{
				
				var msgID = collection[i].getAttribute("id");
				obj = MsgPop[msgID];

				if (obj.AutoClose) {
					MsgPop.close(obj,false);
				}

				if(typeof(obj)!="undefined"){
					if (typeof obj["BeforeOpen"] === "function") {
						obj.BeforeOpen();
					}

					showLogic(collection[i], obj);
				}
				
				count += 1;
			}
		}

		if (count < MsgPop.limit || MsgPop.limit + count == msgPopCount)
		{
		    loadMoreBtn.style.display = 'none';
		}
	}
	MsgPop.cleanUp = function(isCloseAll) {
	     if(msgPopCount < 3)
		 {
			 closeAllBtn.style.display = 'none';
	     }

	     if(isCloseAll)
	     {
	         loadMoreBtn.style.display = 'none';
	     }
	}

	return MsgPop;
}



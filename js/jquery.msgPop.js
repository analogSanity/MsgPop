/*!
 *  MsgPop by Anthony J. Laurene - 10/1/2014
 *  License - (JS: MIT License, CSS: MIT License)
 */
var MsgPop = initMsgPop();

function initMsgPop()
{
	MsgPop = {};

	MsgPop.effectSpeed = 250;
	MsgPop.limit = 4;
	MsgPop.count = 0;
	MsgPop.actionID = 0;
	MsgPop.displaySmall = false;
	MsgPop.position = "top-right";
	MsgPop.containerCreated = false;
	MsgPop.closeAllBtnCreated = false;
	MsgPop.loadMoreBtnCreated = false;
	
	var deviceAgent = navigator.userAgent.toLowerCase();

	if(deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/)){
		MsgPop.notMobile = false;
	}
	else{
		MsgPop.notMobile = true;
	}	

	MsgPop.createContainer = function() {
		var msgPopContainer;

		if(MsgPop.containerCreated == false)
		{
			MsgPop.containerCreated = true;
			var container = document.createElement("div");
			container.setAttribute('id', 'msgPopContainer');
			if(MsgPop.displaySmall && MsgPop.notMobile)
			{
				container.setAttribute('class', 'msgPopContainerSmall');
			}
			document.body.appendChild(container);
		}

		msgPopContainer = document.getElementById("msgPopContainer");
		
		$(msgPopContainer).stop().clearQueue();

		if(MsgPop.displaySmall && MsgPop.notMobile)
		{
			$(msgPopContainer).addClass("msgPop-"+MsgPop.position).addClass("msgPopContainerOverflow");
		}
		else{
			$(msgPopContainer).addClass("msgPop-top-right").removeClass("msgPopContainerOverflow");
		}

		return msgPopContainer;
	}
	
	MsgPop.createCloseAll = function(container){
		if (MsgPop.closeAllBtnCreated == false) {
			MsgPop.closeAllBtnCreated = true;
			
			var msgDivCloseAll = '<div type="button" id="msgPopCloseAllBtn" onclick="MsgPop.closeAll()">Close All Messages</div>';
			$(container).append(msgDivCloseAll);
		}
		
		return $(document.getElementById('msgPopCloseAllBtn'));
	}
	
	MsgPop.createLoadMore = function(container){
		if(MsgPop.loadMoreBtnCreated == false){
			MsgPop.loadMoreBtnCreated = true;
			
			var msgMoreBtn = '<div id="msgDivMore" class="msgPopLoadMore">';
			msgMoreBtn += '<span onclick="javascript:MsgPop.showMoreMessages();">=== Load More Messages ===</span>';
			msgMoreBtn += '</div>';
			
			$(container).append(msgMoreBtn);
		}
		
		return $(document.getElementById('msgDivMore'));
	}
	
	MsgPop.open = function (obj) {
		if(typeof(MsgPop[obj.MsgID]) != "undefined"){
			return obj.MsgID;
		}

		//Create Container
		var container = MsgPop.createContainer();
				
		MsgPop.count += 1;
		MsgPop.actionID += 1;
		var msgPopMessageID = 'msgPop' + MsgPop.actionID;

		//Merge Objects
		var defaultObject = {
			Type: "message",				// (message : success : error)
			AutoClose: true,		  		// (force : auto) -- force: user will have to click to close
			CloseTimer: 7000,		  		//  only applies to auto. Sets the timer in milliseconds before box closes
			ClickAnyClose: true,		  	// (true : false) -- true: user clicks anywhere on message to close -- false: user must click "X" to close
			HideCloseBtn: false,		  	// (true : false) -- show / hide close button
			BeforeOpen: function () { }, 	// Fires when the message has fully opened
			AfterOpen: function () { }, 	// Fires when the message begins opening
			BeforeClose: null, 				// Fires when the message begins to close
			AfterClose: null, 				// Fires when the message has closed
			ShowIcon: true,					// Show / Hide icon next to message 
			MsgID: msgPopMessageID,	  		// Sets message ID for this specific call
			CssClass: ""					// Adds additional css classes to the message
		}

		obj = $.extend(mergedObj = {}, defaultObject, obj);	//overwrites any missing values with defaults
		obj = $.extend(mergedObj = {}, {MarkedForDelete:false}, obj);
		MsgPop[obj.MsgID] = obj; //creates a property on msgPop object that stores the current object.

		var showMsg = (MsgPop.count <= MsgPop.limit) ? true : false;
		
		//Create Message
		var msg = $(document.createElement("div"));
		msg.attr("role","alert").attr("id",obj.MsgID);
			
		switch (obj.Type) {
			case "success":
				msg.attr('class', 'msgPopSuccess ' + obj.CssClass);
				msgIcon = '<i class="fa fa-check-circle"></i>';
				break;
			case "error":
				msg.attr('class', 'msgPopError ' + obj.CssClass);
				msgIcon = '<i class="fa fa-ban"></i>';
				break;
			case "warning":
				msg.attr('class', 'msgPopWarning ' + obj.CssClass);		
				msgIcon = '<i class="fa fa-exclamation-triangle"></i>';
				break;
			case "message":
				msg.attr('class', 'msgPopMessage ' + obj.CssClass);				
				msgIcon = '<i class="fa fa-info-circle"></i>';
				break;
			default:
				msg.attr('class', 'msgPopMessage ' + obj.CssClass);	
				msgIcon = '<i class="fa fa-info-circle"></i>';
		}
		
		msg.attr('title',obj.Type);
			
		var msgDivContent = '<div class="outerMsgPopTbl"><div class="innerMsgPopTbl"><div class="msgPopTable">';
		msgDivContent += '<div class="msgPopTable-cell msgPopSpacer">&nbsp;</div>';
		msgDivContent += '<div class="msgPopTable-cell"><div class="table">';
		if (obj.ShowIcon) {
			msgDivContent += '<div class="msgPopTable-cell" id="msgPopIconCell">' + msgIcon + '</div>';
		}
		msgDivContent += '<div class="msgPopTable-cell">' + obj.Content + '</div>';
		msgDivContent += '</div></div>';
		msgDivContent += '<div class="msgPopTable-cell align-right msgPopSpacer msgPopCloseCell" id="'+obj.MsgID+'CloseBtn"></div>';
		msgDivContent += '</div></div></div>';
		
		msg.html(msgDivContent);
		
		//Setup Closing Behaviour
		var closeBtn;
		if(obj.HideCloseBtn == false)
		{
			closeBtn = $(document.createElement("a"));
			closeBtn.attr('class','msgPopCloseLnk');
			closeBtn.attr('title','Close');
			closeBtn.html('<i class="fa fa-times-circle-o"></i>');
			
			if(obj.ClickAnyClose == false)
			{
				closeBtn.attr('onclick',"MsgPop.close('"+obj.MsgID+"')");
			}
		}

		if(obj.ClickAnyClose)
		{
			msg.attr('onclick',"MsgPop.close('"+obj.MsgID+"')");
		}
		
		$(msg).find("#"+obj.MsgID+"CloseBtn").append(closeBtn);


		var loadMoreBtn = MsgPop.createLoadMore(container);
		var closeAllBtn = MsgPop.createCloseAll(container);
		
		//Attach Message
		loadMoreBtn.before(msg);

		if(showMsg)
		{
			//Call Before Open
			obj.BeforeOpen();

			$(document.getElementById(obj.MsgID)).slideDown(MsgPop.effectSpeed, function () {
				obj.AfterOpen();
			});
			
			if (obj.AutoClose) {
				obj.AutoCloseID = setTimeout(function () {
					MsgPop.close(obj.MsgID,false);
				}, obj.CloseTimer);
			}
		}
		else{
			$(document.getElementById('msgDivMore')).slideDown(MsgPop.effectSpeed);
		}

		if(MsgPop.count > 1){
			closeAllBtn.show();
		}
		else{
			closeAllBtn.hide();
		}

		return obj.MsgID;
	};

	MsgPop.close = function (msgID, isCloseAll) {
		var obj = MsgPop[msgID];
		
		if (typeof(obj) != "undefined" && obj.MarkedForDelete == false) 
		{
			obj.MarkedForDelete = true;
			MsgPop[msgID] = obj;
						
			var allMessages;
			var isRegularClose = (isCloseAll) ? false : true;
			var message = $(document.getElementById(msgID));

			if(message.length != 0)
			{
				if (jQuery.isFunction(obj["BeforeClose"])) 
				{
					obj.BeforeClose()
				}
			
				message.stop(true,true).clearQueue().slideUp(MsgPop.effectSpeed, function () {
					message.remove();
					
					if (jQuery.isFunction(obj["AfterClose"])) {
						obj.AfterClose();
					}
				});
				
				clearTimeout(obj.AutoCloseID);
				delete obj;	
			}
			
			MsgPop.count -= 1;
			MsgPop.cleanUp(isCloseAll);	
		}
	};

	MsgPop.showMoreMessages = function(){
		var currentMsg;
		var count = 0;
		var obj;

		$('.msgPopError:hidden, .msgPopMessage:hidden, .msgPopWarning:hidden, .msgPopSuccess:hidden').each(function (data) {
			if (count < MsgPop.limit) {
				currentMsg = $(this);
				var msgID = currentMsg.attr("id");
				obj = MsgPop[msgID];
				
				if (obj.AutoClose) {
					obj.AutoCloseID = setTimeout(function () {
						MsgPop.close(msgID,false);
					}, obj.CloseTimer);
				}
				
				if(typeof(obj)!="undefined" && currentMsg.length != 0){
					if (jQuery.isFunction(obj["BeforeOpen"])) 
					{
						obj.BeforeOpen();
					}
										
					currentMsg.slideDown(MsgPop.effectSpeed, function () {
						if (jQuery.isFunction(obj["AfterOpen"])) 
						{
							obj.AfterOpen();
						}

						MsgPop[msgID].AfterOpen();
					});
				}
			}

			count += 1;
		});

		if ($('.msgPopError:hidden, .msgPopMessage:hidden, .msgPopWarning:hidden, .msgPopSuccess:hidden').length == 0) {
			$(document.getElementById("msgDivMore")).clearQueue().stop().slideUp(MsgPop.effectSpeed);
		}
	}
	
	//This will close messages one at a time and run any user defined functions
	MsgPop.closeAll = function (settings) {
		var defaultObject = {
			ClearEvents: 	false		// Closes each message and animates the close.
		};
		obj = $.extend(mergedObj = {}, defaultObject, settings);	//overwrites any missing values with defaults
				
		for (var property in MsgPop) {
			if (MsgPop.hasOwnProperty(property)) {
				clearTimeout(MsgPop[property].AutoCloseID);
			}
		}		
				
		if(obj.ClearEvents)
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

			$(document.getElementById('msgPopContainer')).remove();	
		}
		else
		{
			var id;
			$('.msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess').each(function () {
				id = $(this).attr("id");
				MsgPop.close(id, true);
			});	
		}
	}
	
	MsgPop.destroy = function()
	{	
		delete(MsgPop);
		$(document.getElementById('msgPopContainer')).remove();	
		
		initMsgPop();
	}
	
	MsgPop.cleanUp = function(isCloseAll) {
	    if (MsgPop.count == 0)
	    {
			MsgPop.closeAllBtnCreated = false;
			MsgPop.loadMoreBtnCreated = false;

			$(document.getElementById('msgPopContainer')).stop(true,true).slideUp(MsgPop.effectSpeed, function(){
				$(this).remove();
				MsgPop.containerCreated = false;
			});
			$(document.getElementById("msgPopCloseAllBtn")).remove();
			$(document.getElementById("msgDivMore")).remove();
	    }
	    else if (MsgPop.count == 1) {
			var closeAllBtn = $(document.getElementById("msgPopCloseAllBtn"));
			
			if(isCloseAll)
			{
				closeAllBtn.hide();
			}
			else
			{
				closeAllBtn.slideUp(MsgPop.effectSpeed);
			}
	    }
	}
	
	MsgPop.live = function(){
					$(document).ajaxSuccess(function (event, request, settings) {
						try {
							var messages = request.responseJSON.MsgPopQueue;
							
							MsgPop.closeAll();
							
							for (i = 0; i < messages.length; i++) {
								MsgPop.open(messages[i]);
							}
						}
						catch (e) { }
					});
				}
	return MsgPop;
}

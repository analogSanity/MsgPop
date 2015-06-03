/*!
 *  MsgPop by Anthony J. Laurene - 10/1/2014
 *  License - (JS: MIT License, CSS: MIT License)
 */
var MsgPop = initMsgPop();

function initMsgPop()
{
	MsgPop = {};
	
	//Public properties
	MsgPop.effectSpeed = 250;
	MsgPop.limit = 4;
	MsgPop.displaySmall = false;
	MsgPop.position = "top-right";
	
	//Protected properties
	var msgPopCount = 0;
	var msgPopActionID = 0;
	var msgPopContainer, closeAllBtn, loadMoreBtn;
	var containerCreated = false;
	var closeAllBtnCreated = false;
	var loadMoreBtnCreated = false;
	
	//Browser check
	var deviceAgent = navigator.userAgent.toLowerCase();
	var notMobile = (deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/)) ? false : true;

	//Protected methods
	var	createContainer = function(){
		if(containerCreated == false){
			containerCreated = true;
			if(MsgPop.displaySmall && notMobile){
				container = $('<div id="msgPopContainer" class="msgPop-'+MsgPop.position+' msgPopContainerSmall msgPopContainerOverflow"></div>');
			}
			else{
				container = $('<div id="msgPopContainer" class="msgPop-top-right"></div>');
			}

			$("body").append(container);
		}

		container = $("#msgPopContainer");
		container.stop(true,true).clearQueue().removeAttr("style");
		
		if(MsgPop.displaySmall && notMobile){
			container.removeAttr('class').attr('class','msgPopContainerSmall msgPopContainerOverflow msgPop-'+MsgPop.position);
		}
		else{
			container.removeAttr('class').attr('class','msgPop-top-right');
		}

		return container;
	}
	
	var createLoadMore = function(container){
		if(loadMoreBtnCreated == false){
			loadMoreBtnCreated = true;
			
			var msgMoreBtn = '<div id="msgDivMore" class="msgPopLoadMore">';
			msgMoreBtn += '<span onclick="javascript:MsgPop.showMoreMessages();">=== Load More Messages ===</span>';
			msgMoreBtn += '</div>';
			
			container.append(msgMoreBtn);
		}
		return $('#msgDivMore');
	}
	
	var createCloseAll = function(container){
		if (closeAllBtnCreated == false) {
			closeAllBtnCreated = true;
			var msgDivCloseAll = '<div type="button" id="msgPopCloseAllBtn" onclick="MsgPop.closeAll()">Close All Messages</div>';
			container.append(msgDivCloseAll);
		}
		return $("#msgPopCloseAllBtn");
	}
	
	MsgPop.open = function(obj){
		//Increment count build ID
		msgPopCount += 1;
		msgPopActionID += 1;
		var msgPopMessageID = 'msgPop' + msgPopActionID;
		
		//Create MsgPopContainer
		msgPopContainer = createContainer();
		
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
			CssClass: "",					// Adds additional css classes to the message
			Icon: null						// Default Icon
		}

		obj = $.extend(mergedObj = {}, defaultObject, obj);	//overwrites any missing values with defaults
		obj = $.extend(mergedObj = {}, {MarkedForDelete:false}, obj);
		MsgPop[obj.MsgID] = obj; //creates a property on msgPop object that stores the current object.

		var showMsg = (msgPopCount <= MsgPop.limit) ? true : false;
		
		//Create Message
		var closeAnywhere = (obj.ClickAnyClose) ? 'onclick="MsgPop.close(\''+obj.MsgID+'\')"' : '';
		var msgDivHtml = '<div id="'+obj.MsgID+'" role="alert" title="'+obj.Type+'" '+closeAnywhere+'></div>';
		var msg = $(msgDivHtml);
	
		switch (obj.Type) {
			case "success":
				msg.attr('class', 'msgPopSuccess ' + obj.CssClass);
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-check-circle"></i>' : obj.Icon;
				break;
			case "error":
				msg.attr('class', 'msgPopError ' + obj.CssClass);
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-ban"></i>' : obj.Icon;
				break;
			case "warning":
				msg.attr('class', 'msgPopWarning ' + obj.CssClass);		
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-exclamation-triangle"></i>' : obj.Icon;
				break;
			case "message":
				msg.attr('class', 'msgPopMessage ' + obj.CssClass);				
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-info-circle"></i>' : obj.Icon;
				break;
			default:
				msg.attr('class', 'msgPopMessage ' + obj.CssClass);	
				obj.Icon = (obj.Icon == null) ? '<i class="fa fa-info-circle"></i>' : obj.Icon;
		}
	
		//Create message content
		var msgDivContent = '<div class="outerMsgPopTbl"><div class="innerMsgPopTbl"><div class="msgPopTable">';
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
		msg.html(msgDivContent);

		//Create Load More & Close All Buttons
		loadMoreBtn = createLoadMore(container);
		closeAllBtn = createCloseAll(container);
		
		//Attach Message
		loadMoreBtn.before(msg);

		if(showMsg)
		{
			//Call Before Open
			obj.BeforeOpen();

			msg.stop(true,true).clearQueue().slideDown(MsgPop.effectSpeed, function () {
				obj.AfterOpen();
				
				//Choose display mode		
				if(MsgPop.displaySmall)
				{
					container.addClass("msgPopContainerSmall");
				}		
				else{
					container.removeClass("msgPopContainerSmall");
				}			
			});
			
			if (obj.AutoClose) {
				obj.AutoCloseID = setTimeout(function () {
					MsgPop.close(obj.MsgID,false);
				}, obj.CloseTimer);
			}
		}
		else{
			loadMoreBtn.stop(true,true).clearQueue().slideDown(MsgPop.effectSpeed);
		}

		if(msgPopCount > 1){
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
						
			var isRegularClose = (isCloseAll) ? false : true;
			var message = $("#"+msgID);

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
			
			msgPopCount -= 1;
			MsgPop.cleanUp(isCloseAll);	
		}
	};
	
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
			
			msgPopContainer.stop(true,true).clearQueue().remove();
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
		msgPopContainer.stop(true,true).clearQueue().remove();	
	}
	
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
										
					currentMsg.stop(true,true).clearQueue().slideDown(MsgPop.effectSpeed, function () {
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
			loadMoreBtn.stop(true,true).clearQueue().slideUp(MsgPop.effectSpeed);
		}
	}
	
	MsgPop.cleanUp = function(isCloseAll) {
	    if (msgPopCount == 0)
	    {
			$('#msgPopContainer').stop(true,true).clearQueue().slideUp(MsgPop.effectSpeed, function(){
				if(msgPopCount==0){
					$(this).remove();
					closeAllBtn.remove();
					loadMoreBtn.remove();
			
					containerCreated = false;
					closeAllBtnCreated = false;
					loadMoreBtnCreated = false;
				}
			});
			
			loadMoreBtn.hide();
	    }
	    else if (msgPopCount == 1) {
			if(isCloseAll){
				closeAllBtn.hide();
			}
			else{
				closeAllBtn.stop(true,true).clearQueue().slideUp(MsgPop.effectSpeed);
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
			} catch (e) { }
		});
	}
	
	return MsgPop;
}

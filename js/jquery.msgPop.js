var MsgPop = initMsgPop();

function initMsgPop()
{
	MsgPop = {};
	MsgPop.effectSpeed = 250;
	MsgPop.limit = 4;
	MsgPop.count = 0;
	MsgPop.displaySmall = false;
	jQuery.fx.interval = 1;
	
	MsgPop.open = function (obj) {
		MsgPop.count += 1;
		//Create Message Container
		msgPopContainer = document.getElementById("msgPopContainer");
		if (msgPopContainer == null) {
			var container = document.createElement("div");
			container.setAttribute('id', 'msgPopContainer');
			if(MsgPop.displaySmall)
			{
				container.setAttribute('class', 'msgPopContainerSmall');
			}
			document.body.appendChild(container);
			msgPopContainer = document.getElementById("msgPopContainer");
		}
		else{
			$(msgPopContainer).clearQueue();
			$(msgPopContainer).stop();
		}
		
		//Set ID
		var msgPopMessageID = 'msgPop' + MsgPop.count;
		var showMsg = (MsgPop.count <= MsgPop.limit) ? true : false;
		
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
			msgID: msgPopMessageID,	  		// Sets message ID for this specific call
			cssClass: ""					// Adds additional css classes to the message
		}
		
		obj = $.extend(mergedObj = {}, defaultObject, obj);	//overwrites any missing values with defaults
		MsgPop[obj.msgID] = obj; //creates a property on msgPop object that stores the current object.

		//Call Before Open
		obj.BeforeOpen();
				
		var msg = $(document.createElement("div"));
		msg.attr("role","alert").attr("id",obj.msgID);
			
		switch (obj.Type) {
			case "success":
				msg.attr('class', 'msgPopSuccess ' + obj.cssClass);
				msgIcon = '<i class="fa fa-check-circle"></i>';
				break;
			case "error":
				msg.attr('class', 'msgPopError ' + obj.cssClass);
				msgIcon = '<i class="fa fa-ban"></i>';
				break;
			case "warning":
				msg.attr('class', 'msgPopWarning ' + obj.cssClass);		
				msgIcon = '<i class="fa fa-exclamation-triangle"></i>';
				break;
			case "message":
				msg.attr('class', 'msgPopMessage ' + obj.cssClass);				
				msgIcon = '<i class="fa fa-info-circle"></i>';
				break;
			default:
				msg.attr('class', 'msgPopWarning ' + obj.cssClass);	
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
		msgDivContent += '<div class="msgPopTable-cell align-right msgPopSpacer msgPopCloseCell" id="'+obj.msgID+'CloseBtn"></div>';
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
				closeBtn.attr('onclick',"MsgPop.close('"+obj.msgID+"')");
			}
		}

		if(obj.ClickAnyClose)
		{
			msg.attr('onclick',"MsgPop.close('"+obj.msgID+"')");
		}
		
		$(msg).find("#"+obj.msgID+"CloseBtn").append(closeBtn);
		
		
		var msgDivCloseAllChk = document.getElementById('msgPopCloseAllBtn');
		if (msgDivCloseAllChk == null) {
			var msgDivCloseAll = '<div type="button" id="msgPopCloseAllBtn" onclick="MsgPop.closeAll()">Close All Messages</div>';
			$(msgPopContainer).append(msgDivCloseAll);
			msgDivCloseAllChk = document.getElementById('msgPopCloseAllBtn');
		}
		
		if(MsgPop.count > 1)
		{
			$(msgDivCloseAllChk).show();
		}
		else{
			$(msgDivCloseAllChk).hide();
		}
		
		if (showMsg) {
			var currentMsg = $(document.getElementById(obj.msgID)).remove();
			
			$.when($(msgDivCloseAllChk).before(msg)).done(function () {
				//Open Alert
				currentMsg = $(document.getElementById(obj.msgID));
				currentMsg.slideDown(MsgPop.effectSpeed, function () {
					obj.AfterOpen();
				});
				
				if (obj.AutoClose) {
					obj.AutoCloseID = setTimeout(function () {
						MsgPop.close(obj.msgID);
					}, obj.CloseTimer);
				}
			});
		}
		else {

			var msgDivMoreCheck = document.getElementById("msgDivMore");
			if (msgDivMoreCheck == null) {
				var msgDivMore = '<div id="msgDivMore" class="msgPopLoadMore">';
				msgDivMore += '<span onclick="javascript:MsgPop.showMoreMessages();">=== Load More Messages ===</span>';
				msgDivMore += '</div>';

				$.when($(msgDivCloseAllChk).before(msgDivMore)).done(function () {
					var moreMsg = $(document.getElementById("msgDivMore"));
					moreMsg.slideDown(MsgPop.effectSpeed, function () {
						moreMsg.before(msg);
					});
				});
			}
			else {
				$(msgDivMoreCheck).before(msg);
			}
		}
		
		return obj.msgID;
	};

	MsgPop.close = function (msgID, isCloseAll) {
		MsgPop.count = (MsgPop.count <= 0) ? 0 : MsgPop.count - 1;
		
		var message = document.getElementById(msgID);
		var obj = MsgPop[msgID];
		var allMessages;
		var isRegularClose = (isCloseAll) ? false : true;

		if (message != null && typeof (obj) != "undefined") {
			message = $(message);
			if (jQuery.isFunction(obj["BeforeClose"])) {
				$.when(obj.BeforeClose()).done(function () {
					message.slideUp(MsgPop.effectSpeed, function () {
						message.remove();
						if (jQuery.isFunction(obj["AfterClose"])) {
							obj.AfterClose();
						}
						if(isRegularClose)
						{
							allMessages = $('.msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess');
							if (allMessages.filter(":visible").length == 0 || allMessages.length == 1 || allMessages.length == MsgPop.limit) {
								MsgPop.showMoreMessages();
							}
						}
					});
				});
			}
			else {
				message.slideUp(MsgPop.effectSpeed, function () {
					message.remove();
					if (jQuery.isFunction(obj["AfterClose"])) {
						obj.AfterClose();
					}
					if(isRegularClose)
					{
						allMessages = $('.msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess');
						if (allMessages.filter(":visible").length == 0 || allMessages.length == 1 || allMessages.length == MsgPop.limit) {
							MsgPop.showMoreMessages();
						}
					}
				});
			}
		}
		
		MsgPop.cleanUp(obj);
		
	};

	MsgPop.cleanUp = function(obj) {
		if(MsgPop.count == 0)
		{
			$(document.getElementById("msgPopContainer")).slideUp(MsgPop.effectSpeed, function(){ $(this).remove()});
		}
		else if (MsgPop.count == 1) {
			$(document.getElementById("msgPopCloseAllBtn")).remove();
		}
		else if (MsgPop.count == MsgPop.limit) {
			$(document.getElementById("msgDivMore")).remove();
		}
		clearTimeout(obj.AutoCloseID);
		delete obj;
	}

	MsgPop.closeAll = function () {
		var id;
		$(document.getElementById("msgPopContainer")).slideUp(MsgPop.effectSpeed);
		$('.msgPopError, .msgPopMessage, .msgPopWarning, .msgPopSuccess').each(function(){
			$(msgPopContainer).removeAttr("style");
			id = $(this).attr("id");
			MsgPop.close(id,true);
		});
	}

	MsgPop.showMoreMessages = function()
	{
		var currentMsg;
		var count = 0;
		var msgID;

		$('.msgPopError:hidden, .msgPopMessage:hidden, .msgPopWarning:hidden, .msgPopSuccess:hidden').each(function (data) {
			currentMsg = $(this);
			if (count < MsgPop.limit) {
				currentMsg.slideDown(MsgPop.effectSpeed, function () {
					msgID = currentMsg.attr("id");
					MsgPop[msgID].AfterOpen();
				});
			}
			count += 1;
		});

		if ($('.msgPopError:hidden, .msgPopMessage:hidden, .msgPopWarning:hidden, .msgPopSuccess:hidden').length == 0) {
			var msgDivMore = $(document.getElementById("msgDivMore"));
			msgDivMore.slideUp(MsgPop.effectSpeed, function () {
				msgDivMore.remove();
			});
		}
	}
	
	return MsgPop;
}

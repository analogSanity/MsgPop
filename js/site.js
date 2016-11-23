function showMessages() {
    MsgPop.closeAll();
    MsgPop.displaySmall = true;

    MsgPop.open({
    Type:			"success",
    Content:		"This has been a success!",
    AutoClose:		false});

    MsgPop.open({
    Type:			"error",
    Content:		"Fail! You have to click the close button.",
    AutoClose:		false,
    ClickAnyClose:	false,
    });

    MsgPop.open({
    Type:			"message",
    Content:		'This message was created using msgPop! It will close in <span id="time">10</span> seconds!',
    AutoClose:		true,
    BeforeOpen:		function(){
    					time = 10;
    					if(intervalID == 0){
    						intervalID = setInterval(function(){
    							time-=1;
    							document.getElementById('time').innerHTML = time;
    						},1000);
    					}
    				},
    BeforeClose:	function(){
    					time = 10;
    					clearInterval(intervalID);
    					intervalID = 0;
    				},
    CloseTimer:		10000,
    ClickAnyClose:	false,
    HideCloseBtn:	true});

    MsgPop.open({
    Type:			"warning",
    Content:		"This is a warning. Click anywhere to close me!",
    AutoClose:		false,
    ClickAnyClose:	true,
    ShowIcon:		true,
    HideCloseBtn:	true});

    MsgPop.open({
    Type:			"success",
    Content:		"I was hiding...If you close me you will see an example of my hooks.",
    AutoClose:		false});

    MsgPop.open({
    Type:			"error",
    Content:		"This message will self destruct in 5 seconds!",
    AutoClose:		true,
    CloseTimer:		5000,
    ClickAnyClose:	false,
    HideCloseBtn:	true});


    MsgPop.open({
        Type:			"message",
        Content:		"I have given this message a unique dom ID",
        AutoClose:		false,
        MsgID:			"info",
        ClickAnyClose:	true
    });


    MsgPop.open({
        Type: "error",
        Content: "This message will self destruct in 5 seconds!",
        AutoClose: true,
        CloseTimer: 5000,
        ClickAnyClose: false,
        HideCloseBtn: true
    });
}

function demo1() {
	MsgPop.closeAll();
	MsgPop.open({
		Type: "success",
		Content: "Your transaction was a success!"
	});
}
function demo2(){
	MsgPop.closeAll();
	MsgPop.open({
		Type: 			"message",
		Content:		"You have to click the close button",
		AutoClose:		false,
		ClickAnyClose:	false
	});
}
function demo3(){
	MsgPop.closeAll();
	MsgPop.displaySmall = false;
	
	MsgPop.open({
		Type:		"error",
		Content:	"Your transaction failed! Here is the big message to prove it!",
		AfterClose:	function(){
			MsgPop.displaySmall = true;
		}
	});
}
function demo4(){
	MsgPop.closeAll();

	MsgPop.open({
		Type:		"error",
		Content:	"Invalid input! Numbers only please.",
		AnchorTo: "ZipCodeTxt",
		AutoClose: false,
		HideCloseBtn: true
	});
}
function demo5(){
	MsgPop.closeAll();
	MsgPop.position = "top-left";
	
	MsgPop.open({
		Type:"message",
		Content: "I'm in the top left corner!",
		AutoClose: false
	})
}
function liveDemo(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        MsgPop.closeAll();

	        var obj = JSON.parse(this.responseText);
	        for (i = 0; i < obj.MsgPopQueue.length; i++) {
	            MsgPop.open(obj.MsgPopQueue[i]);
	        }

	        document.getElementById('liveDemo').innerHTML = obj.content;
	    }
	};
	xhttp.open("GET", "json/liveDemo.json", true);
	xhttp.send();
}
function resetDemo(){
    MsgPop.closeAll();
    document.getElementById('liveDemo').innerHTML = "When the button above is clicked this text will be replaced with HTML from liveDemo.json.";
}

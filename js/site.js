function demo1()
{
	MsgPop.closeAll();
	MsgPop.open({
		Type:"success",
		Content:"Your transaction was a success!"
	});
}
function demo2()
{
	MsgPop.closeAll();
	MsgPop.open({
		Type:"message",
		Content:"You have to click the close button",
		AutoClose: false,
		ClickAnyClose:false
	});
}
function demo3()
{	
	MsgPop.closeAll({ClearEvents:true});
	MsgPop.displaySmall = false;

	MsgPop.open({
		Type:"error",
		Content:"Your transaction failed! Here is the big message to prove it!",
		AutoClose:false,
		AfterClose: function(){
			MsgPop.displaySmall = true;
		}
	});
}
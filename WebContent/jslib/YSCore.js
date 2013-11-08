var YSCore = {};
/**
 * 取当前contextPath
 */
YSCore.getContextPath = function(){
	var curPath = document.location.pathname;
	var index = curPath.substr(1).indexOf("/");
	return curPath.substr(0,index+1);
};
/**
 * 调用agent命令
 */
YSCore.invokerAgentCommand = function(className,requestData,callback){
	var servletName=YSCore.getContextPath()+"/AgentCommandInvokerServlet";
	$.ajax({
		   type: "POST",
		   url: servletName,
		   cache: false,
		   dataType:"json",
		   data: requestData,
		   beforeSend:function(xmlHttpRequest){
			   xmlHttpRequest.setRequestHeader("InvokerAgentCommand", className);
		   },
		   success: function(data){
			   if(data["errorMsg"]){
				   alert(data["errorMsg"]);
				   return;
			   }
			   if(callback&&$.isFunction(callback))callback.call(this,data);
		   }
		});
};

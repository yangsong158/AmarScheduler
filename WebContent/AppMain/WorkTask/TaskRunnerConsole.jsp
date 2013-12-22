<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>任务运行控制台</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<style type="text/css">
	ul li {
		list-style: none;
		border-bottom: 1px dashed #292929;
		padding: 0px 10px 0px 10px;
		margin:0px;
	}
	</style>
</head>
<body style='background-color: #000; color: #0F0; font-size: 12px;'>
	<a id="doScroll" href="#scrollRef"  style="display:none">SCROLL</a>
	<div id='consoleOut'>
		<ul></ul>
	</div>
	<div id="scrollRef" style="border:0px solid #F00;height:20px;"></div>
</body>
</html>
<script language='javascript'>
	var complete = false;
	var consoleOut = null;
	var consoleContent = null;
	var complete = false;
	var timmer1 = null;
	var timmer2 = null;
	$(document).ready(function(){
		consoleOut = $('#consoleOut');
		consoleContent = $("ul",consoleOut);
		var pid = $.getParameter()["pid"];
		timmer1 = setInterval(function(){
	    	checkComplete(pid);
		},300);
		timmer2 = setInterval(function(){
	    	fetchMessage(pid);
		},100);
		
	});
	
	//检查是否运行完
	var checkNext = true;
	function checkComplete(pid){
		if(!checkNext)return;
		checkNext = false;
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.process.QueryProcessStatus",{"pid":pid},function(data){
			if(parseInt(data)==4){
				clearInterval(timmer1);
				clearInterval(timmer2);
			}
			checkNext = true;
		},"text");
	};
	
	//取控制台输出
	var fetchNext = true;
	function fetchMessage(pid){
		if(!fetchNext)return;
		fetchNext = false;
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.process.FetchProcessMessage",{"pid":pid},function(data){
			for(var i=0;data&&data!=null&&i<data.length;i++){
				if(data[i]){
					consoleContent.append("<li>"+data[i]+"</li>");
				}
			}
			fetchNext = true;
		});
		$("#doScroll")[0].click();
	};
</script>
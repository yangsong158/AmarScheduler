<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Agent服务查看</title>
    <%@include file="/Frame/page/jspf/jsp_head.jspf" %>
</head>
<body>
	<div class="box1">
		<fieldset>
			<legend>客户端</legend>
			<table class="tableStyle">
				<tr>
					<td style="width: 200px; text-align: right;">代理服务器地址：</td>
					<td id="label_agentServerIP"></td>
				</tr>
				<tr>
					<td style="width: 200px; text-align: right;">代理服务器端口：</td>
					<td id="label_agentServerPort"></td>
				</tr>
				<tr>
					<td style="width: 200px; text-align: right;">TASK运行端口：</td>
					<td id="label_subTaskInvokerPort"></td>
				</tr>
				<tr>
					<td style="width: 200px; text-align: right;">WEB客户端口使用的字符集：</td>
					<td id="label_charset"></td>
				</tr>
				<tr>
					<td colspan="2" style="color: #F00;">注意：以上参数，如需修改，请手动编辑WEB-INF/web.xml</td>
				</tr>
			</table>
		</fieldset>
		<fieldset>
			<legend>代理服务器-基本信息</legend>
		</fieldset>
		<fieldset>
			<legend>代理服务器-TASK信息</legend>
		</fieldset>
		<fieldset>
			<legend>代理服务器-环境变量</legend>
		</fieldset>
	</div>
</body>
</html>
<script type="text/javascript">
$(document).ready(function(){
	
	//第一步：加载客户端，web.xml中的配置信息
	$.ajax({
		type : "POST",
		url : YSCore.getAbsURI("/Frame/tools/ViewSetting.jsp"),
		cache : false,
		dataType : "json",
		asyn : false,
		success : function(data) {
			$("#label_agentServerIP").text(data["agentServerIP"]);
			$("#label_agentServerPort").text(data["agentServerPort"]);
			$("#label_subTaskInvokerPort").text(data["subTaskInvokerPort"]);
			$("#label_charset").text(data["charset"]);
		}
	});
	
	//取代理服务器环境变量信息
 	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.EnvironmentContentShowCommandImpl",null,function(data){
	}); 
	
});
</script>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Agent服务查看</title>
    <%@include file="/Frame/page/jspf/jsp_head.jspf" %>
</head>
<body>
	<form id="form1">
		<fieldset>
			<legend>基本属性信息</legend>
			<table class="tableStyle" formMode="view">
				<tr>
					<td width="20%">agent服务器IP：</td>
					<td width="80%"><input id="agentServerIP" type="text" style="width:150px;" readonly="readonly"/></td>
				</tr>
				<tr>
					<td width="20%">agent服务器端口：</td>
					<td width="80%"><input id="agentServerPort" type="text" style="width:60px;" readonly="readonly"/></td>
				</tr>
				<tr>
					<td width="20%">task运行端口：</td>
					<td width="80%"><input id="subTaskInvokerPort" type="text" style="width:60px;" readonly="readonly"/></td>
				</tr>
				<tr>
					<td width="20%">使用的字符集(charset)：</td>
					<td width="80%"><input id="charset" type="text" style="width:80px;" readonly="readonly"/></td>
				</tr>
				<tr>
					<td colspan="2" style="color:#F00;">注意：以上参数，如需修改，请手动编辑WEB-INF/web.xml</td>
				</tr>
			</table>
		</fieldset>
	</form>
</body>
</html>
<script type="text/javascript">
$.ajax({
	   type: "POST",
	   url: "<c:url value='/Frame/tools/ViewSetting.jsp' />",
	   cache: false,
	   dataType:"json",
	   asyn:false,
	   success: function(data){
			$("#form1").initNamePropertyWithId();
			$("#form1").fillForm(data);
	   }
	});
</script>
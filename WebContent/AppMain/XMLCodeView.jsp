<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
	<title>查看XML代码片段</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<!-- easyui -->
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />" />
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
	<style type="text/css">
	</style>
</head>
<body>
	<textarea id="codeText" style="height:390px;width:790px;" readonly="readonly"></textarea>
</body>
</html>
<script language="javascript" type="text/javascript">
$(function(){
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.XMLStringQueryCommandImpl",$.getParameter(),function(data){
		var s = data;
		s = s.replace(/^\"/gi,"");
		s = s.replace(/\"$/gi,"");
		s = s.replace(/\\n/gi,"\n");
		s = s.replace(/\\t/gi,"\t");
		s = s.replace(/\\/gi,"");
		
		$("#codeText").val(s);
	},"text");
});
</script>
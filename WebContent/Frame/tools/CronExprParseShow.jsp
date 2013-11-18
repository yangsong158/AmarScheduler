<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>查看XML代码片段</title>
	<!-- easyui -->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
	<style type="text/css">
		ul li{list-style: none;}
		#result .rowNumber{
			width:20px;
			text-align: right;
		}
		#result .rowIem{
			width:100%;
		}
		#result td{
			padding:2px;
		}
	</style>
</head>
<body>
	<div id="result"></div>
</body>
</html>
<script language="javascript" type="text/javascript">
$(function(){
	//var para = {"cronExpr":"0 15 10 L * ?"};
	var para = {"cronExpr":$.getParameter()["cronExpr"]};
 	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.CronExprParseCommandImpl",para,function(data){
		var dateList = data;
		var showArea = $("#result");
		showArea.append('<table>');
		for(var i=0;i<dateList.length;i++){
			showArea.append('<tr class="rowIem"><td class="rowNumber">'+(i+1)+'</td><td class="delimter">-</td><td class="dateItem">'+dateList[i]+"</td></tr>");
		}
		showArea.append('</table>');
	},"json"); 
});
</script>
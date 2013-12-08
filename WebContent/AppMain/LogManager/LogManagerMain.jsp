<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>日志文件管理</title>
    <%@include file="/Frame/page/jspf/jsp_head.jspf" %>
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />" />
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
	<style type="text/css">
	#logContent{
		width:100%;
		height:94%;
		overflow: auto;
		white-space:nowrap;
		color:#FFF;
		background-color: #000;
		margin:0;
		padding:0;
	}
	#nullPromptMsg{
		border:1px solid #B0C4DE;
		color:#00F;
		background-color: #FFE4B5;
		overflow: auto;
		white-space:nowrap;		
		width:100%;
		height:4%;
		padding:0;
		margin:0;
	}
	#nullPromptMsg span{
		padding-left:30px;
	}
	.logTable{
		border-collapse:collapse；
	}
	.logTable .logRowNum{
		text-align:right;
		color:#0F0;
		padding-right: 5px;
	}
	.logTable .logRow{}
	.logTable table td{
		word-break: keep-all;
		white-space:nowrap;
	}
	</style>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'west',split:true" style="width:400px;padding:1px">
				<div id="logGrid"></div>
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div id="nullPromptMsg">请双击一个日志文件或点击查看按钮查看日志内容</div>
				<div id="logContent"></div>
			</div>
		</div>
	</div>
</body>
</html>
<script type="text/javascript">
var logGrid = null;
$(document).ready(function(){
	
});
/**
 * QUI加载事件
 */
function initComplete(){
	logGrid = $("#logGrid").quiGrid({
	       columns: [ 
		                { display: '文件名',	name: 'fileName',		align: 'left',	width: "45%", isSort:true},
		                { display: '文件大小',	name: 'fileSizeShow',		align: 'left',	width: "10%"},
		                { display: '文件日期',	name: 'lastModifiedShow',		align: 'left',	width: "45%"}
	         ], 
	        data:[], pageSize: 10, sortName: 'fileName',rownumbers:true,checkbox:false,usePager:true,
	        height: '100%', width:"100%",percentWidthMode:true,
	        groupColumnName: "lastModifiedShowDay", groupColumnDisplay: "日期",
	        //顶部图标按钮栏
			toolbar: 
				{ 
				items: [
	                { line: true },
	                { text: '查看', click: onView, iconClass: 'icon_edit' },
	                { text: '删除', click: onDelete, iconClass: 'icon_delete' },
	                { line: true }
	            ]
	        },
         onDblClickRow : function (rowdata, rowid, rowobj){
        	 onView();
         } 
  	});
	
	refreshGrid();
};
function refreshGrid(){
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.LogFileRecordQueryCommandImpl",null,function(data){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		logGrid.loadData(gridData);
	});		
}
function onView(){
	var row = logGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	var para = {"fileName":row["fileName"]};
	
	$("#nullPromptMsg").html("加载中...");	
	$("#logContent").empty();
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.LogFileShowCommandImpl",para,function(data){
		$("#nullPromptMsg").html(""
		+"<span>文件:"+row.fileName+"</span>"
		+"<span>大小:"+row.fileSizeShow+"</span>"
		+"<span>生成日期:"+row.lastModifiedShow+"<span/>"
		+"<span>共:"+data.length+"行<span/>"
		);
		var contentTable = "<table class='logTable' cellspacing='0' cellpadding='0'>";
		for(var i=0;i<data.length;i++){
			contentTable +=("<tr><td class='logRowNum'>"+i+"</td><td class='logRow'>"+data[i]+"</td></tr>");
		}
		contentTable += "</table>";
		$("#logContent").html(contentTable);
	});		
}
function onDelete(){
	var row = logGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	var para = {"fileName":row["fileName"]};
	Dialog.confirm("确定删除文件:"+row.fileName+"吗？",function(){
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.LogFileDeleteCommandImpl",para,function(data){
			refreshGrid();
		});	
	},function(){
	});	
}
</script>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
	<title>Task文件管理</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<!-- easyui -->
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />" />
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
</head>
<body>
	<!-- 最外层的panel -->
    <div class="easyui-panel" data-options="fit:true">
    	<!-- 内层的左右布局 -->
        <div class="easyui-layout" data-options="fit:true" >
        	<!-- 左部分的列表 -->
            <div data-options="region:'west',split:true" style="width:520px;padding:4px">
            	<div id="targetGrid"></div>
            </div>
            <!-- 右部的编辑详细信息部分 -->
            <div data-options="region:'center'" style="padding:4px">
            </div>
        </div>
    </div>
</body>
</html>
<script language="javascript" type="text/javascript">
var targetGrid;
function initComplete(){
	targetGrid = $("#targetGrid").quiGrid({
	       columns: [ 
		                { display: 'Target名称', name: 'name'      ,align: 'left' ,width:"40%"},
		                { display: 'Target说明', name: 'describe'  ,align: 'left' ,width:"40%"},
		                { display: 'Target状态', name: 'enabled'   ,align: 'left' ,width:"10%"}		                
	         ], 
	        pageSize: 10, sortName: 'sortNo',rownumbers:false,checkbox:false,usePager:false,
	        height: '100%', width:"100%",percentWidthMode:true,
	        isScroll: true, frozen:false,
	        //顶部图标按钮栏
			toolbar:{ 
						items: [
			                { line: true },
			                { text: '查看XML代码', click: function(){}, iconClass: 'icon_code' },
			                { line: true }
			            ]
			        },
			detail: { onShowDetail: showExecuteUnits, height: 'auto' },
			data:[]
  	});
	loadGridData([]);
	refreshGrid();
}

function loadGridData(data){
	if(data&&$.type(data) === "array"){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		targetGrid.loadData(gridData);	
	}
}
function refreshGrid(){
	var para = {"taskFileName":$.getParameter()["fileName"]};
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TargetNodeQueryCommandImpl",para,function(data){
		loadGridData(data);
	});	
}

/**
 * 显示target下的所有单元
 */
function showExecuteUnits(row, detailPanel,callback){
	$(detailPanel).text("详情");
}

</script>
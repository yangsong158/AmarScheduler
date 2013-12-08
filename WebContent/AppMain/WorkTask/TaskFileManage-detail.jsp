<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
	<title>Task文件管理</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<!-- easyui 
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />" />
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	-->
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
	<style type="text/css">
	.loadMessage{
		margin:10px;
		color:#FFA500;
		color:14px;
	}
	</style>
</head>
<body>
	<div id="targetGrid"></div>
</body>
</html>
<script language="javascript" type="text/javascript">
var allGrids = [];
var targetGrid;
function initComplete(){
	targetGrid = $("#targetGrid").quiGrid({
	       columns: [ 
		                { display: 'Target名称', name: 'name'      ,align: 'left' ,width:"40%"},
		                { display: 'Target说明', name: 'describe'  ,align: 'left' ,width:"40%"},
		                { display: 'Target状态', name: 'enabled'   ,align: 'left' ,width:"16%"}		                
	         ], 
	        pageSize: 10, sortName: 'sortNo',rownumbers:false,checkbox:false,usePager:false,
	        height: '100%', width:"100%",percentWidthMode:true,
	        //顶部图标按钮栏
			toolbar:{ 
						items: [
			                { line: true },
			                { text: '查看XML代码', click:showXMLCode, iconClass: 'icon_code' },
			                { text: '运行', click:runItem, iconClass: 'icon_pc' },
			                { line: true }
			            ]
			        },
			detail: { onShowDetail: showExecuteUnits, height: 'auto' },
            onSelectRow:function(rowdata, rowindex,rowDomElement){
          	  onSelectGridRow(allGrids.indexOf(targetGrid),rowdata, rowindex,rowDomElement);
            },
			data:[]
  	});
	allGrids.push(targetGrid);
	targetGrid.loadData(wrapData([]));	
	refreshGrid();
}

function wrapData(data){
	if(data&&$.type(data) === "array"){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		return gridData;
	}
}
function refreshGrid(){
	var para = {"taskFileName":$.getParameter()["fileName"]};
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TargetNodeQueryCommandImpl",para,function(data){
		targetGrid.loadData(wrapData(data));	
	});	
}

/**
 * 显示target下的所有单元
 */
function showExecuteUnits(row, detailPanel,callback){
	var para = {"taskFileName":$.getParameter()["fileName"],"targetPathExpr":row["pathExpr"]};
	
	detailPanel = $(detailPanel);
	detailPanel.html('<span class="loadMessage">请稍等……<br/>正在加载任务单元【'+para["taskFileName"]+":"+para["targetPathExpr"]+'】<span>');
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.ExecuteUnitNodeQueryCommandImpl",para,function(data){
		//创建子表格
		var childGrid = $('<div></div>');
		detailPanel.append(childGrid);
		childGrid.hide();
		var childGridData = wrapData(data);
		
		childGrid = childGrid.css("margin","2px 2px 2px 10px").quiGrid({
            columns: [
                      { display:'名称'      ,name:'name'          ,align: 'left',width:"20%"},
                      { display:'描述信息'   ,name:'describe'      ,align: 'left',width:"20%"},
                      { display:'执行类1'    ,name:'executeClass'  ,align: 'left',width:"60%"}
                      ],
                      pageSize: 100,rownumbers:false,checkbox:false,usePager:false,headerRowHeight:26,rowHeight:26,
                      width:"97%",percentWidthMode:true,
                      onAfterShowData: function(){
                    	  detailPanel.find(".loadMessage").hide();
                    	  try{childGrid.slideDown("normal");}catch(e){}
                      }, 
                      onSelectRow:function(rowdata, rowindex,rowDomElement){
                    	  onSelectGridRow(allGrids.indexOf(childGrid),rowdata, rowindex,rowDomElement);
                      },
                      data: childGridData
          }); 
		 allGrids.push(childGrid);
	});	
}

/**
 * 单击一行时
 *由于多个表格共存，因此，选中其中一个表格时，需要取消其它表格的选中状态
 */
function onSelectGridRow(gridIndex,rowdata, rowindex,rowDomElement){
	for(var i=0;i<allGrids.length;i++){
		if(gridIndex!=i){
			var selectedRow = allGrids[i].getSelectedRow();
			if(selectedRow){
				allGrids[i].unselect(selectedRow);
			}
		}
	}
}
function getGridSelectedRow(){
	for(var i=0;i<allGrids.length;i++){
		var selectedRow = allGrids[i].getSelectedRow();
		if(selectedRow){
			return selectedRow;
		}
	}
}

function showXMLCode(){
	var selectedRow = getGridSelectedRow();
	if(selectedRow){
		var para = {"xmlFileName":$.getParameter()["fileName"],"pathExpr":selectedRow["pathExpr"]};
		var diag = new Dialog();
		diag.Title = "Task文件参数编辑";
		diag.URL = YSCore.getURIAddr("/AppMain/XMLCodeView.jsp",para);
		diag.Width = 800;
		diag.Height = 400;
		diag.show();		
	}else{
		Dialog.alert("请选择一条记录");
	}
}
function runItem(){
	var selectedRow = getGridSelectedRow();
	if(selectedRow){
		var para = {"taskExpr":"@file:"+$.getParameter()["fileName"]};
		if("target" == selectedRow["nodeTagName"]){
			para["taskExpr"] += "-@exec-@target:"+selectedRow["taskAddr"];
		}else if("executeUnit" == selectedRow["nodeTagName"]){
			para["taskExpr"] += "-@exec-@unit:"+selectedRow["taskAddr"];
		}
		var diag = new Dialog();
		diag.Title = "任务运行中控制台";
		diag.Width = 1000;
		diag.Height = 500;
		diag.URL = YSCore.getURIAddr("/TaskRunnerServlet",para);
		diag.show();		
	}else{
		Dialog.alert("请选择一条记录");
	}
}
</script>
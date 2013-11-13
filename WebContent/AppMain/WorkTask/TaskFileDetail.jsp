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
	<style type="text/css">
	.loadMessage{
		margin:10px;
		color:#FFA500;
		color:14px;
	}
	</style>
</head>
<body>
	<!-- 最外层的panel -->
    <div class="easyui-panel" data-options="fit:true">
    	<!-- 内层的左右布局 -->
        <div class="easyui-layout" data-options="fit:true" >
        	<!-- 左部分的列表 -->
            <div data-options="region:'west',split:true" style="width:800px;padding:4px">
            	<div id="targetGrid"></div>
            </div>
            <!-- 右部的编辑详细信息部分 -->
            <div data-options="region:'center'" style="padding;4px">
            </div>
        </div>
    </div>
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
			                { text: '查看XML代码', click: function(){}, iconClass: 'icon_code' },
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
var selectedRow = null;
function onSelectGridRow(gridIndex,rowdata, rowindex,rowDomElement){
	for(var i=0;i<allGrids.length;i++){
		if(gridIndex!=i){
			var selectedRow = allGrids[i].getSelectedRow();
			if(selectedRow){
				allGrids[i].unselect(selectedRow);
			}
		}
	}
	selectedRow = allGrids[gridIndex].getSelectedRow();
}

</script>
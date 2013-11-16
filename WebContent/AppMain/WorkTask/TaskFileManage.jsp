<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Task文件管理</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
</head>
<body>
	<div id="maingrid"></div>
	<!--数据表格end-->
	<script type="text/javascript">
		    //定义本地数据
	        var grid;
			function initComplete(){
				grid = $("#maingrid").quiGrid({
			       columns: [ 
				                { display: 'task文件名',	name: 'fileName',		align: 'left',	width: "15%", isSort:true},
				                { display: '文件说明',	name: 'fileDesc',		align: 'left',	width: "20%"},
				                { display: '排序号',	name: 'sortNo',		align: 'left',	width: "5%"},
				                { display: '创建日期',	name: 'createTime',		align: 'left',	width: "15%", isSort:true},
				                { display: '更新日期',	name: 'updateTime',		align: 'left',	width: "15%", isSort:true },
			                	{ display: '备注',		name: "remark",			align: 'left',	width: "30%",}
			         ], 
			        data:[], pageSize: 10, sortName: 'sortNo',rownumbers:true,checkbox:false,usePager:false,
			        height: '100%', width:"100%",percentWidthMode:true,
			        //顶部图标按钮栏
					toolbar: 
						{ 
						items: [
			                { line: true },
			                { text: '新增', click: onAdd, iconClass: 'icon_add' },
			                { text: '编辑', click: onEditInfo, iconClass: 'icon_edit' },
			                { text: '删除', click: onDelete, iconClass: 'icon_delete' },
			                { line: true },
			                { text: '查看参数', click: onEditParameter, iconClass: 'icon_edit' },
			                { text: '查看路由', click: showFlowGraph, iconClass: 'icon_layers' },
			                { line: true }
			            ]
			        },
	                onDblClickRow : function (rowdata, rowid, rowobj){
	                	openTaskDetailInTab(rowdata);
	                } 
	         	});
			};
		//修改
		function onAdd(){
			var diag = new Dialog();
			diag.Title = "添加一个新文件";
			diag.URL = "TaskFileManage-dialog-fileinfo.jsp";
			diag.Height = 300;
			diag.show();			
		}
		//修改
		function onEditInfo(){
			var row = grid.getSelectedRow();
			if(!row){
				Dialog.alert("请选择一条记录");
				return;
			}
			var diag = new Dialog();
			diag.Title = "Task文件参数编辑";
			diag.URL = "TaskFileManage-dialog-fileinfo.jsp?"+$.jsonConvertParameter(row);
			diag.Height = 300;
			diag.show();
		}
		function onViewEdit(){
			openTaskDetailInTab(grid.getSelectedRow());
		}
		function openTaskDetailInTab(rowdata){
			if(rowdata){
				parent.tabsView.toggleTabItem(rowdata.fileName,rowdata.fileName,"TaskFileDetail.jsp?fileName="+rowdata.fileName,true);
			}
		}
		
		//删除
		function onDelete(){
			var row = grid.getSelectedRow();
			if(!row){
				Dialog.alert("请选择一条记录");
				return;
			}
			Dialog.confirm("确定删除文件",function(){
				YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileRecordDeleteCommandImpl",row,function(data){
					refreshGrid();
				});	
			},function(){
				//top.Dialog.alert("点击了取消");
			});
		}
		//编辑参数
		function onEditParameter(){
			var row = grid.getSelectedRow();
			if(!row){
				Dialog.alert("请选择一条记录");
				return;
			}
			var diag = new Dialog();
			diag.Title = "添加一个新文件";
			diag.Width = 800;
			diag.URL = "TaskFileParameter-edit.jsp?"+$.jsonConvertParameter(row);
			diag.show();
		}
		//==========API==========
		//刷新列表
		//=======================
		function refreshGrid(){
			YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileRecordQueryCommandImpl",null,function(data){
				var gridData = {};
				gridData["form.paginate.totalRows"] = data.length;
				gridData["rows"] = data;
				grid.loadData(gridData);
			});	
		}
		//********初始化操作，加载列表
		$(function(){
			refreshGrid();
		});
		
		function showFlowGraph(){
			var selectedRow = grid.getSelectedRow();
			if(selectedRow){
				var para = {"taskFileName":selectedRow["fileName"]};
				var diag = new Dialog();
				diag.Title = "查看任务流程图";
				diag.URL = YSCore.getURIAddr("/AppMain/FlowGraphShow.jsp",para);
				diag.Width = 800;
				diag.Height = 400;
				diag.show();		
			}else{
				Dialog.alert("请选择一条记录");
			}			
		}
	</script>	
</body>
</html>
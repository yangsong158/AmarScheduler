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
			                { display: '排序号',	name: 'sortNo',		align: 'left',	width: "5%", isSort:true},
			                { display: '触发器名称',	name: 'name',		align: 'left',	width: "20%", isSort:true},
			                { display: '触发器类型',	name: 'triggerType',		align: 'left',	width: "5%",render: renderCode},
			                { display: '触发器说明',	name: 'describe',		align: 'left',	width: "30%"},
			                { display: '触发器内容',	name: 'triggerExpr',		align: 'left',	width: "40%", isSort:true }
		         ], 
		        data:[], pageSize: 10, sortName: 'sortNo',rownumbers:true,checkbox:false,usePager:false,
		        height: '100%', width:"100%",percentWidthMode:true,
		        //顶部图标按钮栏
				toolbar: 
					{ 
					items: [
		                { line: true },
		                { text: '创建', click: onAdd, iconClass: 'icon_add' },
		                { text: '编辑', click: onEditInfo, iconClass: 'icon_edit' },
		                { text: '删除', click: onDelete, iconClass: 'icon_delete' },
		                { line: true },
		                { text: '立刻运行', click: runAtOnce, iconClass: 'icon_pc' },
		                { line: true }
		            ]
		        }
         	});
		};
		//修改
		function onAdd(){
			var diag = new Dialog();
			diag.Title = "新建触发器";
			diag.Width = 900;
			diag.Height = 400;
			diag.URL = YSCore.getURIAddr("/AppMain/WorkTask/TriggerManage-info.jsp");
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
			diag.Title = "查看触发器信息";
			diag.Width = 900;
			diag.Height = 400;
			diag.URL = YSCore.getURIAddr("/AppMain/WorkTask/TriggerManage-info.jsp",row);
			diag.show();
		}
		
		//删除
		function onDelete(){
			var row = grid.getSelectedRow();
			if(!row){
				Dialog.alert("请选择一条记录");
				return;
			}
			Dialog.confirm("确定删除文件",function(){
				YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskTriggerRecordDeleteCommandImpl",row,function(data){
					refreshGrid();
				});	
			},function(){
				//top.Dialog.alert("点击了取消");
			});
		}
		//编辑参数
		function runAtOnce(){
			var row = grid.getSelectedRow();
			if(!row){
				Dialog.alert("请选择一个触发器");
				return;
			}
			Dialog.confirm("手动执行该触发器，可能会失败，也有可能会引起数据逻辑错误，确定要执行吗？",function(){
				top.Dialog.alert("OK");
			},function(){
			});
		};
		//列渲染
		function renderCode(rowdata, rowindex, value, column){
			var codeMap  = {
						"CRON_EXP":"cron表达式",
						"FILE_FLAG":"文件存在",
						"DB_FLAG":"数据库标识",
						};
			if(codeMap[value]){
				return codeMap[value];
			}
			return value;
		}
		//==========API==========
		//刷新列表
		//=======================
		function refreshGrid(){
			YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskTriggerRecordQueryCommandImpl",null,function(data){
				var gridData = {};
				gridData["form.paginate.totalRows"] = data.length;
				gridData["rows"] = data;
				grid.loadData(gridData);
			});	
		};
		//********初始化操作，加载列表
		$(function(){
			refreshGrid();
		});
	</script>	
</body>
</html>
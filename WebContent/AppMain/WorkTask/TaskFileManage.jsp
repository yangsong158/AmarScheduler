<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>基本表格模板</title>
<!--框架必需start-->
<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/framework.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
<link href="<c:url value='/jslib/qui/css/import_basic.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/jslib/qui/skins/blue/style.css' />" rel="stylesheet" type="text/css" id="theme"/>
<!--框架必需end-->

<!--数据表格start-->
<script src="../../jslib/qui/js/table/quiGrid.js" type="text/javascript"></script>
<!--数据表格end-->

</head>
<body>
	<div id="maingrid"></div>

<script type="text/javascript">
	    //定义本地数据
        var grid;
		function initComplete(){
			grid = $("#maingrid").quiGrid({
		       columns: [ 
			                { display: 'task文件名',	name: 'fileName',		align: 'left',	width: "25%", isSort:true},
			                { display: '文件说明',	name: 'fileDesc',	align: 'left',	width: "35%"},
			                { display: '创建日期',	name: 'createTime',		align: 'left',	width: "5%", isSort:true},
			                { display: '更新日期',	name: 'updateTime',		align: 'left',	width: "5%", isSort:true },
		                	{ display: '备注',		name: "remark",			align: 'left',	width: "30%",}
		         ], 
		        data:[], pageSize: 10, sortName: 'id',rownumbers:true,checkbox:false,
		        height: '100%', width:"100%",percentWidthMode:true,
		        //顶部图标按钮栏
				toolbar: 
					{ 
					items: [
		                { line: true },
		                { text: '新增', click: onAdd, iconClass: 'icon_add' },
		                { text: '编辑', click: onViewEdit, iconClass: 'icon_edit' },
		                { text: '删除', click: onDelete, iconClass: 'icon_delete' },
		                { line: true },
		                { text: '查看参数', click: onAdd, iconClass: 'icon_edit' },
		                { text: '查看路由', click: onViewEdit, iconClass: 'icon_edit' },
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
		//top.Dialog.open({URL:"../../sample_skin/normal/user-management-content2.html",Title:"查看",Width:500,Height:330}); 
		//top.Dialog.alert("见JAVA版或.NET版演示。");
	}
	//修改
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
		alert(row["fileName"]);
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileDeleteCommandImpl",row,function(data){
			refreshGrid();
		});	
		//top.Dialog.confirm("确定要删除该记录吗？",function(){
		//  	top.Dialog.alert("向后台发送ajax请求来删除。见JAVA版或.NET版演示。");
		//});
	}
	//==========API==========
	//刷新列表
	//=======================
	function refreshGrid(){
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileQueryCommandImpl",null,function(data){
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
</script>	
</body>
</html>
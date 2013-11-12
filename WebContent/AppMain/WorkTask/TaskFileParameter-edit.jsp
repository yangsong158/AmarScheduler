<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Task文件参数管理</title>
	<%@include file="/Frame/page/jspf/jsp_head.jspf" %>
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
</head>
<body>
	<div id="grid"></div>
	<!--数据表格start-->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
</body>
</html>
<script type="text/javascript" language="javascript">
   //定义本地数据
var grid;
function initComplete(){
	grid = $("#grid").quiGrid({
	      columns: [ 
	                { display: '顺序号',	name: 'sortNo',				align: 'left',	width: "10%", isSort:true},
	                { display: '参数名',	name: 'parameterName',		align: 'left',	width: "30%"},
	                { display: '参数值',	name: 'parameterValue',		align: 'left',	width: "40%"},
	                { display: '操作',	name: 'btn_operate',		align: 'left',	width: "20%"}
	        ], 
	       data:[], sortName: 'sortNo',rownumbers:false,checkbox:false,usePager:false,
	       height: '100%', width:"100%",percentWidthMode:true,
	       //顶部图标按钮栏
		toolbar: { 
			items : [
	               { line: true },
	               { text: '新增', click:onAppendRow, iconClass: 'icon_add' },
	               { text: '删除', click:onDeleteRow, iconClass: 'icon_delete' },
	               { text: '保存', click:onSaveAll, iconClass: 'icon_save' },
	               { line: true }
	           ]}
	      	});
	
	loadGridData([]);
};
function loadGridData(data){
	if(data&&$.type(data) === "array"){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		grid.loadData(gridData);	
	}
}
//添加操作
function onAppendRow(){
	var rowdata = {
			sortNo: "001",
			parameterName: "Arg1",
			parameterValue: "v1"
	       };
	grid.add(rowdata);
}
//删除操作
function onDeleteRow(){
	//选中一行或多行
	var rows = grid.getSelectedRows();
	if (rows.length == 0) {
		parent.Dialog.alert('请至少选择一行'); 
		return;
	}
	Dialog.confirm("确定删除吗？",function(){
		for(var index in rows){
			grid.deleteRow(rows[index]);
		}
	});
}
//保存操作
function onSaveAll(){
	
}
</script>
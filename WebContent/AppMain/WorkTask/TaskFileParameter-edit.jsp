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
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/stepper.js' />"></script>
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
//	                { display: '顺序号',	name: 'sortNo',		align: 'left',	width: "10%", isSort:true,editor:{ type: 'stepper',min:1}},
	                { display: '参数名',	name: 'name',		align: 'left',	width: "30%",editor:{ type: 'text',maxlength:80}},
	                { display: '参数值',	name: 'value',		align: 'left',	width: "50%",editor:{ type: 'text'}},
	                { display: '操作',isAllowHide: false, align: 'left', width:"5%",
						 render: function (rowdata, rowindex, value, column){
		                 	    return '<div class="padding_top4 padding_left5">'
		                                 + '<span class="img_edit hand" title="编辑参数" onclick=onEditParameterValue(' + rowindex + ')></span>'
		                               + '</div>';}
	                }
	        ], 
	       data:[], sortName: 'sortNo',rownumbers:true,checkbox:false,usePager:false,
	       enabledEdit:true, detailToEdit:false,onBeforeSubmitEdit:onBeforeSubmitEdit,
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
	refreshGrid();
};
function loadGridData(data){
	if(data&&$.type(data) === "array"){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		grid.loadData(gridData);	
	}
}
function refreshGrid(){
	var para = {};
	para["xmlFile"]=$.getParameter()["fileName"];
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileParameterQueryCommandImpl",para,function(data){
		loadGridData(data);
	});	
}
//添加操作
function onAppendRow(){
	var maxSortNo = 0;
	var lastRow = {};
	for(var i=0;i<grid.getData().length;i++){
		lastRow = grid.getData()[i];
		if(lastRow["sortNo"]>maxSortNo){
			maxSortNo = lastRow["sortNo"];
		}
	}
	var newRow = $.extend(lastRow,{});
	newRow["sortNo"]=maxSortNo+1;
	newRow["name"]="";
	newRow["value"]="";
	grid.add(newRow);
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
	//组装XML
	var xmlData = [];
	xmlData.push('<taskParameter>');
	//文件名
	xmlData.push('<xmlFile>');
	xmlData.push($.getParameter()["fileName"]);
	xmlData.push('</xmlFile>');
	//扩展属性
	xmlData.push('<extendProperties>');
	for(var i=0;i<grid.getData().length;i++){
		var currentRow = grid.getData()[i];
		xmlData.push('<property name="'+currentRow["name"]+'">');
		xmlData.push('<![CDATA['+currentRow["value"]+']]>');
		xmlData.push('</property>');
	}
	xmlData.push('</extendProperties>');
	xmlData.push('</taskParameter>');
	
	//发送XML数据
	var para = {"xmlData":xmlData.join("")};
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileParameterSaveCommandImpl",para,function(data){
		if(data==1){
			window.location.reload();
		}
	});	
}
function onEditParameterValue(paraValue){
	alert("编辑参数："+paraValue);
}
//编辑提交前
function onBeforeSubmitEdit(e){
	//var str="编辑前事件，可阻止某些行或列进行编辑。列名："+e.column.name+"；行号："+e.rowindex+"；编辑后的值："+e.value+"\n";
	//alert(str);
 	//当：detailToEdit=true时
 	//e{record,rowindex,newdata}
 	//alert(e.record["parameterName"]+"->"+e.newdata["parameterName"]);
}
</script>
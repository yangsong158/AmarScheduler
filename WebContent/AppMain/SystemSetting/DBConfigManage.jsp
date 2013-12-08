<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>数据库连接管理</title>
    <%@include file="/Frame/page/jspf/jsp_head.jspf" %>
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />" />
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />" />
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/table/quiGrid.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/drag.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/popup/dialog.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/stepper.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/validationRule.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/validation.js' />"></script>	
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'west',split:true" style="width:600px;padding:1px">
				<div id="dataGrid"></div>
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div class="box1">
					<form id="form1">
						<button type="button" onclick="doSubmit()"><span class="icon_save">保存</span></button>
						<input id="pathExpr" type="hidden" style="width:300px;"/>
						<fieldset>
							<legend>基本属性信息</legend>
							<table class="tableStyle" formMode="view">
								<tr>
									<td width="10%">name：</td>
									<td width="30%"><input id="name" type="text" style="width:100px;" class="validate[required]"/></td>
									<td width="10%">jndiName：</td>
									<td width="50%"><input id="jndiName" type="text" style="width:170px;" /></td>
								</tr>
								<tr>
									<td width="10%">type：</td>
									<td width="30%"><input id="type" type="text" style="width:100px;" class="validate[required]"/></td>
									<td width="10%">encrypt：</td>
									<td width="50%"><input id="encrypt" type="text" style="width:170px;" readonly="readonly" class="validate[required]"/></td>
								</tr>
							</table>
						</fieldset>
						<fieldset>
							<legend>连接信息</legend>
							<table class="tableStyle" formMode="view" >
								<tr>
									<td width="20%">driver：</td>
									<td width="80%"><input id="driver" type="text" style="width:250px;" class="validate[required]"/></td>
								</tr>
								<tr>
									<td width="20%">url：</td>
									<td width="80%"><input id="url" type="text" style="width:350px;" class="validate[required]"/></td>
								</tr>
								<tr>
									<td width="20%">user：</td>
									<td width="80%"><input id="user" type="text" class="validate[required]"/></td>
								</tr>
								<tr>
									<td width="20%">password：</td>
									<td width="80%"><input id="password" type="password" class="validate[required]"/></td>
								</tr>
							</table>
						</fieldset>
						<fieldset>
							<legend>连接池设置</legend>
							<table class="tableStyle" formMode="view" >
								<tr>
									<td width="20%">logWriter：</td>
									<td width="80%"><input id="logWriter" type="text" readonly="readonly" style="width:150px;"/></td>
								</tr>
								<tr>
									<td width="20%">loginTimeout：</td>
									<td width="80%"><input id="loginTimeout" type="text" class="stepper" value="0"/></td>
								</tr>
								<tr>
									<td width="20%">maxActive：</td>
									<td width="80%"><input id="maxActive" type="text" class="stepper" value="0"/></td>
								</tr>
								<tr>
									<td width="20%">maxWait：</td>
									<td width="80%"><input id="maxWait" type="text" class="stepper" value="0"/></td>
								</tr>
								<tr>
									<td width="20%">maxIdle：</td>
									<td width="80%"><input id="maxIdle" type="text" class="stepper" value="0"/></td>
								</tr>
							</table>
						</fieldset>
					</form>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
<script type="text/javascript">
var dataGrid = null;
/**
 * QUI加载事件
 */
function initComplete(){
	dataGrid = $("#dataGrid").quiGrid({
	       columns: [ 
		                { display: 'name',	name: 'name',		align: 'left',	width: "20%"},
		                { display: 'type',	name: 'type',		align: 'left',	width: "10%"},
		                { display: 'url',	name: 'url',		align: 'left',	width: "50%"},
		                { display: 'user',	name: 'user',		align: 'left',	width: "20%"}
	         ], 
	        data:[], rownumbers:true,checkbox:false,usePager:false,
	        height: '100%', width:"100%",percentWidthMode:true,
	        //顶部图标按钮栏
			toolbar: 
				{ 
				items: [
	                { line: true },
	                { text: '新建', click: onCreate, iconClass: 'icon_add' },
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
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.DBConfigShowCommandImpl",null,function(data){
		var gridData = {};
		gridData["form.paginate.totalRows"] = data.length;
		gridData["rows"] = data;
		dataGrid.loadData(gridData);
	});		
}

/**
 * 新建，初始默认值
 */
function onCreate(){
	formContainer[0].reset();
	formContainer.fillForm({
		"type":"jdbc",
		"encrypt":"false",
		"logWriter":"system.out",
		"loginTimeout":"0",
		"maxActive":"100",
		"maxWait":"10000",
		"maxIdle":"30"
	});
}
function onView(){
	var row = dataGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	formContainer.fillForm(row);
}
function onDelete(){
	var row = dataGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	Dialog.confirm("确定删除连接:"+row.name+"吗？",function(){
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.DBConfigDeleteCommandImpl",row,function(data){
			if(parseInt(data)==1){
				refreshGrid();
				onCreate();
			}
		});	
		},function(){
	});	
}


var formContainer = null;
//由于表单中没有写name元素，因此需要把id元素复制一份name出来
$(function(){
	//初始化
	formContainer = $("#form1");
	formContainer.initNamePropertyWithId();
	formContainer.requiredFieldsAppendStar();
	onCreate();
});

function doSubmit(){
	validateForm(formContainer,function(){
		var formData = formContainer.serializeJson();
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.DBConfigSaveCommandImpl",formData,function(data){
			if(parseInt(data)==1){
				refreshGrid();
				onCreate();
			}
		});			
	});
};

//校验表单
function validateForm(formContainer,callNext){
    var valid = formContainer.validationEngine({returnIsValid: true});
    if(valid == true){
    	if(callNext&&$.isFunction(callNext))callNext.call();
    }else{
        parent.Dialog.alert('请正确填写表单');
    }
};

</script>
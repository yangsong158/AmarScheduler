<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>用户管理</title>
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
						<fieldset>
							<legend>用户信息</legend>
							<table class="tableStyle" formMode="view">
								<tr>
									<td width="10%">用户ID：</td>
									<td width="30%"><input id="userId" type="text" style="width:100px;" class="validate[required]" /></td>
								</tr>
								<tr>
									<td width="10%">用户密码：</td>
									<td width="50%"><input id="userPass" type="password" style="width:170px;" class="validate[required]" /></td>
								</tr>
								<tr>
									<td width="10%">用户状态：</td>
									<td width="30%">
										<input type="radio" name="userStatus" id="userStatus-1" value="normal" checked="checked"/><label for="userStatus-1" class="hand">正常</label>
			    						<input type="radio" name="userStatus" id="userStatus-2" value="disabled" /><label for="userStatus-2" class="hand">禁用</label>					
			    						<input type="radio" name="userStatus" id="userStatus-3" value="locked" /><label for="userStatus-3" class="hand">锁定</label>								
									</td>
								</tr>
								<tr>
									<td width="10%">创建时间：</td>
									<td width="30%"><input id="createTime" type="text" style="width:150px;" readonly="readonly" /></td>
								</tr>
								<tr>
									<td width="10%">修改时间：</td>
									<td width="30%"><input id="updateTime" type="text" style="width:150px;" readonly="readonly"/></td>
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
		                { display: '用户ID',	name: 'userId',		align: 'left',	width: "30%"},
		                { display: '用户状态',	name: 'userStatus',		align: 'left',	width: "10%",render: renderCode},
		                { display: '创建时间',	name: 'createTime',		align: 'left',	width: "30%"},
		                { display: '修改时间',	name: 'updateTime',		align: 'left',	width: "30%"}
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
	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.UserShowCommandImpl",null,function(data){
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
	formContainer.fillForm({});
}
function onView(){
	var row = dataGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	formContainer.fillForm(row);
};

function onDelete(){
	var row = dataGrid.getSelectedRow();
	if(!row){
		Dialog.alert("请选择一条记录");
		return;
	}
	Dialog.confirm("确定删除用户:"+row.userId+"吗？",function(){
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.UserDeleteCommandImpl",row,function(data){
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
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.UserSaveCommandImpl",formData,function(data){
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

//列渲染
function renderCode(rowdata, rowindex, value, column){
	var codeMap  = {
				"normal":"正常",
				"locked":"锁定",
				"disabled":"禁用"
				};
	if(codeMap[value]){
		return codeMap[value];
	}
	return value;
}

</script>
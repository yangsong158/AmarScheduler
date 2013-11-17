<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@include file="/Frame/page/jspf/jsp_head.jspf"%>
<style type="text/css">
.readOnlyText{
	font-size: 12px;
	color: #6495ED;
}
</style>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/validationRule.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/form/validation.js' />"></script>
<body>
	<form class="padding_top10" id="fileInfo">
		<table class="tableStyle" formMode="line">
			<tr>
				<td>触发器名称：</td>
				<td><input id="name" type="text" style="width:300px;" class="validate[required]" /></td>
			</tr>
			<tr>
				<td>触发器说明：</td>
				<td><input id="describe" type="text" style="width:500px;" class="validate[required]"/></td>
			</tr>
			<tr>
				<td>排序号：</td>
				<td><input id="sortNo" type="text" style="width:60px;"/></td>
			</tr>
			<tr>
				<td>触发类型：</td>
				<td>
					<select id="triggerType" style="width:100px;">
						<option value="">----请选择----</option>
						<option value="CRON_EXP">cron表达式</option>
						<option value="FILE_FLAG">文件存在</option>
						<option value="DB_FLAG">数据库标识</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>触发表达式：</td>
				<td><input id="triggerExpr" type="text" style="width:200px;"/>
					<input type="button" value="表达式向导" id="btn_EditCronExpr" />
					<input type="button" value="表达式帮助" id="btn_EditCronExpr" />
				</td>
			</tr>
			<tr>
				<td>task任务表达式：</td>
				<td><textarea id="taskExpr" style="width:500px;height:100px;"></textarea></td>
			</tr>
			<tr>
				<td>创建日期：</td>
				<td><input id="createTime" type="text" style="width:150px;" readonly="readonly" disabled="disabled" /></td>
			</tr>
			<tr>
				<td>更新日期：</td>
				<td><input id="updateTime" type="text" style="width:150px;" readonly="readonly" disabled="disabled"/></td>
			</tr>
			<tr>
				<td colspan="2">
					<input type="button" value="保存" onclick="doSubmit()"/>
					<input type="reset" value="取消" onclick="doCancel()" />
				</td>
			</tr>
		</table>
	</form>
</body>
</html>
<script language="javascript" type="text/javascript">
	var formContainer = null;
	//由于表单中没有写name元素，因此需要把id元素复制一份name出来
	$(function(){
		//初始化
		formContainer = $("#fileInfo");
		formContainer.initNamePropertyWithId();
		formContainer.requiredFieldsAppendStar();
		//如果提交了数据，则使用提交的数据来填充
		var data = $.getParameter();
		if(data["fileName"]){
			formContainer.fillForm(data);
			$("input[name='fileName']",formContainer).attr({"readonly":"readonly"});
		}
		//处理只读区显示为文本
		$("input[readonly]",formContainer).each(function(){
			$(this).hide();
			$(this).next(".star").hide();
			$(this).after("<span class='readOnlyText'>"+$(this).val()+"</span>");
		});
	});
	
	//执行提交
	function doSubmit(){
		validateForm(formContainer,function(){
	    	var formData = formContainer.serializeJson();
			YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskFileRecordSaveCommandImpl",formData,function(data){
				if(parseInt(data)==1){
					parent.refreshGrid();
					doCancel();
				}
			});			
		});
		return false;
	}
	//执行取消
	function doCancel(){
		parent.Dialog.close();
	}
	//校验表单
	function validateForm(formContainer,callNext){
	    var valid = formContainer.validationEngine({returnIsValid: true});
	    if(valid == true){
	    	if(callNext&&$.isFunction(callNext))callNext.call();
	    }else{
	        parent.Dialog.alert('请正确填写表单');
	    }
	}
</script>
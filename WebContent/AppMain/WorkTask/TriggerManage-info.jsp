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
	<form class="padding_top10" id="triggerInfo" >
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
					<select id="triggerType" class="validate[required]">
						<option value="">----请选择----</option>
						<option value="CRON_EXP">cron表达式</option>
						<option value="FILE_FLAG">文件存在</option>
						<option value="DB_FLAG">数据库标识</option>
					</select>
				</td>
			</tr>
			<tr>
				<td>触发表达式：</td>
				<td><input id="triggerExpr" type="text" style="width:400px;" class="validate[required]"/>
					<input type="button" value="表达式向导" id="btn_CronGen" />
					<input type="button" value="表达式帮助" id="btn_CronHelp" />
					<input type="button" value="表达式解析" id="btn_CronParse" />
				</td>
			</tr>
			<tr>
				<td>task任务表达式：</td>
				<td><textarea id="taskExpr" style="width:500px;height:100px;"></textarea>
				<div>
				参考例子：@file:etc/task1.xml,@file:etc/task1.xml-@exec-@target:target1,@file:etc/task1.xml-@exec-@unit:target1/unit1
				</div>
				</td>
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
				<td colspan="2" style="text-align: center;">
					<button type="button" onclick="doSubmit()"><span class="icon_save">保存</span></button>
					<button type="button" onclick="doCancel()"><span class="icon_no">取消</span></button>
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
		formContainer = $("#triggerInfo");
		formContainer.initNamePropertyWithId();
		formContainer.requiredFieldsAppendStar();
		//如果提交了数据，则使用提交的数据来填充
		var data = $.getParameter();
		if(data["name"]){
			formContainer.fillForm(data);
			$("input[name='name']",formContainer).attr({"readonly":"readonly"});
			$("#triggerType").setValue(data["triggerType"]);
		}
		
		$("#btn_CronGen").click(cronExprGen);
		$("#btn_CronHelp").click(cronHelp);
		$("#btn_CronParse").click(cronParse);
		initTriggerChange();
	});
	
	function initTriggerChange(){
		$("#triggerType").change(function(){
			var v = $(this).val();
			if(v=="CRON_EXP"){
				$("#btn_CronGen").css("visibility","visible");
				$("#btn_CronHelp").css("visibility","visible");
				$("#btn_CronParse").css("visibility","visible");
			}else{
				$("#btn_CronGen").css("visibility","hidden");
				$("#btn_CronHelp").css("visibility","hidden");
				$("#btn_CronParse").css("visibility","hidden");
			}
		});
		$("#triggerType").change();
	}
	/**
	 *cron表达式生成
	 */
	function cronExprGen(){
		var diag = new parent.Dialog();
		diag.Title = "时间表达式生成";
		diag.Width = 520;
		diag.Height = 400;
		diag.ShowButtonRow = true;
		diag.ButtonAlign = "center";
		diag.URL = YSCore.getURIAddr("/jslib/cron/cron.jsp");
	    diag.OKEvent = function(){
	        var inputValue = diag.innerFrame.contentWindow.getExpression();
	        $("#triggerExpr").val(inputValue);
	        diag.close();
	       };
		diag.show();
	};
	/**
	 *cron表达式帮助
	 */	
	function cronHelp(){
		var diag = new parent.Dialog();
		diag.Title = "时间表达式帮助";
		diag.Width = 700;
		diag.Height = 400;
		diag.ButtonAlign = "center";
		diag.URL = YSCore.getURIAddr("/Frame/tools/CronReadMe.html");
		diag.show();		
	};
	/**
	 *cron表达式解析
	 */	
	function cronParse(){
		var cronExpr = $("#triggerExpr").val();
		if(!cronExpr){
			parent.Dialog.alert("请先填写时间表达式");
			return;
		}
		var diag = new parent.Dialog();
		diag.Title = "时间表达式解析结果";
		diag.Width = 300;
		diag.Height = 250;
		diag.MessageTitle = "前10次执行时间";
		diag.ButtonAlign = "center";
		diag.URL = YSCore.getURIAddr("/Frame/tools/CronExprParseShow.jsp",{"cronExpr":cronExpr});
		diag.show();		
	};
	//执行提交
	function doSubmit(){
		validateForm(formContainer,function(){
	    	var formData = formContainer.serializeJson();
	    	formData["triggerType"] = $("#triggerType").val();//单独处理这个东东，qui表单序列化为对象，select组件有问题
			YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.TaskTriggerRecordSaveCommandImpl",formData,function(data){
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
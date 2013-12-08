<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>cron表达式生成</title>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />"></link>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />"></link>
	<style type="text/css">
		#cronContainer{
			margin:auto;
			font-size:13px;
		}
		#cronContainer fieldset{
			width:478px;
			border:1px #95B8E7 solid;
			font-size:13px;
		}
		#cronContainer ul{
			padding-left:5px;
		}
		#cronContainer ul li{
			list-style-type:none;
			margin-left: 0px;
		}
		#cronContainer #echoArea fieldset input{width:50px;}
		#secCheckList span,
		#minCheckList span,
		#hourCheckList  span,
		#dayCheckList  span,
		#monthCheckList  span,
		#weekCheckList  span
		{width:25px;}
		
		.btnBar{
			padding-top:5px;
			width:500px;
			text-align: center;
		}
		.btnBar .btn{
			width:100px;
		}
	</style>
</head>

<body>
	<div id="cronContainer">
		<div>
			<div class="easyui-tabs" style="width: 500px; height: 250px">
				<!-- 秒标签 -->
				<div title="秒" id="tbiSec" style="padding: 10px">
					<ul>
						<!-- 
						<li><input type="radio" name="secTypeChoice" checked="checked" value="0">0</li>
						 -->
						<li>
							<input type="radio" name="secTypeChoice" checked="checked" value="*">周期 从 
								<input class="easyui-numberspinner" data-options="min:0,max:60" style="width: 80px;" value="0" id="secStart">
								秒开始,每
								<input class="easyui-numberspinner" data-options="min:1,max:60" style="width: 80px;" value="0" id="secEnd"></input>
								秒执行一次
							</li>
						<li>
							<input type="radio" name="secTypeChoice" value="c">指定
							<div id="secCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 分钟标签 -->
				<div title="分" id="tbiMin" style="padding: 10px">
					<ul>
						<!-- 
						<li><input type="radio" name="minTypeChoice" checked="checked" value="0">0</li>
						 -->
						<li>
							<input type="radio" name="minTypeChoice" checked="checked" value="*">周期 从 
								<input class="easyui-numberspinner" data-options="min:0,max:60" style="width: 80px;" value="0" id="minStart">
								分开始,每
								<input class="easyui-numberspinner" data-options="min:1,max:60" style="width: 80px;" value="0" id="minEnd"></input>
								分执行一次
							</li>
						<li>
							<input type="radio" name="minTypeChoice" value="c">指定
							<div id="minCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 小时标签 -->
				<div title="时" id="tbiHour" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="hourTypeChoice" checked="checked" value="*">每小时
						</li>
						<li>
							<input type="radio" name="hourTypeChoice" value="c">指定
							<div id="hourCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 日标签 -->
				<div title="日" id="tbiDay" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="dayTypeChoice" checked="checked" value="*">每日
						</li>
						<li>
							<input type="radio" name="dayTypeChoice" value="c">指定
							<div id="dayCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 月标签 -->
				<div title="月" id="tbiMonth" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="monthTypeChoice" checked="checked" value="*">每月
						</li>
						<li>
							<input type="radio" name="monthTypeChoice" value="c">指定
							<div id="monthCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 星期标签 -->
				<div title="周" id="tbiWeek" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="weekTypeChoice" checked="checked" value="?">每星期
						</li>
						<li>
							<input type="radio" name="weekTypeChoice" value="c">指定
							<div id="weekCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 年期标签 -->
				<div title="年" id="tbiYear" style="padding: 10px">
					<ul>
						<li>
							<div id="yearCheckList"></div>
						</li>
					</ul>
				</div>
			</div>

		</div>
		<div id="echoArea">
			<fieldset>
				<legend>表达式</legend>
				<div>
					<table>
						<tr>
							<td></td>
							<td>秒</td>
							<td>分</td>
							<td>时</td>
							<td>日</td>
							<td>月</td>
							<td>周</td>
							<td>年</td>
						</tr>
						<tr>
							<td>字段:</td>
							<td><input id="exSec"  readonly="readonly"/></td>
							<td><input id="exMin"  readonly="readonly"/></td>
							<td><input id="exHour" readonly="readonly"/></td>
							<td><input id="exDay"  readonly="readonly"/></td>
							<td><input id="exMon"  readonly="readonly"/></td>
							<td><input id="exWeek" readonly="readonly"/></td>
							<td><input id="exYear" readonly="readonly"/></td>
						</tr>
						<tr>
							<td>结果:</td>
							<td colspan="5"><input id="txtCron" style="width: 100%" /></td>
						</tr>
					</table>
				</div>
			</fieldset>
		</div>
		<div class="btnBar">
			<!-- 
			<input type="button" class="btn" value="确定" id="btnOK"/>
			<input type="button" class="btn" value="生成预览" id="btnGen"/>
			 <input type="button" class="btn" value="解析" id="btnParse" />
			 -->
		</div>
	</div>
</body>
</html>
<!-- 
<script type="text/javascript" src="<c:url value='/jslib/cron/js/js-cron.js' />"></script>
 -->
<script type="text/javascript">
var comp = null;
$(function(){
	comp = $("#cronContainer");
	comp.cronInit();
	setTimeout(function(){
		//$("#txtCron").val(comp.getExprValue());
	},200);
	
	//---反向生成回去实现
	comp.fillExpression("0 15 10 * * ? 2014");
});
function getExpression(){
	$("#txtCron").val(comp.getExprValue());
	return $("#txtCron").val();
};

//========================================================
//========================================================
//========================================================
//========================================================
(function($){
	$.fn.cronInit = function(options){
		var defaults = {};
		options = $.extend(defaults, options);
	
		var context = $(this);
		initChoiceSec(context);
		initChoiceMin(context);
		initChoiceHour(context);
		initChoiceDay(context);
		initChoiceMonth(context);
		initChoiceWeek(context);
		initChoiceYear(context,(new Date()).getFullYear()-20,90);
		
		$("input",context).click(function(){
			context.getExprValue();
			$("#txtCron").val(comp.getExprValue());
		});
		return context;
	};
	/**
	 *获取表达式的值
	 */
	$.fn.getExprValue = function(){
		var context = $(this);
		var sec = getSecValue(context);
		var min = getMinValue(context);
		var hour = getHourValue(context);
		var day = getDayValue(context);
		var mon = getMonValue(context);
		var week = getWeekValue(context);
		var year = getYearValue(context);
		if(!year)year = "";
		$("#exSec").val(sec);
		$("#exMin").val(min);
		$("#exHour").val(hour);
		$("#exDay").val(day);
		$("#exMon").val(mon);
		$("#exWeek").val(week);
		$("#exYear").val(year);
		//最终生成最终表达式
		return (sec+" "+min+" "+hour+" "+day+" "+mon+" "+week+" "+year);
	};
	/**
	 *使用表达式来填充
	 */
	$.fn.fillExpression = function(expr){
		$("#txtCron").val(expr);
		var expression = new CronExpression(expr);
		$("#exSec").val(expression.getSec());
		$("#exMin").val(expression.getMin());
		$("#exHour").val(expression.getHour());
		$("#exDay").val(expression.getDay());
		$("#exMon").val(expression.getMon());
		$("#exWeek").val(expression.getWeek());
		$("#exYear").val(expression.getYear());
		
		//处理分钟
		if(expression.getSec().split("/").length>1){
			
		};
	};
	/**=============================================
	 *                 初始化复选框选择器
	 * ============================================= */
	/**
	 * 初始化秒选择
	 */
	function initChoiceSec(context){
		var tabContext = $("#tbiSec",context);
		var secCheckList = $("#secCheckList",tabContext);
		var changeTrigger = $("input[name='secTypeChoice']",tabContext);
		initCheckBoxList(secCheckList,60,"secchk",changeTrigger,0);
	};
	/**
	 * 初始化分钟选择
	 */
	function initChoiceMin(context){
		var tabContext = $("#tbiMin",context);
		var minCheckList = $("#minCheckList",tabContext);
		var changeTrigger = $("input[name='minTypeChoice']",tabContext);
		initCheckBoxList(minCheckList,60,"minchk",changeTrigger,0);
	};
	
	/**
	 * 初始化小时选择
	 */
	function initChoiceHour(context){
		var tabContext = $("#tbiHour",context);
		var hourCheckList = $("#hourCheckList",tabContext);
		var changeTrigger = $("input[name='hourTypeChoice']",tabContext);
		initCheckBoxList(hourCheckList,24,"hourchk",changeTrigger,0);
	};
	
	/**
	 * 初始化日选择
	 */
	function initChoiceDay(context){
		var tabContext = $("#tbiDay",context);
		var dayCheckList = $("#dayCheckList",tabContext);
		var changeTrigger = $("input[name='dayTypeChoice']",tabContext);
		initCheckBoxList(dayCheckList,31,"daychk",changeTrigger,1);
	};
	/**
	 * 初始化月选择
	 */
	function initChoiceMonth(context){
		var tabContext = $("#tbiMonth",context);
		var montyCheckList = $("#monthCheckList",tabContext);	
		var changeTrigger = $("input[name='monthTypeChoice']",tabContext);
		initCheckBoxList(montyCheckList,12,"monchk",changeTrigger,1);
	};
	
	/**
	 * 初始化星期选择
	 */
	function initChoiceWeek(context){
		var tabContext = $("#tbiWeek",context);
		var montyCheckList = $("#weekCheckList",tabContext);	
		var changeTrigger = $("input[name='weekTypeChoice']",tabContext);
		initCheckBoxList(montyCheckList,7,"weekchk",changeTrigger,1);				
	}
	/**
	 * 初始化年，一年初始化前10年至后50年即可
	 */
	function initChoiceYear(context,startYear,years){
		var tabContext = $("#tbiYear",context);
		var yearCheckList = $("#yearCheckList",tabContext);	
		var yearCompList = "";
		for(var i=0;i<years;i++){
			var a = startYear+i;
			yearCompList+="<input type='checkbox' value='"+a+"' name='yearchk'><span>"+a+"</span>";
			if((i+1)%10==0){
				yearCompList+="<br>";
			};
		}
		yearCheckList.append(yearCompList);
	};
	/**
	 * 初始化复选组件列表通用API
	 */
	function initCheckBoxList(checkBoxList,numberCount,chkName,changeTrigger,startIdx){
		var chkCompList = "";
		for(var i=0;i<numberCount;i++){
			var a = startIdx+i;
			chkCompList+="<input type='checkbox' value='"+a+"' name='"+chkName+"' disabled='disabled'><span>"+a+"</span>";
			if((i+1)%10==0){
				chkCompList+="<br>";
			};
		}
		//添加组件
		checkBoxList.append(chkCompList);
		//事件绑定
		changeTrigger.click(function(){
			if($(this).val()=="c"){
				$("input[name='"+chkName+"']",checkBoxList).removeAttr("disabled");
			}else{
				$("input[name='"+chkName+"']",checkBoxList).attr("disabled","disabled");
			}					
		});
		
	};
	/**=============================================
	*                 初始化复选框选择器
	* ============================================= */
	/**
	 * 取秒数
	 */
	function getSecValue(context){
		var chkTypeValue = $("input[name='secTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='secchk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");
		}else if(chkTypeValue=="*"){
			var startValue = $("#secStart",context).val();
			var endValue = $("#secEnd",context).val();
			return startValue+"/"+endValue;
		}else{
			return chkTypeValue;
		};
	};
	/**
	 * 取分钟数
	 */
	function getMinValue(context){
		var chkTypeValue = $("input[name='minTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='minchk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");
		}else if(chkTypeValue=="*"){
			var startValue = $("#minStart",context).val();
			var endValue = $("#minEnd",context).val();
			return startValue+"/"+endValue;
		}else{
			return chkTypeValue;
		};
	};
	/**
	 * 取小时的值
	 */
	function getHourValue(context){
		var chkTypeValue = $("input[name='hourTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='hourchk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");					
		}else{
			return chkTypeValue;
		};				
	};
	/**
	 * 取天数的值
	 */
	function getDayValue(context){
		var chkTypeValue = $("input[name='dayTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='daychk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");						
		}else{
			return chkTypeValue;
		};				
	};
	/**
	 * 取月份的值
	 */
	function getMonValue(context){
		var chkTypeValue = $("input[name='monthTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='monchk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");						
		}else{
			return chkTypeValue;
		};					
	};
	/**
	 * 取星期的值
	 */
	function getWeekValue(context){
		var chkTypeValue = $("input[name='weekTypeChoice']:checked",context).val();
		if(chkTypeValue=="c"){
			var chkValues = new Array();
			$("input[name='weekchk']:checked").each(function(){
				chkValues.push($(this).val());
			});
			return chkValues.join(",");						
		}else{
			return chkTypeValue;
		};					
	};
	/**
	 * 取年的值
	 */
	function getYearValue(context){
		var chkValues = new Array();
		$("input[name='yearchk']:checked").each(function(){
			chkValues.push($(this).val());
		});
		return chkValues.join(",");	
	};
	
	/**
	 *表达式对象
	 */
	function CronExpression(expr){
		if(!expr)return;
		var s = expr.split(/\s+/ig);
		this.sec=null,min=null,hour=null,day=null,mon=null,week=null,year=null;
		if(s.length>=6){
			sec  = s[0];
			min  = s[1];
			hour = s[2];
			day  = s[3];
			mon  = s[4];
			week = s[5];
		}
		if(s.length=7)year = s[6];
		/* 一些对外提供的API */
		this.getSec   = function(){ return sec ; };
		this.getMin   = function(){ return min ; };
		this.getHour  = function(){ return hour; };
		this.getDay   = function(){ return day ; };
		this.getMon   = function(){ return mon ; };
		this.getWeek  = function(){ return week; };
		this.getYear  = function(){ return year; };
		this.validate = function(){ return s.length==6||s.length==7;};
	};	
})(jQuery);
</script>	

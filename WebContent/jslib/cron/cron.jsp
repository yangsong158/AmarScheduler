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
<script type="text/javascript" src="<c:url value='/jslib/cron/js/js-cron.js' />"></script>
<script type="text/javascript">
var comp = null;
$(function(){
	comp = $("#cronContainer");
	comp.cronInit();
	setTimeout(function(){
		$("#txtCron").val(comp.getExprValue());
	},200);
});
function getExpression(){
	$("#txtCron").val(comp.getExprValue());
	return $("#txtCron").val();
}
</script>	

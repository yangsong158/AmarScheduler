<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
	<title>cron表达式生成</title>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/cron/js/js-cron.js' />"></script>
	<script type="text/javascript">
		$(function(){
			$("#cronContainer").cronInit();
			setTimeout(function(){
				$("#btnGen").click();
			},500);
		});
	</script>	
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/cron/css/style.css' />"></link>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />"></link>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />"></link>
	<style type="text/css">
		#cronContainer{
			width:700px;
			margin:auto;
			margin-top:40px;
			font-size:13px;
		}
		#cronContainer fieldset{
			width:678px;
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
		#cronContainer #echoArea input{ width:80px;}
		#minCheckList span,
		#hourCheckList  span,
		#dayCheckList  span,
		#monthCheckList  span,
		#weekCheckList  span
		{width:20px;}
	</style>
</head>

<body>
	<div id="cronContainer">
		<div>
			<div class="easyui-tabs" style="width: 700px; height: 250px">
				<!-- 分钟标签 -->
				<div title="分钟" id="tbiMin" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="minTypeChoice" checked="checked" value="*">周期 从 
								<input class="easyui-numberspinner" data-options="min:0,max:60" style="width: 80px;" value="0" id="minStart">
								分钟开始,每
								<input class="easyui-numberspinner" data-options="min:1,max:60" style="width: 80px;" value="0" id="minEnd"></input>
								分钟执行一次
							</li>
						<li>
							<input type="radio" name="minTypeChoice" value="c">指定
							<div id="minCheckList"></div>
						</li>
					</ul>
				</div>
				<!-- 小时标签 -->
				<div title="小时" id="tbiHour" style="padding: 10px">
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
				<div title="星期" id="tbiWeek" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="weekTypeChoice" id="weekId" checked="checked" value="?">每星期
						</li>
						<li>
							<input type="radio" name="weekTypeChoice" id="weekId2" value="c">指定
							<div id="weekCheckList"></div>
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
							<td>分钟</td>
							<td>小时</td>
							<td>日</td>
							<td>月</td>
							<td>星期</td>
						</tr>
						<tr>
							<td>表达式字段:</td>
							<td><input id="exSec" /></td>
							<td><input id="exMin" /></td>
							<td><input id="exHour" /></td>
							<td><input id="exDay" /></td>
							<td><input id="exMon" /></td>
							<td><input id="exWeek" /></td>
						</tr>
						<tr>
							<td>Cron 表达式:</td>
							<td colspan="5"><input id="txtCron" style="width: 100%" /></td>
							<td><input type="button" value="反解析到UI " id="btnParse" /></td>
						</tr>
					</table>
				</div>
			</fieldset>
		</div>
		<div id="Cbuttons">
			<input type="button" value="生成 cron表达式" id="btnGen"/>
		</div>
	</div>
</body>
</html>

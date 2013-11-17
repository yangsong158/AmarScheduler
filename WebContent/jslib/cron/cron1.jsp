<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html>
<head>
<title>cron表达式生成</title>
<script type="text/javascript"
	src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
<script type="text/javascript"
	src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
<link rel="stylesheet" type="text/css"
	href="<c:url value='/jslib/cron/css/style.css' />"></link>
<link rel="stylesheet" type="text/css"
	href="<c:url value='/jslib/easyui/themes/default/easyui.css' />"></link>
<link rel="stylesheet" type="text/css"
	href="<c:url value='/jslib/easyui/themes/icon.css' />"></link>
</head>

<body>
	<div id="cronContainer">
		<div id="cChoice">
			<div class="easyui-tabs" style="width: 700px; height: 250px">
				<!-- 分钟标签 -->
				<div title="分钟" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="rMin" checked="checked" value="*">周期 从 
								<input class="easyui-numberspinner" data-options="min:0,max:60" style="width: 80px;" value="0" id="minStart">
								分钟开始,每
								<input class="easyui-numberspinner" data-options="min:1,max:60" style="width: 80px;" value="0" id="minEnd"></input>
								分钟执行一次
							</li>
						<li>
							<input type="radio" name="rMin" value="c">指定
							<div id="minPanel"></div>
						</li>
					</ul>
				</div>
				<!-- 小时标签 -->
				<div title="小时" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="rHour" id="hourId" checked="checked" value="*">每小时
						</li>
						<li>
							<input type="radio" name="rHour" id="hourId2" value="c">指定
							<div id="hourPanel"></div>
						</li>
					</ul>
				</div>
				<!-- 日标签 -->
				<div title="日" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="rDay" id="dayId" checked="checked" value="*">每日
						</li>
						<li>
							<input type="radio" name="rDay" id="dayId2" value="c">指定
							<div id="dayPanel"></div>
						</li>
					</ul>
				</div>
				<!-- 月标签 -->
				<div title="月" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="rMon" id="monId" checked="checked" value="?">每月
						</li>
						<li>
							<input type="radio" name="rMon" id="monId2" value="c">指定
							<div id="monPanel"></div>
						</li>
					</ul>
				</div>
				<!-- 星期标签 -->
				<div title="星期" style="padding: 10px">
					<ul>
						<li>
							<input type="radio" name="rWeek" id="weekId" checked="checked" value="?">每星期
						</li>
						<li>
							<input type="radio" name="rWeek" id="weekId2" value="c">指定
							<div id="weekPanel"></div>
						</li>
					</ul>
				</div>
			</div>

		</div>
		<div id="Cres">
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
							<td><input type="button" value="反解析到UI " id="btnFan" /></td>
						</tr>
					</table>
				</div>
			</fieldset>
		</div>
		<div id="Cbuttons">
			<input type="button" value="生成 cron表达式" id="btnGen"/>
		</div>
	</div>
	<script type="text/javascript"
		src="<c:url value='/jslib/cron/js/common.js' />"></script>
</body>
</html>

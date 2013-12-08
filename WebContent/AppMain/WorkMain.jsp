<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>批量定制调度平台</title>
<link href="<c:url value='/jslib/qui/css/import_basic.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/jslib/qui/skins/lightBlue/style.css' />" rel="stylesheet" type="text/css"/>
<link href="<c:url value='/AppMain/skin/style.css' />" rel="stylesheet" type="text/css"/>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/main.js' />"></script>
<script type="text/javascript" src="<c:url value='/AppMain/js/office.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
<script>

//选项卡数据
var tabData={"list":[
	{id:"1",name:"任务管理",group:[
		{children:[
			{id:"1-1",name:"任务文件",link:"./WorkTask/TaskFileMainTab.jsp",target:"frmright",icon:"./icons/task_unit.png"},
			{id:"1-2",name:"触发器", link:"./WorkTask/TriggerManage.jsp",target:"frmright",icon:"./icons/trigger.png"},
		]}
	]},
	{id:"3",name:"日志监控",group:[
		{children:[
			{id:"3-1",name:"作业日志",link:"./LogManager/LogManagerMain.jsp",target:"frmright",icon:"./icons/log.png"}
			//{id:"3-2",name:"任务监控",link:"./LogManager/ProcessMonitorMain.jsp",target:"frmright",icon:"./icons/task_monitor.png"}
		]}
	]},
	{id:"4",name:"系统设置",group:[
		{children:[
			{id:"4-1",name:"查看ARE",link:"./SystemSetting/ViewARE.jsp",target:"frmright",icon:"./icons/are_setting.png"},
			{id:"4-3",name:"数据源设置",link:"./SystemSetting/DBConfigManage.jsp",target:"frmright",icon:"./icons/db_setting.png"}
		]},
		{children:[
			{id:"4-4",name:"Agent服务",link:"./SystemSetting/AgentServerSetting.jsp",target:"frmright",icon:"./icons/server_setting.png"},
		]},
		{children:[
			{id:"4-5",name:"用户管理",link:"./SystemSetting/UserManage.jsp",target:"frmright",icon:"./icons/user_manage.png"},
		]}				
	]}
]}
//菜单数据
var menuData={"list":[
		{id:"9",name:"返回主页",iconSrc:"skin/officeMenu/icon_8.png",url:"javascript:backHome();"}
	]};
	
$(function(){
	//初始化选项卡
	createOfficeTab(tabData);
});
//主页面每过10秒发一次请求，防止session超时
setInterval(function(){
	$.ajax({
		   type: "GET",
		   url: YSCore.getURIAddr("/Frame/tools/SessionHolder.jsp"),
		   cache: false,
		   dataType:"text"
		});
},10000);
</script>
<style>
a {
	behavior:url(../jslib/qui/js/method/focus.htc)
}
</style>
</head>
<body>
<div id="mainFrame">
<div class="officeMenu" id="officeMenu"><span class="top_menuBtn" href="javascript:;">button</span></div>
<!--头部与导航start-->
<div id="hbox">
	<div id="bs_bannercenter">
	<div id="bs_bannerleft">
	<div id="bs_bannerright">
		<div class="top_title">AmarScheduler作业调度监控平台</div>
		<!-- 
		<div class="top_info">
			<div class="info_left"></div>
			<div class="info_center">
				欢迎用户：admin 权限：管理员
			</div>
			<div class="info_right"></div>
			<div class="clear"></div>
		</div>
		 -->
		<div class="top_font">
			<li class="fontTitle"><a href="../Frame/tools/SessionOut.jsp" >&nbsp;退&nbsp;出&nbsp;</a></li>
			<div class="clear"></div>	
		</div>
		
	</div>
	</div>
	</div>
	<div id="bs_navcenter">
	<div id="bs_navleft">
	<div id="bs_navright">
		
	</div>
	</div>
	</div>
</div>
<!--头部与导航end-->

<table width="100%" cellpadding="0" cellspacing="0" class="table_border0">
	<tr>
		<!--右侧区域start-->
		<td class="ali01 ver01"  width="100%">
							<div id="rbox">
								<div id="rbox_topcenter">
								<div id="rbox_topleft">
								<div id="rbox_topright">
								</div>
								</div>
								</div>
								<div id="rbox_middlecenter">
								<div id="rbox_middleleft">
								<div id="rbox_middleright">
									<div id="bs_right">
									       <IFRAME height="100%" width="100%" frameBorder=0 id=frmright name=frmright src="open.html"  allowTransparency="true"></IFRAME>
									</div>
								</div>
								</div>
								</div>
								<div id="rbox_bottomcenter" >
								<div id="rbox_bottomleft">
								<div id="rbox_bottomright">
								</div>
								</div>
								</div>
							</div>
		</td>
		<!--右侧区域end-->
	</tr>
</table>

<!--尾部区域start-->
<div id="fbox">
	<div id="bs_footcenter">
	<div id="bs_footleft">
	<div id="bs_footright">
		<div class="bs_foot_content">
			&nbsp;
		</div>	
		<div class="bs_foot_info">
				<script>
					var weekDayLabels = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
					var now = new Date();
				    var year=now.getFullYear();
					var month=now.getMonth()+1;
					var day=now.getDate()
				    var currentime = year+"年"+month+"月"+day+"日 "+weekDayLabels[now.getDay()]
					document.write(currentime)
				</script>
		</div>
	</div>
	</div>
	</div>
</div>
</div>
<!--尾部区域end-->

<!--浏览器resize事件修正start-->
<div id="resizeFix"></div>
<!--浏览器resize事件修正end-->

<!--窗口任务栏区域start-->
<div id="dialogTask" class="dialogTaskBg" style="display:none;"></div>
<!--窗口任务栏区域end-->

<!--载进度条start-->
<div class="progressBg" id="progress" style="display:none;"><div class="progressBar"></div></div>
<!--载进度条end-->
</body>
</html>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<title>AmarSoft批量调度平台登录</title>
<link href="login/style.css" rel="stylesheet" type="text/css" id="skin"/>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/qui/js/method/center-plugin.js' />"></script>
<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
</head>
<body>
	<div class="login_main">
		<div class="login_top">
		</div>
		<div class="login_middle">
			<div class="login_middleleft"></div>
			<div class="login_middlecenter">
					<form id="loginForm" class="login_form" method="post">
					<div class="login_user"><input type="text" id="userId" value="A002" /></div>
					<div class="login_pass"><input type="password" id="userPass" value="A"/></div>
					<div class="clear"></div>
					<div class="login_button">
						<div class="login_button_left"><input type="button" onclick="login()"/></div>
						<div class="login_button_right"><input type="reset" value="" /></div>
						<div class="clear"></div>
					</div>
					</form>
					<div class="login_info" style="display:none;"></div>
			</div>
			<div class="login_middleright"></div>
			<div class="clear"></div>
		</div>
		<div class="login_bottom">
			<div class="login_copyright">版权所有：http://www.quickui.net</div>
		</div>
	</div>
<script>
	$(function(){
		//居中
		 $('.login_main').center();
		 $("#userId").focus();
		 $("#userId").keydown(function(event){
		 	if(event.keyCode==13){
				login();
			}
		 });
		 $("#userPass").keydown(function(event){
		 	if(event.keyCode==13){
				login();
			}
		 });
		 
	});

	//登录
	function login() {
		var errorMsg = "";
		var userId = $("#userId").val();
		var userPass = $("#userPass").val();
		if(!userId){
			errorMsg += "&nbsp;&nbsp;用户名不能为空!";
		}
		if(!userPass){
			errorMsg += "&nbsp;&nbsp;密码不能为空!";
		}

		if(errorMsg != ""){
			$(".login_info").html(errorMsg);
			$(".login_info").show();
		}
		else{
			$(".login_info").show();
			$(".login_info").html("&nbsp;&nbsp;正在登录中...");
			//window.location="main.html";
			var para = {
					"userId":userId,
					"userPass":userPass,
					"sessionId":"<%=session.getId()%>"
			};
			YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.UserLoginCommandImpl",para,function(data){
				if(data["error"]==true||data["error"]=="true"){
					$(".login_info").html(data["message"]);
				}else{
					var authKey = data["authKey"];
					if(authKey){
						$.ajax({
						   type: "POST",
						   url: YSCore.getURIAddr("/Frame/tools/AuthKeyInSession.jsp",{"authKey":authKey}),
						   cache: false,
						   dataType:"text",
						   asyn:true,
						   success:function(){
								window.location="WorkMain.jsp";
						   }
						});
					}
				}
			});
		}
	}
</script>
</body>
</html>


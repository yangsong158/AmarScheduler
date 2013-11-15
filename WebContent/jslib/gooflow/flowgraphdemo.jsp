<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>查看工作流程</title>
	<!-- easyui -->
	<script type="text/javascript" src="<c:url value='/jslib/gooflow/js/jquery-1.8.3.min.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/gooflow/js/GooFunc.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/gooflow/js/GooFlow.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/gooflow/js/ys-flowgraph-1.0.js' />"></script>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/gooflow/css/default.css' />"></link>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/gooflow/css/gooflow.css' />"></link>
	<!--[if lt IE 9]>
	<?import namespace="v" implementation="#default#VML" ?>
	<![endif]-->	
	<script type="text/javascript">
	$(document).ready(function(){
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.FlowGraphShowCommandImplDemo",null,function(data){
			$("#flowgraph").flowgraph(data,{
				gooFlowRemark : {
					cursor:"选择指针",
					direct:"连接线",
					start:"开始结点",
					end:"结束结点",
					node:"任务单元",
					group:"建立新的运行分支"
				},
				gooFlowProperty : {
					haveHead:true                   ,//如果haveHead=true，则定义HEAD区的按钮
					haveTool:true                   ,
					width : $(document).width()     ,
					height : $(document).height()   ,
					toolBtns:["start","end","node"] ,
					headBtns:["save","undo","redo","reload"],
					haveGroup:true                  ,
					useOperStack:true
				}
			});
		});
	});
	</script>
</head>
<body>
	<div id="flowgraph"></div>
</body>
</html>
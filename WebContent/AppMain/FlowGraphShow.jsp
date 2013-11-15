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
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/gooflow/css/default.css' />"></link>
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/gooflow/css/demo1.css' />"></link>
	<!--[if lt IE 9]>
	<?import namespace="v" implementation="#default#VML" ?>
	<![endif]-->	
	<script type="text/javascript">
	var property={
		haveHead:true,//如果haveHead=true，则定义HEAD区的按钮
		haveTool:true,
		toolBtns:["start","end","node"],
		headBtns:["save","undo","redo","reload"],
		haveGroup:true,
		useOperStack:true
	};
	var remark={
		cursor:"选择指针",
		direct:"连接线",
		start:"开始结点",
		end:"结束结点",
		node:"任务单元",
		group:"建立新的运行分支"
	};
	$(document).ready(function(){
		var wpWidth = $(document).width();
		var wpHeight = $(document).height();
		property["width"]=wpWidth;
		property["height"]=wpHeight; 
		
		var drawArea=$.createGooFlow($("#drawArea"),property);
		drawArea.setNodeRemarks(remark);
		drawArea.onItemDel=function(id,type){
			return confirm("确定要删除该单元吗?");
		};
		
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.FlowGraphShowCommandImpl",null,function(data){
			var rootNode = data;
			//数据准备
			jsondata={
 				nodes:genNodes(rootNode,wpWidth-20,wpHeight), 
/* 				nodes:{
					start_node : {name : "开始"      ,left : 67  ,top : 69 ,type : "start" ,width : 24 ,height : 24},
					unit1      : {name : "任务单元1"  ,left : 219 ,top : 71 ,type : "node"  ,width : 86 ,height : 24},
					end_node   : {name : "结束"      ,left : 380 ,top : 71 ,type : "end"   ,width : 25 ,height : 24}
				}, 
				lines:{
					drawArea_line_3 : {type : "sl" ,from : "start_node" ,to : "unit1"    ,name : "" ,marked : false},
					drawArea_line_6 : {type : "sl" ,from : "unit1"      ,to : "end_node" ,name : "" ,marked : false}
				},
				areas:{
					drawArea_area_8 : {name:"Target1",left:35,top:39,color:"red",width:472,height:114}
				}
				*/
				title:"任务执行流程图"
			};
			//加载生成
			drawArea.loadData(jsondata);
		});
	});
	function genNodes(rootNode,wpWidth,wpHeight){
		var totalNeedWidth = rootNode["maxBreadth"] * 200;
		var totalNeedHeight = rootNode["maxDepth"] * 100;
		var startNodeX = totalNeedWidth/2-10;
		var nodes = {
				start_node : {name : rootNode["describe"] ,left : startNodeX  ,top : 10 ,type : "start" ,width : 25 ,height : 25},
				unit1      : {name : "任务单元1"  ,left : 10 ,top : 105 ,type : "node"  ,width : 190 ,height : 40},
				end_node : {name : "结束" ,left : startNodeX  ,top : totalNeedHeight ,type : "end" ,width : 25 ,height : 25}
		};
		
		
		return nodes;
		
	};
	</script>
</head>
<body>
<div id="drawArea"></div>
</body>
</html>
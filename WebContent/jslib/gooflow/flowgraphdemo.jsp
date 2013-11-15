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
	<link rel="stylesheet" type="text/css" href="<c:url value='/jslib/gooflow/css/gooflow.css' />"></link>
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
		
		YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.FlowGraphShowCommandImplDemo",null,function(data){
			var rootNode = data;
			var nodesData = {};
			var linesData = {};
			genNodes(rootNode,nodesData,linesData,wpWidth-20,wpHeight);
			//数据准备
			jsondata={
 				nodes : nodesData, 
 				lines : linesData,
				title:"任务执行流程图"
			};
			//加载生成
			drawArea.loadData(jsondata);
		});
	});
	function genNodes(rootNode,nodesData,linesData,wpWidth,wpHeight){
		var totalNeedWidth = rootNode["maxBreadth"] * 200;
		var totalNeedHeight = rootNode["maxDepth"] * 100;
		var startNodeX = totalNeedWidth/2-10;
		nodesData["a0"] = {name : rootNode["describe"] ,left : startNodeX  ,top : 10 ,type : "start" ,width : 25 ,height : 25};
		nodesData["z9"] = {name : "结束"                ,left : startNodeX  ,top : totalNeedHeight ,type : "end" ,width : 25 ,height : 25};
		rootNode["_fg_nodeId"] = "a0";
		
		convertNodes(nodesData,linesData,rootNode,10,1,1);
	};
	function convertNodes(nodesData,linesData,startNode,marginLeft,xIdx,yIdx){
		var children = startNode["nextUnits"];
		if(!children||children.length==0)return;
		for(var i=0;i<children.length;i++){
			var node = children[i];
			if(node["unitNodeType"]==9)continue;
			
			var needWidth = node["maxBreadth"]*200;				//需要的宽度=节点最大广度*单个节点宽度(200)
			var nodeMarginLeft = marginLeft+needWidth/2-95;		//节点左起位置
			node["_fg_nodeId"] = node["name"];					//给节点起一个名字
			//生成一个新节点
			nodesData[node["_fg_nodeId"]] = {
					name   : node["describe"] ,
					left   : nodeMarginLeft ,
					top    : yIdx*100 ,
					type   : "node" , 
					width  : 190 ,
					height : 40
			};
			//生成一条线
			linesData[startNode["_fg_nodeId"]+"_T_"+node["_fg_nodeId"]] = {
					type : "sl",
					from : startNode["_fg_nodeId"],
					to   : node["_fg_nodeId"],
					name : "",
					mark : false
			};
			
			//如果是结尾结点，还要生成一条向结束结点的线
			if(node["last"]){
				linesData[node["_fg_nodeId"]+"_T_z9"] = {
						type : "sl",
						from : node["_fg_nodeId"],
						to   : "z9",
						name : "",
						mark : false
				};				
			}
			
			//下一个节点，向右偏移
			marginLeft += needWidth;
			//递归子节点
			convertNodes(nodesData,linesData,node,nodeMarginLeft+95-needWidth/2,xIdx,yIdx+1);
		}
	}
	</script>
</head>
<body>
<div id="drawArea"></div>
</body>
</html>
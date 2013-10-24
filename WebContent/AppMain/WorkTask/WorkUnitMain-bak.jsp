<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title></title>
<!--框架必需start-->
<script type="text/javascript" src="../../jslib/qui/js/jquery.js"></script>
<script type="text/javascript" src="../../jslib/qui/js/framework.js"></script>
<link href="../../jslib/qui/css/import_basic.css" rel="stylesheet" type="text/css"/>
<link href="../../jslib/qui/skins/blue/style.css" rel="stylesheet" type="text/css" id="theme"/>
<!--框架必需end-->

<!--基本选项卡start-->
<script type="text/javascript" src="../../jslib/qui/js/nav/dynamicTab.js"></script>
<!--基本选项卡end-->
</head>
<body>
	<div id="tab_menu"></div>
	<div id="page" style="width:99%;height:85%;border:solid 1px #cccccc;"></div>
<script>
var tabView;
$(function() {
	tabView = new TabView( {
		containerId :'tab_menu',
		pageid :'page',
		cid :'tab1',
		position :"top"
	});
	tabView.add( {
		id :'tab_idx_1',
		title :"task文件",
		url :"TaskFileManage.jsp",
		isClosed :false
	});
/* 	tabView.add( {
		id :'tab_idx_2',
		title :"选项卡2",
		url :"/qui/sample/nav/tab-basic-content2.jsp",
		isClosed :true
	}); */
	tabView.activate("tab_idx_1");
	$("#page").width($("body").width()-5);
	$("#page").height($("body").height()-$("#tab_menu").height()-35);
});
var i=0;
function openInTab(itemId,itemTitle,itemURL){
	var titleLen = 8;
	itemId = itemId.replace(/\.xml/gi,"");
	itemTitle = itemTitle.replace(/\.xml/gi,"");
	if(itemTitle.length>titleLen){
		var prefix = false;
		if(itemTitle.length>=titleLen+1) prefix = true;
		itemTitle = itemTitle.substring(itemTitle.length-titleLen);
		if(prefix) itemTitle = ".."+itemTitle;
	}
	if(itemId&&itemTitle&&itemURL){
		tabView.add( {
			id : itemId,
			title : itemTitle,
			url : itemURL,
			isClosed :true
		});	
	}
}
</script>
</body>
</html>
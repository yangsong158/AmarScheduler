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
<div class="box1" panelWidth="800">
 	<fieldset> 
     <legend>1、基本使用</legend>
   <div id="tab_menu"></div>
	<div id="page" style="width:95%;height:300px;border:solid 1px #cccccc;"></div>
	  </fieldset>
	  <div class="height_15"></div>
	  
	  <legend>2、标签在底部</legend>
  <div id="page2" style="width:95%;height:300px;border:solid 1px #cccccc;"></div>
	<div id="tab_menu2"></div>
	  </fieldset>
</div>
<script>
$( function() {
	 var tab = new TabView( {
		containerId :'tab_menu',
		pageid :'page',
		cid :'tab1',
		position :"top"
	});
	tab.add( {
		id :'tab1_index1',
		title :"选项卡1",
		url :"/qui/sample/nav/tab-basic-content1.jsp",
		isClosed :false
	});
	tab.add( {
		id :'tab1_index2',
		title :"选项卡2",
		url :"/qui/sample/nav/tab-basic-content2.jsp",
		isClosed :false
	});
	tab.add( {
		id :'tab1_index3',
		title :"选项卡3",
		url :"/qui/sample/nav/tab-basic-content1.jsp",
		isClosed :true
	});
	tab.activate("tab1_index1")
	
	 var tab2 = new TabView( {
		containerId :'tab_menu2',
		pageid :'page2',
		cid :'tab2',
		position :"bottom"
	});
	tab2.add( {
		id :'tab2_index1',
		title :"选项卡1",
		url :"/qui/sample/nav/tab-basic-content1.jsp",
		isClosed :false
	});
	tab2.add( {
		id :'tab2_index2',
		title :"选项卡2",
		url :"/qui/sample/nav/tab-basic-content2.jsp",
		isClosed :false
	});
	tab.activate("tab2_index1")
});
</script>
</body>
</html>
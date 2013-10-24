<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="../demo.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
</head>
<style type="text/css">
html,body{margin:0px;padding:0px; height:100%;}
#mainTabs{
	margin:0px;
	border:0px solid #F00;
	height:100%;
}
iframe{
	width:100%;
	height:100%;
}
.tabs-header{
	border:0px solid #0F0;
}
.tabs-panels{
	border:0px solid #F00;
}
</style>
<body>
    <div id="mainTabs" class="easyui-tabs"></div>
</body>
</html>
<script language="javascript" type="text/javascript">
	var tabsView;
	$(document).ready(function(){
		tabsView = $('#mainTabs');		
		tabsView.tabs({
			width:tabsView.parent().width(),
			height:tabsView.parent().height()
		});
		$.extend(tabsView,{
			tabsId:{},
	  		toggleTab:function(itemId,itemTitle,itemURL,itemClosable){
	  			if(!this.tabsId[itemId]){
	  				this.tabsId[itemId] = true;
					tabsView.tabs('add',{
			            title: itemTitle,
			            content: '<iframe scrolling="auto" frameborder="0"  src="'+itemURL+'"></iframe>',
			            closable: itemClosable
			        }); 
	  			}
	  		}
		});
		
		tabsView.toggleTab("A","Tab0","TaskFileManage.jsp",false);
		tabsView.toggleTab("A","Tab0","TaskFileManage.jsp",false);
	});
</script>
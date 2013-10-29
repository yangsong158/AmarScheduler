<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
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
		tabsView.openTabIdx = {};
		tabsView.tabs({
			fit:true,											//宽度、高度自动填充父容器
			onBeforeClose: function(title,index){
				var tabItem =  tabsView.tabs('getTab',index);
				delete tabsView.openTabIdx[tabItem.tabItemId];	//删除之前，先清除缓存中的已打开记录
				return true;
			},
			onClose : function(title,index){
				tabsView.rebuilTabIdx();						//删除之后，重新建立tab项ID与索引的对照关系
			}
		});
		$.extend(tabsView,{
	  		toggleTabItem : function(itemId,itemTitle,itemURL,itemClosable){
	  			if(typeof(tabsView.openTabIdx[itemId]) === "undefined"){
					tabsView.tabs('add',{
			            title: itemTitle,
			            content: '<iframe scrolling="auto" frameborder="0"  src="'+itemURL+'"></iframe>',
			            closable: itemClosable,
			            selected:true
			        }); 
					var tabItem =  tabsView.tabs('getTab', tabsView.tabs("tabs").length-1);
					tabItem.tabItemId = itemId;					//把当前项的id存到当前项上
					tabsView.rebuilTabIdx();					//添加后，也需要重新建立tabId与索引的对照关系
	  			}else{
	  				var tabIdx = tabsView.openTabIdx[itemId];
	  				tabsView.tabs("select",tabIdx);				//如果已经打开了，则只需要再次选中即可
	  			}
	  		},
	  		rebuilTabIdx:function(){
	  			var tabItems = tabsView.tabs("tabs");
	  			for(var i=0;i<tabItems.length;i++){
	  				tabsView.openTabIdx[tabItems[i].tabItemId]=i;
	  			}
	  		}
		});
		
		
		tabsView.toggleTabItem("MessageDataView","消息查看","MessageDataView.jsp",false);
		tabsView.toggleTabItem("MessageTemplete","消息模板","MessageTemplete.jsp",false);
		tabsView.tabs("select",0);
	});
</script>
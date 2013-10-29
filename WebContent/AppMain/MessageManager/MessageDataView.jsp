<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>消息数据查看</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
</head>
<body>
	<div class="easyui-panel" title="已产生的消息数据" data-options="fit:true">
	    <table id="targetList" class="easyui-datagrid"
	            data-options="
	            url:'MessageDataView-json-list.jsp',
	            rownumbers:true,
	            fit:true,
	            singleSelect:true
	            ">				
			<thead>
	            <tr>
	                <th data-options="field:'crateTime',width:130">产生时间</th>
	                <th data-options="field:'msgType',width:70">消息类型</th>
	                <th data-options="field:'sendTarget',width:200">发送对象</th>
	                <th data-options="field:'msgContent',width:800">内容</th>
	            </tr>
	        </thead>
	       </table>
	</div>

</body>
</html>
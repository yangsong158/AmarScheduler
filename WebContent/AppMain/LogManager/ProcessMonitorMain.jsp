<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>运行中任务监控</title>
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/default/easyui.css' />">
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/easyui/themes/icon.css' />">
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.min.js' />"></script>
    <script type="text/javascript" src="<c:url value='/jslib/easyui/jquery.easyui.min.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/easyui/datagrid-groupview.js' />"></script>
	<style type="text/css">
	.groupRow{
		color:#00F;
	}
	</style>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" title="当前正在运行的任务" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'west',split:true" style="width:479px;padding:1px">
				<!-- 列表数据 -->
			    <table id="processList" class="easyui-datagrid"
			            data-options="
			            rownumbers:true,
			            fit:true,
			            singleSelect:true,
			            url:'ProcessMonitorMain-json-list.jsp',
			            method:'get'">
			        <thead>
			            <tr>
			                <th data-options="field:'procId',width:50">任务ID</th>
			                <th data-options="field:'procAddr',width:250">任务地址</th>
			                <th data-options="field:'procStartTime',width:150">启动时间</th>
			            </tr>
			        </thead>
			    </table>	
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div>请选择一个任务</div>
			</div>
		</div>
	</div>

    <script type="text/javascript">
    </script>
</body>
</html>
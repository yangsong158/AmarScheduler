<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TASK文件详情</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
</head>
<body>
	<!-- 最外层的panel -->
    <div class="easyui-panel" title="查看/编辑Task文件" data-options="fit:true">
    	<!-- 内层的左右布局 -->
        <div class="easyui-layout" data-options="fit:true" >
        	<!-- 左部分的列表 -->
            <div data-options="region:'west',split:true" style="width:520px;padding:4px">
				<div style="padding:5px;border:0px solid #369;width:500px;">
			        <a href="#" class="easyui-linkbutton" data-options="plain:false">调试/运行</a>
			        <a href="#" class="easyui-linkbutton" data-options="plain:false,iconCls:'icon-edit'">查看/编辑</a>
			        <a href="#" class="easyui-linkbutton" data-options="plain:false">查看依赖</a>
			    </div>
			    <table title="task任务文件配置信息" class="easyui-treegrid" style="width:500px;" 
			            data-options="
			                url: 'TaskTargetUnitData.jsp',
			                method: 'get',
			                rownumbers: true,
			                idField: 'id',
			                treeField: 'name',
			                animate: true
			            ">
			        <thead>
			            <tr>
			                <th data-options="field:'name'" width="200">名称</th>
			                <th data-options="field:'describe'" width="300">功能说明</th>
			            </tr>
			        </thead>
			    </table>
            </div>
            <!-- 右部的编辑详细信息部分 -->
            <div data-options="region:'center'" style="padding:4px">
				<div style="padding:5px;border:0px solid #369;width:500px;">
			        <a href="#" class="easyui-linkbutton" data-options="plain:false">保存</a>
			        <a href="#" class="easyui-linkbutton" data-options="plain:false">取消</a>
			    </div>
				<table id="pg" class="easyui-propertygrid" style="width:300px" data-options="
                	url:'TargetInfo.jsp',
                	method:'get',
                	fit:true,
                	showGroup:true,
                	scrollbarSize:0,
                	columns: [[
            				{field:'name' ,title:'属性名称' ,width:80,sortable:false},
               				{field:'value',title:'属性值'   ,width:150,resizable:false,sortable:false}
        				]]
                	">
    			</table>
            </div>
        </div>
    </div>
    
 
</body>
</html>
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
	<script type="text/javascript" src="../../jslib/easyui/datagrid-groupview.js"></script>
	<style type="text/css">
	.groupRow{
		color:#00F;
	}
	</style>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" title="参数文件关联列表" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'west',split:true" style="width:509px;padding:1px">
			<div id="tb" style="padding:5px;height:auto">
			       <div>
			           开始时间: <input class="easyui-datebox" style="width:80px">
			           结束时间: <input class="easyui-datebox" style="width:80px">
			           <a href="#" class="easyui-linkbutton" iconCls="icon-search">Search</a>
			       </div>
			       <div style="margin-bottom:5px">
			           <a href="#" class="easyui-linkbutton" iconCls="icon-remove" plain="true"></a>
			           <a href="#" class="easyui-linkbutton" iconCls="icon-edit" plain="true"></a>
			       </div>
			   </div>			
				<!-- 列表数据 -->
			    <table id="targetList" class="easyui-datagrid" style="width:500px;height:300px;"
			            data-options="
			            rownumbers:true,
			            fit:true,
			            singleSelect:false,
			            checkOnSelect:false,
			            url:'LogManagerMain-json-list.jsp',
			            method:'get',
			            view:groupview,
						groupField:'fileDate',
						groupFormatter:function(value,rows){
                    		return '<div class=groupRow>'+value+'-['+rows.length+']'+'</div>';
						}">
			        <thead>
			            <tr>
			                <th data-options="field:'fileName',width:200,checkbox:true">文件名称</th>
			                <th data-options="field:'fileSize',width:100">文件大小</th>
			                <th data-options="field:'createTime',width:170">生成时间</th>
			            </tr>
			        </thead>
			    </table>	
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div>请双击一个日志文件</div>
			</div>
		</div>
	</div>
</body>
</html>
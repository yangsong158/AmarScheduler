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
				<!-- 列表数据 -->
			    <table id="targetList" class="easyui-datagrid" style="width:500px;height:300px;"
			            data-options="
			            rownumbers:true,
			            fit:true,
			            singleSelect:true,
			            url:'FileTargetList-json.jsp',
			            method:'get',
			            view:groupview,
						groupField:'taskFileInfo',
						groupFormatter:function(value,rows){
                    		return '<div class=groupRow>'+value+'('+rows.length+')'+'</div>';
						},			            
			            toolbar:toolbar">
			        <thead>
			            <tr>
			                <th data-options="field:'targetName',width:200">target名称</th>
			                <th data-options="field:'targetDescribe',width:270">target描述</th>
			            </tr>
			        </thead>
			    </table>	
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div>请选择一个target,并选择查看方式</div>
			</div>
		</div>
	</div>

    <script type="text/javascript">
		var targetGrid = $("#targetList");
        var toolbar = [
		'-',
		{
            text:'以表格查看',
            iconCls:'icon-edit',
            handler:function(){
            	var row = targetGrid.datagrid("getSelected");
            	alert(row.targetName);
            }
        },{
            text:'以图形查看',
            iconCls:'icon-edit',
            handler:function(){alert('save');}
        },
        '-',
        {
            text:'全部收起',
            iconCls:'icon-edit',
            handler:function(){
            	targetGrid.datagrid("collapseGroup");
            	
            }
        },        
        {
            text:'全部展开',
            iconCls:'icon-edit',
            handler:function(){
            	targetGrid.datagrid("expandGroup");
            }
        }, 
        '-',
        {
            text:'运行',
            iconCls:'icon-edit',
            handler:function(){
            }
        }, 
        '-'
        ];
    </script>
</body>
</html>
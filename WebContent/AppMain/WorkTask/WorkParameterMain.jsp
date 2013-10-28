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
	<div class="easyui-panel" title="参数文件关联列表" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'west',split:true" style="width:609px;padding:1px">
				<!-- 列表数据 -->
			    <table class="easyui-datagrid" style="width:600px;height:300px;"
			            data-options="rownumbers:true,singleSelect:true,url:'ParameterFileList-json.jsp',method:'get',toolbar:toolbar">
			        <thead>
			            <tr>
			                <th data-options="field:'name',width:120">文件名</th>
			                <th data-options="field:'describe',width:180">文件说明</th>
			                <th data-options="field:'remark',width:269">备注</th>
			            </tr>
			        </thead>
			    </table>	
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<table id="ParameterList" class="easyui-propertygrid" style="width:300px" data-options="
                	url:'ParameterFileInfo-json.jsp',
                	method:'get',
                	fit:true,
                	showGroup:false,
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

    <script type="text/javascript">
        var toolbar = [{
            text:'新建关联',
            iconCls:'icon-add',
            handler:function(){alert('add');}
        },{
            text:'查看参数',
            iconCls:'icon-edit',
            handler:function(){alert('cut');}
        },'-',{
            text:'删除关联',
            iconCls:'icon-remove',
            handler:function(){alert('save');}
        }];
    </script>
</body>
</html>
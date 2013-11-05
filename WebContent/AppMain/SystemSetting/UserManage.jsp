<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>用户管理</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/myui/skins/default/css/form.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" title="用户管理" data-options="fit:true">
		<!-- 列表数据 -->
	    <table id="targetList" class="easyui-datagrid"
	            data-options="
	            url:'UserManage-json-list.jsp',
	            rownumbers:true,
	            fit:true,
	            singleSelect:true,
	            toolbar:toolbar
	            ">				
			<thead>
	            <tr>
	                <th data-options="field:'userId',width:100">用户id</th>
	                <th data-options="field:'userName',width:150">用户名</th>
	                <th data-options="field:'userStatus',width:60">状态</th>
	            </tr>
	        </thead>
	       </table>
	</div>

    <script type="text/javascript">
    var toolbar = [
           		'-',
           		{
                       text:'新建用户',
                       iconCls:'icon-add',
                       handler:function(){
                       }
                   },{
                       text:'删除用户',
                       iconCls:'icon-remove',
                       handler:function(){
                    	   alert('del');
                    	}
                   },{
                       text:'禁用/启用',
                       handler:function(){
                    	   alert('del');
                    	}
                   },
                   '-'
                   ];    
    </script>
</body>
</html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>触发器管理</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/myui/skins/default/css/form.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="../../jslib/myui/skins/default/rendered.js"></script>
    <style type="text/css">
    #fi_triggerId{width:200px}
    #fi_triggerName{width:200px}
    #fi_triggerType{width:200px}
    #fi_triggerTime{width:200px}
    #fi_relaTarget{width:600px}
    #fi_triggerRemark{width:600px;}
    </style>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" title="触发器管理" data-options="fit:true">
    	<!-- 内层的左右布局 -->	
		<div class="easyui-layout" data-options="fit:true">
        	<!-- 左部分的列表 -->		
			<div data-options="region:'north',split:true" style="height:300px;padding:1px" >
				<!-- 列表数据 -->
			    <table id="targetList" class="easyui-datagrid"
			            data-options="
			            url:'TriggerMain-json-list.jsp',
			            rownumbers:true,
			            fit:true,
			            singleSelect:true,
			            toolbar:toolbar
			            ">				
					<thead>
			            <tr>
			                <th data-options="field:'triggerId',width:100">触发器ID</th>
			                <th data-options="field:'triggerName',width:150">触发器名称</th>
			                <th data-options="field:'triggerType',width:60">触发类型</th>
			                <th data-options="field:'triggerTime',width:150">触发时间</th>
			                <th data-options="field:'relaTarget',width:190">关联任务</th>
			                <th data-options="field:'triggerRemark',width:800">详细说明</th>
			            </tr>
			        </thead>
		        </table>
			</div>
            <!-- 右部的编辑详细信息部分 -->			
			<div data-options="region:'center'" style="padding:1px">
				<div>
					<form class="myuiform">
						<table>
							<tr>
								<td><label for="fi_triggerId">触发器ID:</label></td>
								<td><input id="fi_triggerId" type="text" value="" ></input></td>
								<td><label for="fi_triggerName">触发器名称:</label></td>
								<td><input id="fi_triggerName" type="text" value="" ></input></td>
							</tr>
							<tr>
								<td><label  for="fi_triggerType">触发类型:</label></td>
								<td><input id="fi_triggerType" type="text" value="" ></input></td>
								<td><label  for="fi_triggerTime">触发时间:</label></td>
								<td><input id="fi_triggerTime" type="text" value="" ></input></td>
							</tr>
							<tr>
								<td><label  for="fi_relaTarget">关联任务:</label></td>
								<td colspan="3"><input id="fi_relaTarget" type="text" value="" ></input></td>
							</tr>
							<tr>
								<td><label  for="fi_triggerRemark">详细说明:</label></td>
								<td colspan="3"><input id="fi_triggerRemark" type="text" ></input></td>
							</tr>
							<tr>
								<td><label  for="fi_createTime">创建时间:</label></td>
								<td><input id="fi_createTime" type="text" value="" ></input></td>
								<td><label  for="fi_updateTime">更新时间:</label></td>
								<td><input id="fi_updateTime" type="text" value="" ></input></td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</div>
	</div>

    <script type="text/javascript">
    var toolbar = [
           		'-',
           		{
                       text:'新建',
                       iconCls:'icon-add',
                       handler:function(){
                       }
                   },{
                       text:'删除',
                       iconCls:'icon-remove',
                       handler:function(){
                    	   alert('del');
                    	}
                   },
                   '-'
                   ];    
    </script>
</body>
</html>
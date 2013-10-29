<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>消息模板管理</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
</head>
<body>
	<div id="tb" style="height:auto">
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" onclick="append()">新建</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" onclick="removeit()">删除</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-save',plain:true" onclick="accept()">保存</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-undo',plain:true" onclick="reject()">取消</a>
        <a href="javascript:void(0)" class="easyui-linkbutton" data-options="iconCls:'icon-search',plain:true" onclick="getChanges()">获取变化</a>
    </div>
	<div class="easyui-panel" title="消息模板管理" data-options="fit:true">
	    <table id="tplGrid" class="easyui-datagrid"
	            data-options="
	            url:'MessageTemplete-json-list.jsp',
	            rownumbers:true,
	            fit:true,
	            onClickRow: onClickRow,
	            toolbar: '#tb',
	            singleSelect:true
	            ">				
			<thead>
	            <tr>
	                <th data-options="field:'tplId',width:130,editor:'text'">模板ID</th>
	                <th data-options="field:'sendDetail',width:90,editor:{type:'checkbox',options:{on:'Y',off:'N'}}">发送详细信息</th>
	                <th data-options="field:'tplContent',width:800,editor:'text'">消息内容</th>
	            </tr>
	        </thead>
	       </table>
	</div>
</body>
</html>
<script type="text/javascript" language="javascript">
	var tplGrid = $("#tplGrid");
	$.extend($.fn.datagrid.methods, {
	    editCell: function(jq,param){
	        return jq.each(function(){
	            var opts = $(this).datagrid('options');
	            var fields = $(this).datagrid('getColumnFields',true).concat($(this).datagrid('getColumnFields'));
	            for(var i=0; i<fields.length; i++){
	                var col = $(this).datagrid('getColumnOption', fields[i]);
	                col.editor1 = col.editor;
	                if (fields[i] != param.field){
	                    col.editor = null;
	                }
	            }
	            $(this).datagrid('beginEdit', param.index);
	            for(var i=0; i<fields.length; i++){
	                var col = $(this).datagrid('getColumnOption', fields[i]);
	                col.editor = col.editor1;
	            }
	        });
	    }
	});
	
	var editIndex = undefined;
	function endEditing(){
	    if (editIndex == undefined){return true;}
	    if (tplGrid.datagrid('validateRow', editIndex)){
	    	tplGrid.datagrid('endEdit', editIndex);
	        editIndex = undefined;
	        return true;
	    } else {
	        return false;
	    }
	}
	function onClickCell(index, field){
	    if (endEditing()){
	    	tplGrid.datagrid('selectRow', index)
	                .datagrid('editCell', {index:index,field:field});
	        editIndex = index;
	    }
	}
    function onClickRow(index){
        if (editIndex != index){
            if (endEditing()){
            	tplGrid.datagrid('selectRow', index)
                        .datagrid('beginEdit', index);
                editIndex = index;
            } else {
            	tplGrid.datagrid('selectRow', editIndex);
            }
        }
    }	
    /*********/
	function append(){
	    if (endEditing()){
	    	tplGrid.datagrid('appendRow',{sendDetail:'N'});
	        editIndex = tplGrid.datagrid('getRows').length-1;
	        tplGrid.datagrid('selectRow', editIndex)
	                .datagrid('beginEdit', editIndex);
	    }
	}
	function removeit(){
	    if (editIndex == undefined){return;}
	    tplGrid.datagrid('cancelEdit', editIndex)
	            .datagrid('deleteRow', editIndex);
	    editIndex = undefined;
	}
	function accept(){
	    if (endEditing()){
	    	tplGrid.datagrid('acceptChanges');
	    }
	}
	function reject(){
		tplGrid.datagrid('rejectChanges');
	    editIndex = undefined;
	}
	function getChanges(){
	    var rows = tplGrid.datagrid('getChanges');
	    alert(rows.length+' rows are changed!');
	}    
</script>
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
			    <table class="easyui-datagrid" style="width:500px;height:300px;"
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
			</div>
		</div>
	</div>

    <script type="text/javascript">
        var toolbar = [
		'-',
		{
            text:'以表格查看',
            iconCls:'icon-edit',
            handler:function(){alert('cut');}
        },{
            text:'以图形查看',
            iconCls:'icon-edit',
            handler:function(){alert('save');}
        },
        '-',
        {
            text:'全部收起',
            iconCls:'icon-edit',
            handler:function(){alert('save');}
        },        
        {
            text:'全部展开',
            iconCls:'icon-edit',
            handler:function(){alert('save');}
        },        
        '-'
        ];
    </script>
	<script type="text/javascript">
	        var data = [
	            {"productid":"FI-SW-01","productname":"Koi","unitcost":10.00,"status":"P","listprice":36.50,"attr1":"Large","itemid":"EST-1"},
	            {"productid":"K9-DL-01","productname":"Dalmation","unitcost":12.00,"status":"P","listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
	            {"productid":"RP-SN-01","productname":"Rattlesnake","unitcost":12.00,"status":"P","listprice":38.50,"attr1":"Venomless","itemid":"EST-11"},
	            {"productid":"RP-SN-01","productname":"Rattlesnake","unitcost":12.00,"status":"P","listprice":26.50,"attr1":"Rattleless","itemid":"EST-12"},
	            {"productid":"RP-LI-02","productname":"Iguana","unitcost":12.00,"status":"P","listprice":35.50,"attr1":"Green Adult","itemid":"EST-13"},
	            {"productid":"FL-DSH-01","productname":"Manx","unitcost":12.00,"status":"P","listprice":158.50,"attr1":"Tailless","itemid":"EST-14"},
	            {"productid":"FL-DSH-01","productname":"Manx","unitcost":12.00,"status":"P","listprice":83.50,"attr1":"With tail","itemid":"EST-15"},
	            {"productid":"FL-DLH-02","productname":"Persian","unitcost":12.00,"status":"P","listprice":23.50,"attr1":"Adult Female","itemid":"EST-16"},
	            {"productid":"FL-DLH-02","productname":"Persian","unitcost":12.00,"status":"P","listprice":89.50,"attr1":"Adult Male","itemid":"EST-17"},
	            {"productid":"AV-CB-01","productname":"Amazon Parrot","unitcost":92.00,"status":"P","listprice":63.50,"attr1":"Adult Male","itemid":"EST-18"}
	        ];
	</script>    
</body>
</html>
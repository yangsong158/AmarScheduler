<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>服务器配置</title>
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/easyui/themes/icon.css">
    <link rel="stylesheet" type="text/css" href="../../jslib/myui/skins/default/css/form.css">
    <script type="text/javascript" src="../../jslib/easyui/jquery.min.js"></script>
    <script type="text/javascript" src="../../jslib/easyui/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="../../jslib/myui/skins/default/rendered.js"></script>
    <style type="text/css">
    #fi_serverip{width:200px}
    #fi_serverport{width:40px}
    </style>
</head>
<body>
	<!-- 最外层的panel -->
	<div class="easyui-panel" title="服务器配置" data-options="fit:true">
		<div>
			<form class="myuiform">
				<table>
					<tr>
						<td><label for="fi_serverip">服务器地址:</label></td>
						<td><input id="fi_serverip" type="text" value="" ></input></td>
					</tr>
					<tr>
						<td><label for="fi_serverport">服务器端口:</label></td>
						<td><input id="fi_serverport" type="text" value="" ></input></td>
					</tr>
					<tr>
						<td colspan="2">
							<a href="#" class="easyui-linkbutton" iconCls="icon-save">保存</a>
							<a href="#" class="easyui-linkbutton">ping测试</a>
						</td>
					</tr>
				</table>
			</form>
		</div>
	</div>
</body>
</html>
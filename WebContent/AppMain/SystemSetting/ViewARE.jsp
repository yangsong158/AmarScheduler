<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>查看XML代码片段</title>
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shCore.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushXml.js' />"></script>	
	<link type="text/css" rel="stylesheet" href="<c:url value='/jslib/syntaxhighlighter_3.0.83/styles/shCore.css' />"></link>
	<link type="text/css" rel="stylesheet" href="<c:url value='/jslib/syntaxhighlighter_3.0.83/styles/shCoreDjango.css' />"></link>
</head>
<body>
	<div  >
		<code class="brush: xml" id="codeText" style="overflow: auto;">
		</code>
	</div>
</body>
</html>
<script language="javascript" type="text/javascript">
$(function(){
 	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.AREContentShowCommandImpl",null,function(data){
		var s = data;
		s = s.replace(/^\s*\"/gi,"");
		s = s.replace(/\"\s*$/gi,"");
		s = s.replace(/\\n/gi,"\n");
		s = s.replace(/\\t/gi,"\t");
		s = s.replace(/\\/gi,"");
		s = s.replace(/</gi,"&lt;");
		s = s.replace(/>/gi,"&gt;");
		$("#codeText").html(s);
		SyntaxHighlighter.config.bloggerMode = false;
		SyntaxHighlighter.config.tagName = "code";
		SyntaxHighlighter.config.clipboardSwf = 'scripts/clipboard.swf';
		SyntaxHighlighter.highlight();		
	},"text"); 
});
</script>
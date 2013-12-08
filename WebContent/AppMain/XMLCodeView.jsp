<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
	<title>查看XML代码片段</title>
	<!-- easyui -->
	<script type="text/javascript" src="<c:url value='/jslib/qui/js/jquery.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/YSCore.js' />"></script>
	
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shCore.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushXml.js' />"></script>	
	<link type="text/css" rel="stylesheet" href="<c:url value='/jslib/syntaxhighlighter_3.0.83/styles/shCore.css' />"></link>
	<link type="text/css" rel="stylesheet" href="<c:url value='/jslib/syntaxhighlighter_3.0.83/styles/shCoreDjango.css' />"></link>
	<!-- 
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shCore.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shAutoloader.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushAppleScript.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushAS3.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushBash.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushColdFusion.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushCpp.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushCSharp.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushCss.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushDelphi.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushDiff.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushErlang.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushGroovy.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushJava.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushJavaFx.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushPerl.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushPhp.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushPlain.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushPowerShell.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushPython.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushRuby.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushSass.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushScala.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushSql.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushVb.js' />"></script>
	<script type="text/javascript" src="<c:url value='/jslib/syntaxhighlighter_3.0.83/scripts/shBrushXml.js' />"></script>	
	<link type="text/css" rel="stylesheet" href="<c:url value='/jslib/syntaxhighlighter_3.0.83/styles/shCoreDefault.css' />"></link>
	 -->
	<!-- 
	<script type="text/javascript" src="<c:url value='/jslib/highlight/highlight.pack.js' />"></script>
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/highlight/styles/default.css' />" ></link>
    <link rel="stylesheet" type="text/css" href="<c:url value='/jslib/highlight/styles/tomorrow-night-bright.css' />" ></link>
	 -->
</head>
<body>
	<div  >
		<pre class="brush: xml" id="codeText" style="overflow: auto;">
		</pre>
	</div>
</body>
</html>
<script language="javascript" type="text/javascript">
$(function(){
 	YSCore.invokerAgentCommand("com.amarsoft.scheduler.command.impl.XMLStringQueryCommandImpl",$.getParameter(),function(data){
		var s = data;
		s = s.replace(/^\s*\"/gi,"");
		s = s.replace(/\"\s*$/gi,"");
		s = s.replace(/\\n/gi,"\n");
		s = s.replace(/\\t/gi,"\t");
		s = s.replace(/\\/gi,"");
		s = s.replace(/</gi,"&lt;");
		s = s.replace(/>/gi,"&gt;");
		$("#codeText").html(s);
		SyntaxHighlighter.highlight();
	},"text"); 
});
</script>
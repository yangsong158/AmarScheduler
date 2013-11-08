<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="java.util.List" %>
<%@page import="com.amarsoft.scheduler.XMLHelper" %>
<%@page import="com.amarsoft.scheduler.client.AgentCommandInvoker"%>
<%@page import="com.amarsoft.scheduler.command.TaskFileQueryCommand"%>
<%@page import="com.amarsoft.scheduler.entity.TaskFile"%>
<%@page import="java.util.ArrayList"%>
<%
	AgentCommandInvoker<List<TaskFile>,String> invoker = new AgentCommandInvoker<List<TaskFile>,String>("127.0.0.1",8923,TaskFileQueryCommand.class);
	List<TaskFile> taskFiles = invoker.invoker("hahaha...");
	if(taskFiles==null)taskFiles = new ArrayList<TaskFile>();
	
	StringBuilder sbTableJson = new StringBuilder("{\"form.paginate.totalRows\":").append(taskFiles.size()).append(",\"rows\":");
	sbTableJson.append(XMLHelper.getAsJsonString(taskFiles));
	sbTableJson.append("}");
	//System.out.println(sbTableJson.toString());
	out.println(sbTableJson.toString()); 
	
%>
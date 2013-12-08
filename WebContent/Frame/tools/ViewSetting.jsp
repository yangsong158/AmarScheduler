<%@page import="com.amarsoft.scheduler.AgentSetting"%>
<%@page import="com.amarsoft.scheduler.helper.XMLHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	AgentSetting  setting = AgentSetting.getInstance();
	out.println(XMLHelper.getAsJsonString(setting));
	System.out.println(XMLHelper.getAsJsonString(setting));
%>
<%
	session.invalidate();
	response.sendRedirect(request.getContextPath()+"/AppMain/login.jsp");
%>

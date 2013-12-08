<%
	String authKey = request.getParameter("authKey");
	System.out.println("----AAA----");
	session.setAttribute("authKey", authKey);
%>

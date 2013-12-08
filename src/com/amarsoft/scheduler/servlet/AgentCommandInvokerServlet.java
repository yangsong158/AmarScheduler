package com.amarsoft.scheduler.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.amarsoft.scheduler.AgentSetting;
import com.amarsoft.scheduler.client.AgentCommandInvoker;
import com.amarsoft.scheduler.helper.XMLHelper;

/**
 * 调用Agent端命令的Servlet
 * @author yangsong
 * @date 2013/11/08
 */
public class AgentCommandInvokerServlet extends HttpServlet{
	private static final long serialVersionUID = 1060034597968950357L;

	public void init() throws ServletException {
		super.init();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 处理请求了
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String charset = AgentSetting.getInstance().getCharset();
		//基础设置及基础数据
		request.setCharacterEncoding(charset);
		response.setContentType("text/html; charset="+charset);
		response.setCharacterEncoding(charset);
		response.setContentType("text/html; charset="+charset);
		PrintWriter out = response.getWriter(); 
		String outContent = "{}";
		Map<String,String> parameter = new HashMap<String,String>();
		
		//1.从头中取动作命令
		String cmd = request.getHeader("InvokerAgentCommand");
		Map<String, String[]> parameters = request.getParameterMap();
		//2.从数据中取提交的数据
		Iterator<Entry<String, String[]>> iterator = parameters.entrySet().iterator();
		while(iterator.hasNext()){
			Entry<String, String[]> entry = iterator.next();
			parameter.put(entry.getKey(),request.getParameter(entry.getKey()));
		}
		//3.动作触发
		if(cmd==null||cmd.length()==0){
			outContent = XMLHelper.getAsJsonString(CodeMessage.createErrorMessage(2002));
		}else{
			//从会话中取出授权码
			String authKey = (String)request.getSession().getAttribute("authKey");
			parameter.put("authKey", authKey);
			outContent=invokerCmd(cmd,parameter);
		}
		out.println(outContent);
		System.out.println(outContent);
		
	}
	/**
	 * 调用命令
	 * @param className
	 * @param parameter
	 * @return
	 */
	protected String invokerCmd(String className,Map<String,String> parameter){
		String cmdResult = "";
		try {
			String agentServerIP = AgentSetting.getInstance().getAgentServerIP();
			int agentServerPort = AgentSetting.getInstance().getAgentServerPort();
			AgentCommandInvoker<Object> invoker = new AgentCommandInvoker<Object>(agentServerIP,agentServerPort,className);
			Object obj = invoker.invoker(parameter);
			cmdResult = XMLHelper.getAsJsonString(obj);
		} catch (Exception e) {
			if(e instanceof java.net.ConnectException){
				cmdResult = XMLHelper.getAsJsonString(CodeMessage.createErrorMessage(1001));
			}else{
				cmdResult = XMLHelper.getAsJsonString(CodeMessage.createErrorMessage(1002,e));
				e.printStackTrace();
			}
		}
		
		return cmdResult;
	}
	
	/**
	 * 错误消息定义类
	 */
	@SuppressWarnings("unused")
	private static class CodeMessage{
		private static final Map<Integer,String> errCodeMsg = new HashMap<Integer,String>(); 
		static{
			//1 agent服务器处理问题
			errCodeMsg.put(1001,"连接agent服务器异常，请检查agent服务是否启动");
			errCodeMsg.put(1002,"调用远程命令出错,出错消息:{0}");
			//2 参数问题
			errCodeMsg.put(2001,"命令执行类{0}不存在");
			errCodeMsg.put(2002,"参数InvokerAgentCommand为空");
			//9 开发级问题
			errCodeMsg.put(9000,"未定义代码为{0}的错误消息");
			
		}
		
		
		private int errorCode;
		private String message;
		private CodeMessage(int errorCode, String message) {
			this.errorCode = errorCode;
			this.message = message;
		}
		/**
		 * 取一个错误消息实例
		 * @param errorCode 错误代码
		 * @param tplData 模板参数
		 * @return
		 */
		public static CodeMessage createErrorMessage(Integer errorCode,Object... tplData){
			CodeMessage  em = null;
			String msg = errCodeMsg.get(errorCode);
			if(msg==null){
				em = createErrorMessage(9000,errorCode);
			}else{
				msg = MessageFormat.format(msg,tplData);
				msg = "["+errorCode+"]-"+msg;
				em = new CodeMessage(errorCode,msg);
			}
			return em;
		}
		public int getErrorCode() {
			return errorCode;
		}
		public void setErrorCode(int errorCode) {
			this.errorCode = errorCode;
		}
		public String getErrorMsg() {
			return message;
		}
		public void setErrorMsg(String message) {
			this.message = message;
		}
	}
}

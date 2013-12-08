package com.amarsoft.scheduler.servlet;

import java.io.EOFException;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.ConnectException;
import java.net.Socket;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.amarsoft.scheduler.AgentSetting;
import com.amarsoft.scheduler.command.CommandObject;
import com.amarsoft.scheduler.command.impl.TaskInvokerCommandImpl;

/**
 * task命令调用servlet
 * @author yangsong
 * @date 2013/11/20
 */
public class TaskRunnerServlet extends HttpServlet{
	private static final long serialVersionUID = -8094463223680035517L;
	
	private static final Log log = LogFactory.getLog(TaskRunnerServlet.class);
	private String ip = "127.0.0.1" ;
	private int port = 8924;
	private String charset = "";
	
	public void init() throws ServletException {
		super.init();
		ip = AgentSetting.getInstance().getAgentServerIP();
		port = AgentSetting.getInstance().getSubTaskInvokerPort();
		charset = AgentSetting.getInstance().getCharset();
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
		request.setCharacterEncoding(charset);
		response.setContentType("text/html; charset="+charset);
		response.setCharacterEncoding(charset);
		response.setContentType("text/html; charset="+charset);
		
		//2.从数据中取提交的数据
		Map<String,String> parameter = new HashMap<String,String>();
		Iterator<Entry<String, String[]>> iterator = request.getParameterMap().entrySet().iterator();
		while(iterator.hasNext()){
			Entry<String, String[]> entry = iterator.next();
			parameter.put(entry.getKey(),request.getParameter(entry.getKey()));
		}
		
		//执行调用
		try {
			invoker(parameter,response);
		} catch (Exception e) {
			log.error("运行Task出错",e);
			response.getWriter().println(e);
		}
	}
	/**
	 * 调用命令
	 * @param parameter
	 * @param response
	 * @param cmd
	 * @throws Exception
	 */
	public void invoker(Map<String,String> parameter,HttpServletResponse response) throws Exception{
		Socket socket = null;  
		ObjectOutputStream out = null;
		ObjectInputStream in = null;
		try {
			//1.连接服务器
			socket = new Socket(ip, port);
			//2.输入输出处理
			out = new ObjectOutputStream(socket.getOutputStream()); 
			in = new ObjectInputStream(socket.getInputStream()); 
			//3.执行命令并且通过socket进行输入输出
			doSocketIO(in,out,parameter,response);
		}catch(ConnectException e){
			log.error("网络连接出错",e);
			throw e;
		}catch(Exception e) {
			log.error("调用命令出错",e);
			throw e;
		} finally {
			if (out != null){
				try { out.close();} catch (IOException e) {}
			}
			if (in != null){
				try { in.close();} catch (IOException e) {}
			}
			if (socket != null){
				try { socket.close();} catch (IOException e) {}
			}
		}
	}
	/**
	 * 与socket通信
	 * @param in
	 * @param out
	 * @param parameter
	 * @param response
	 * @param cmd
	 * @throws IOException
	 * @throws ClassNotFoundException
	 */
	protected void doSocketIO(ObjectInputStream in,ObjectOutputStream out,Map<String,String> parameter,HttpServletResponse response) throws IOException, ClassNotFoundException{
		CommandObject commandObject = new CommandObject(TaskInvokerCommandImpl.class.getName(),parameter);
		out.writeObject(commandObject); 
		out.flush();
		
		PrintWriter pwOut = response.getWriter();
//		System.out.println(AgentSetting.getInstance().getCharset());
		pwOut.println("<!DOCTYPE html>");
		pwOut.println("<html>");
		pwOut.println("<head>");
		pwOut.println("<title>任务运行控制台</title>");
		pwOut.println("</head>");
		pwOut.println("<body style='background-color: #000;color: #0F0;font-size:12px;'>");
		pwOut.println("<p>");
		pwOut.println("<pre>");
		pwOut.println("<div id='consoleOut'>");
		pwOut.flush();
		while(true){
			try{
				String msg = (String)in.readObject();
				msg = encodeString(msg,AgentSetting.getInstance().getCharset());
//				System.out.println(msg+"</br>");
//				pwOut.println(msg+"</br>");
				pwOut.println(msg);
				pwOut.flush();
			}catch(Exception e){
				if(e instanceof EOFException){
					break;
				}
			}
		}
		pwOut.println("</div>");
		pwOut.println("</pre>");
		pwOut.println("</p>");
		pwOut.println("</body>");
		pwOut.println("</html>");
		pwOut.println("<script language='javascript'>var div = document.getElementById('consoleOut');div.scrollTop = div.scrollHeight;</script>");
		pwOut.flush();
	}
	private String encodeString(String str,String charset) throws UnsupportedEncodingException{
		if(charset==null){
			return str;
		}else{
			return new String(str.getBytes(),charset);
		}
	}
}

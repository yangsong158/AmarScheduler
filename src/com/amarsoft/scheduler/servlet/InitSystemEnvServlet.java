package com.amarsoft.scheduler.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.amarsoft.scheduler.AgentSetting;

/**
 * 启动加载环境变量的servlet
 * @author yangsong
 *
 */
public class InitSystemEnvServlet extends HttpServlet{

	private static final long serialVersionUID = 5545012716721498218L;

	private static final Log log = LogFactory.getLog(InitSystemEnvServlet.class);	
	
	public void init() throws ServletException {
		super.init();
		String agentServerIP = getInitParameter("AgentServerIP");
		int agentServerPort = Integer.parseInt(getInitParameter("AgentServerPort"));
		int subTaskInvokerPort = Integer.parseInt(getInitParameter("SubTaskInvokerPort"));
		String charset = getInitParameter("charset");
		
		AgentSetting  setting = AgentSetting.getInstance();
		setting.setAgentServerIP(agentServerIP);
		setting.setAgentServerPort(agentServerPort);
		setting.setSubTaskInvokerPort(subTaskInvokerPort);
		setting.setCharset(charset);
		log.info("-----AgentServer环境变量参数加载完成-----");
	}

}

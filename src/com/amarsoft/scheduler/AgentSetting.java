package com.amarsoft.scheduler;

public class AgentSetting {
	private static AgentSetting instance = null;
	private String agentServerIP = "127.0.0.1";
	private int agentServerPort = 8923;
	private int subTaskInvokerPort = 8923;
	private String charset = "utf-8";
	
	private AgentSetting(){
		
	}
	public synchronized static AgentSetting getInstance(){
		if(instance==null){
			instance = new AgentSetting();
		}
		return instance;
	}
	public String getAgentServerIP() {
		return agentServerIP;
	}
	public void setAgentServerIP(String agentServerIP) {
		this.agentServerIP = agentServerIP;
	}
	public int getAgentServerPort() {
		return agentServerPort;
	}
	public void setAgentServerPort(int agentServerPort) {
		this.agentServerPort = agentServerPort;
	}
	public int getSubTaskInvokerPort() {
		return subTaskInvokerPort;
	}
	public void setSubTaskInvokerPort(int subTaskInvokerPort) {
		this.subTaskInvokerPort = subTaskInvokerPort;
	}
	public String getCharset() {
		return charset;
	}
	public void setCharset(String charset) {
		this.charset = charset;
	}
}

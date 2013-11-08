package com.amarsoft.scheduler.demo;

import java.util.Iterator;
import java.util.Properties;

public class SystemSetting {

	public static void main(String[] args) {
		Properties properties = System.getProperties();
		Iterator<?> names = properties.keySet().iterator();
		System.out.println(System.getProperty("derby.system.home"));
		System.out.println("-----------------");
		while(names.hasNext()){
			String propName = (String)names.next();
			String propValue = properties.getProperty(propName);
			System.out.println(propName+"="+propValue);
		}
		System.out.println("-----------------");
		System.setProperty("derby.system.home", ".");
		System.out.println(System.getProperty("derby.system.home"));
	}

}

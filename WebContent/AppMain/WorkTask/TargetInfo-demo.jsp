<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>  
{"total":7,"rows":[
	{"name":"Name","value":"Bill Smith","group":"ID Settings","editor":"text"},
	{"name":"Address","value":"","group":"ID Settings","editor":"text"},
	{"name":"Age","value":"40","group":"ID Settings","editor":"numberbox"},
	{"name":"Birthday","value":"01/02/2012","group":"ID Settings","editor":"datebox"},
	{"name":"SSN","value":"123-456-7890","group":"ID Settings","editor":"text"},
	{"name":"Email","value":"bill@gmail.com","group":"Marketing Settings","editor":{
		"type":"validatebox",
		"options":{
			"validType":"email"
		}
	}},
	{"name":"FrequentBuyer","value":"false","group":"Marketing Settings","editor":{
		"type":"checkbox",
		"options":{
			"on":true,
			"off":false
		}
	}}
]}
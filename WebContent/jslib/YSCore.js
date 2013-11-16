var YSCore = {};
/**
 * 取当前contextPath
 */
YSCore.getContextPath = function(){
	var curPath = document.location.pathname;
	var index = curPath.substr(1).indexOf("/");
	return curPath.substr(0,index+1);
};
/**
 * 获取文件路径的绝对路径
 * @param path 文件路径
 */
YSCore.getAbsURI = function(path){
	return YSCore.getContextPath()+path;
};
/**
 * 获取URI地址，包括参数
 * @param path 文件路径
 * @param parameter 参数json对象
 */
YSCore.getURIAddr = function(path,parameter){
	if($.type(parameter)=="object"){
		parameter = $.jsonConvertParameter(parameter);
	}
	if(parameter){
		return YSCore.getAbsURI(path)+"?"+parameter;
	}else{
		return YSCore.getAbsURI(path);
	}
};
/**
 * 调用agent服务端的命令
 * @param className 服务类名
 * @param requestData 请示数据
 * @param callback 回调函数
 * @param callbackDataType 回传数据格式，如果该值不传，则默认为json
 */
YSCore.invokerAgentCommand = function(className,requestData,callback,callbackDataType){
	var servletName=YSCore.getContextPath()+"/AgentCommandInvokerServlet";
	if(!callbackDataType){
		callbackDataType = "json";
	}
	$.ajax({
		   type: "POST",
		   url: servletName,
		   cache: false,
		   dataType:callbackDataType,
		   data: requestData,
		   beforeSend:function(xmlHttpRequest){
			   xmlHttpRequest.setRequestHeader("InvokerAgentCommand", className);
		   },
		   success: function(data){
			   if(data["errorMsg"]){
				   alert(data["errorMsg"]);
				   return;
			   }
			   if(callback&&$.isFunction(callback))callback.call(this,data);
		   }
		});
};

/**
 * 扩展几个静态API
 */
$.extend({
	/**
	 * 取提交的请求
	 * @param paraName
	 * @returns
	 */
	getParameter : function(paraName) {
		var paraData = {};
		var name, value, i;
		var str = location.href;
		var num = str.indexOf("?");
		str = str.substr(num + 1);
		var arrtmp = str.split("&");
		for (i = 0; i < arrtmp.length; i++) {
			num = arrtmp[i].indexOf("=");
			if (num > 0) {
				name = arrtmp[i].substring(0, num);
				value = arrtmp[i].substr(num + 1);
				if(value){
					paraData[name] = decodeURIComponent(value);
				}
			}
		}
		if(paraName){
			return paraData[paraName];
		}else{
			return paraData;
		}
	},
	/**
	 * 把json转为parameter<br/>
	 * k1,v1:k2:v2 ==> k1=v1&k2=v2
	 * @param jsonObject
	 */
	jsonConvertParameter : function(jsonObject){
		var parameterData = [];
		if($.type(jsonObject) === "object"){
			for(var itemName in jsonObject){
				parameterData.push(itemName+"="+jsonObject[itemName]);
			}
		}
		return parameterData.join("&");
	},
	/**
	 * 把查询类字串转为json<br/>
	 * k1=v1&k2=v2 ==> k1,v1:k2:v2
	 * @param str
	 */
	parameterConvertJson : function(str){
		var jsonObject = {};
		if($.type(jsonObject) === "string"){
			var strArray = str.split("&");
			for(var i=0;i<strArray.length;i++){
				var item = strArray[i].split("=");
				jsonObject[item[0]]=item[1];
			}
		}
		return jsonObject;
	}
	
});	
/**
 * 把表单序列化为json的插件
 */
(function($) {
	/**
	 * 把表单内容转换为json
	 */
	$.fn.serializeJson = function(){
		var serializeObj = {};
		var array = this.serializeArray();
		$(array).each(
				function() {
					if (serializeObj[this.name]) {
						if ($.isArray(serializeObj[this.name])) {
							serializeObj[this.name].push(this.value);
						} else {
							serializeObj[this.name] = [serializeObj[this.name], this.value ];
						}
					} else {
						serializeObj[this.name] = this.value;
					}
				});
		return serializeObj;
	};
	/**
	 * 使用json内容填充表单
	 */
	$.fn.fillForm = function(jsonObject){
		var formContext = $(this);
		if($.type(jsonObject) === "object"){
			for(var itemName in jsonObject){
				$("#"+itemName,formContext).val(jsonObject[itemName]);
			}
		}
	};
	/**
	 * 使用id属性填充name属性
	 */
	$.fn.initNamePropertyWithId = function(){
		var formContext = $(this);
		$("input[id],textarea[id]",formContext).each(function(){
			var field = $(this);
			field.attr("name",field.attr("id"));
		});
	};
	/**
	 * 必输选项，自动加上星标
	 */
	$.fn.requiredFieldsAppendStar = function(){
		var formContext = $(this);
		$("input[id],textarea[id]",formContext).each(function(){
			var field = $(this);
			if(field.hasClass("validate[required]")){
				field.after('<span class="star">*</span>');
			}
		});
	};	
})(jQuery);


/**
 * 扩展原型链
 * @param s
 * @returns {Number}
 */
Array.prototype.indexOf=function(testZi){
    for(var i=0;i<this.length;i++){
            if(testZi===this[i]){
                    return i;
            }
    }
    return -1;
};

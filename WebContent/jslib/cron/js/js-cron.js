(function($){
	$.fn.cronInit = function(options){
		var defaults = {};
		options = $.extend(defaults, options);
		
		return this.each(function(){
			var context = $(this);
			initChoiceSec(context);
			initChoiceMin(context);
			initChoiceHour(context);
			initChoiceDay(context);
			initChoiceMonth(context);
			initChoiceWeek(context);
			initChoiceYear(context,(new Date()).getFullYear()-20,90);
			
			$("#btnGen").click(function(){
				var sec = getSecValue(context);
				var min = getMinValue(context);
				var hour = getHourValue(context);
				var day = getDayValue(context);
				var mon = getMonValue(context);
				var week = getWeekValue(context);
				var year = getYearValue(context);
				if(!year)year = "";
				$("#exSec").val(sec);
				$("#exMin").val(min);
				$("#exHour").val(hour);
				$("#exDay").val(day);
				$("#exMon").val(mon);
				$("#exWeek").val(week);
				$("#exYear").val(year);
				//最终生成最终表达式
				$("#txtCron").val(sec+" "+min+" "+hour+" "+day+" "+mon+" "+week+" "+year);
			});
			
/**=============================================
 *                 初始化复选框选择器
 * ============================================= */
			/**
			 * 初始化秒选择
			 */
			function initChoiceSec(context){
				var tabContext = $("#tbiSec",context);
				var secCheckList = $("#secCheckList",tabContext);
				var changeTrigger = $("input[name='secTypeChoice']",tabContext);
				initCheckBoxList(secCheckList,60,"secchk",changeTrigger,0);
			};
			/**
			 * 初始化分钟选择
			 */
			function initChoiceMin(context){
				var tabContext = $("#tbiMin",context);
				var minCheckList = $("#minCheckList",tabContext);
				var changeTrigger = $("input[name='minTypeChoice']",tabContext);
				initCheckBoxList(minCheckList,60,"minchk",changeTrigger,0);
			};
			
			/**
			 * 初始化小时选择
			 */
			function initChoiceHour(context){
				var tabContext = $("#tbiHour",context);
				var hourCheckList = $("#hourCheckList",tabContext);
				var changeTrigger = $("input[name='hourTypeChoice']",tabContext);
				initCheckBoxList(hourCheckList,24,"hourchk",changeTrigger,0);
			};
			
			/**
			 * 初始化日选择
			 */
			function initChoiceDay(context){
				var tabContext = $("#tbiDay",context);
				var dayCheckList = $("#dayCheckList",tabContext);
				var changeTrigger = $("input[name='dayTypeChoice']",tabContext);
				initCheckBoxList(dayCheckList,31,"daychk",changeTrigger,1);
			};
			/**
			 * 初始化月选择
			 */
			function initChoiceMonth(context){
				var tabContext = $("#tbiMonth",context);
				var montyCheckList = $("#monthCheckList",tabContext);	
				var changeTrigger = $("input[name='monthTypeChoice']",tabContext);
				initCheckBoxList(montyCheckList,12,"monchk",changeTrigger,1);
			};
			
			/**
			 * 初始化星期选择
			 */
			function initChoiceWeek(context){
				var tabContext = $("#tbiWeek",context);
				var montyCheckList = $("#weekCheckList",tabContext);	
				var changeTrigger = $("input[name='weekTypeChoice']",tabContext);
				initCheckBoxList(montyCheckList,7,"weekchk",changeTrigger,1);				
			}
			/**
			 * 初始化年，一年初始化前10年至后50年即可
			 */
			function initChoiceYear(context,startYear,years){
				var tabContext = $("#tbiYear",context);
				var yearCheckList = $("#yearCheckList",tabContext);	
				var yearCompList = "";
				for(var i=0;i<years;i++){
					var a = startYear+i;
					yearCompList+="<input type='checkbox' value='"+a+"' name='yearchk'><span>"+a+"</span>";
					if((i+1)%10==0){
						yearCompList+="<br>";
					}
				}
				yearCheckList.append(yearCompList);
			};
			/**
			 * 初始化复选组件列表通用API
			 */
			function initCheckBoxList(checkBoxList,numberCount,chkName,changeTrigger,startIdx){
				var chkCompList = "";
				for(var i=0;i<numberCount;i++){
					var a = startIdx+i;
					chkCompList+="<input type='checkbox' value='"+a+"' name='"+chkName+"' disabled='disabled'><span>"+a+"</span>";
					if((i+1)%10==0){
						chkCompList+="<br>";
					}
				}
				//添加组件
				checkBoxList.append(chkCompList);
				//事件绑定
				changeTrigger.click(function(){
					if($(this).val()=="c"){
						$("input[name='"+chkName+"']",checkBoxList).removeAttr("disabled");
					}else{
						$("input[name='"+chkName+"']",checkBoxList).attr("disabled","disabled");
					}					
				});
				
			};
/**=============================================
*                 初始化复选框选择器
* ============================================= */
			/**
			 * 取秒数
			 */
			function getSecValue(context){
				var chkTypeValue = $("input[name='secTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='secchk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");
				}else if(chkTypeValue=="*"){
					var startValue = $("#secStart",context).val();
					var endValue = $("#secEnd",context).val();
					return startValue+"/"+endValue;
				}else{
					return chkTypeValue;
				}
			};
			/**
			 * 取分钟数
			 */
			function getMinValue(context){
				var chkTypeValue = $("input[name='minTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='minchk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");
				}else if(chkTypeValue=="*"){
					var startValue = $("#minStart",context).val();
					var endValue = $("#minEnd",context).val();
					return startValue+"/"+endValue;
				}else{
					return chkTypeValue;
				}
			};
			/**
			 * 取小时的值
			 */
			function getHourValue(context){
				var chkTypeValue = $("input[name='hourTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='hourchk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");					
				}else{
					return chkTypeValue;
				}				
			};
			/**
			 * 取天数的值
			 */
			function getDayValue(context){
				var chkTypeValue = $("input[name='dayTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='daychk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");						
				}else{
					return chkTypeValue;
				}				
			};
			/**
			 * 取月份的值
			 */
			function getMonValue(context){
				var chkTypeValue = $("input[name='monthTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='monchk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");						
				}else{
					return chkTypeValue;
				}					
			};
			/**
			 * 取星期的值
			 */
			function getWeekValue(context){
				var chkTypeValue = $("input[name='weekTypeChoice']:checked",context).val();
				if(chkTypeValue=="c"){
					var chkValues = new Array();
					$("input[name='weekchk']:checked").each(function(){
						chkValues.push($(this).val());
					});
					return chkValues.join(",");						
				}else{
					return chkTypeValue;
				}					
			};
			/**
			 * 取年的值
			 */
			function getYearValue(context){
				var chkValues = new Array();
				$("input[name='yearchk']:checked").each(function(){
					chkValues.push($(this).val());
				});
				return chkValues.join(",");	
			};
		});
	};
})(jQuery);
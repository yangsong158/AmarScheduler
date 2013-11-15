/**
 * 插件写法，声明一个流程图插件
 */
(function($){
	/**
	 * 流程图类声明
	 * 此类作为后台json模型和GooFlow的桥梁
	 */	
	$.fn.flowgraph = function(nodeData,options) {
		//参数及默认参数的处理
        var defaults = {
    			nodeWidth       : 190,	//单个节点的宽度
    			nodeHeight      : 40,	//单个节点的高度
    			nodeSpaceX      : 10,	//两个相邻节点之间的X轴上的距离(第一个的右边至第二个的左边）
    			nodeSpaceY      : 60,	//两个相邻节点之间的Y轴上的距离(第一个的下边至第二个的上边）
    			drawStartX      : 10,	//开始作图X坐标
    			dropStartY      : 10,	//开发作图Y坐标
    			originWidth     : 24,	//原点(开始或结束点)宽度
    			originHeight    : 24,	//原点(开始或结束点)高度
    			startNode       : {id : "A0" , name : "开始"}, //开始节点的ID及名称
    			endNode         : {id : "Z9" , name : "结束"}, //结束节点的ID及名称
    			nodeIdField     : "_fg_nid"                 , //被渲染的数据，会给它的json增加一个节点号字段，该属性为字段的名称
    			gooFlowRemark   : {},               //这个是GooFlow的remark参数
    			gooFlowProperty : {},               //这个是GooFlow的property参数
    			title           : "流程图"		    //显示的标题
        };
        options = $.extend(defaults, options);
        
        return this.each(function(){
	        //开始处理
	        var workPlatform=$.createGooFlow($(this),options.gooFlowProperty);
	        workPlatform.setNodeRemarks(options.gooFlowRemark);
	        
	        //声明存放数据的对象和存放连线的对象
			var nodesData = {};
			var linesData = {};
			//填充数据并且渲染
			fillFlowGraph(nodeData,nodesData,linesData);
			workPlatform.loadData({
 				nodes : nodesData, 
 				lines : linesData,
				title : options.title
			});
			
			
			/**
			 * 填充流程图
			 */
			function fillFlowGraph(nodeObject,nodesData,linesData){
				var needWidth  = nodeObject["maxBreadth"] * (options.nodeWidth +options.nodeSpaceX);	//需要的宽度=当前节点最大广度*(节点宽度+节点空白宽度)
				var needHeight = nodeObject["maxDepth"]   * (options.nodeHeight+options.nodeSpaceY);	//需要的高度=当前节点最大深度*(节点高度+节点空白高度)
				var originXAxis = needWidth/2-options.drawStartX-options.originWidth/2;					//计算开始节点的X坐标=第1个节点需要的宽度/2-作图开始位置-原点大小的一半
				//生成开始节点
				nodesData[options.startNode.id] = {
						name   : options.startNode.name ,
						left   : originXAxis            ,
						top    : options.dropStartY     ,
						type   : "start"                ,
						width  : options.originWidth    ,
						height : options.originHeight
				};
				//生成结束节点
				nodesData[options.endNode.id] = {
						name   : options.endNode.name   ,
						left   : originXAxis            ,
						top    : needHeight             ,
						type   : "end"                  ,
						width  : options.originWidth    ,
						height : options.originHeight
				};
				nodeObject[options.nodeIdField] = options.startNode.id;	//结开始结点的数据区，增加一个id域，并且把当前的ID值赋给它
				//开始填充节点了
				startFillGraph(nodesData,linesData,nodeObject,options.drawStartX,1);
			};
			/**
			 * 从一个节点开始填充流程图
			 */
			function startFillGraph(nodesData,linesData,startNode,marginLeft,yIdx){
				var children = startNode["nextUnits"];
				if(!children||children.length==0)return;
				for(var i=0;i<children.length;i++){
					var node = children[i];
					if(node["unitNodeType"]==9)continue;				//9表示结束节点，前面已经生成过来，不需要生成
					
					var needWidth = node["maxBreadth"]*(options.nodeWidth +options.nodeSpaceX);	  //需要的宽度  =节点最大广度 * 单个节点宽度(200)
					var nodeMarginLeft = marginLeft+needWidth/2-options.nodeWidth/2;              //节点左起位置 = 参考偏移 + 需要宽度/2 + 节点宽度/2 
					node[options.nodeIdField] = node["name"];					//给节点起一个名字
					//生成节点
					nodesData[node[options.nodeIdField]] = {
							name   : node["describe"]                            ,
							left   : nodeMarginLeft                              ,
							top    : yIdx*(options.nodeHeight+options.nodeSpaceY),
							type   : "node"                                      , 
							width  : options.nodeWidth                           ,
							height : options.nodeHeight
					};
					//生成连线
					linesData[startNode[options.nodeIdField]+"_TO_"+node[options.nodeIdField]] = {
							type : "sl",
							from : startNode[options.nodeIdField],
							to   : node[options.nodeIdField],
							name : "",
							mark : false
					};
					
					//如果是结尾结点，还要生成连接结束点的线
					if(node["last"]){
						linesData[node[options.nodeIdField]+"_TO_"+options.endNode.id] = {
								type : "sl",
								from : node[options.nodeIdField],
								to   : options.endNode.id,
								name : "",
								mark : false
						};				
					}
					
					//下一个节点，向右偏移
					marginLeft += needWidth;
					//计算子节点的开始偏移位置 = 父节点偏移  + 节点宽度(包括空白)/2 - 需要的宽度/2
					var subOffset = nodeMarginLeft + options.nodeWidth/2 -  needWidth/2;
					//递归子节点
					startFillGraph(nodesData,linesData,node,subOffset,yIdx+1);
				}
			}			
        });
	};
})(jQuery);
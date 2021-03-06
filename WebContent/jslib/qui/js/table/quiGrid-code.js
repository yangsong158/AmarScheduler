var widthModifyFlag = 0;
(function($) {
	Function.prototype.quiExtend = function(parent, overrides) {
		if (typeof parent != "function") {
			return this;
		}
		this.base = parent.prototype;
		this.base.constructor = parent;
		var f = function() {};
		f.prototype = parent.prototype;
		this.prototype = new f();
		this.prototype.constructor = this;
		if (overrides) {
			$.extend(this.prototype, overrides);
		}
	};
	Function.prototype.quiDefer = function(o, defer, args) {
		var fn = this;
		return setTimeout(function() {
			fn.apply(o, args || []);
		}, defer);
	};
	window.qui = $.quiui = {
		version: "QUI3.1",
		managerCount: 0,
		managers: {},
		managerIdPrev: "quiui",
		error: {
			managerIsExist: "管理器id已经存在"
		},
		getId: function(prev) {
			prev = prev || this.managerIdPrev;
			var id = prev + (1000 + this.managerCount);
			this.managerCount++;
			return id;
		},
		add: function(manager) {
			if (arguments.length == 2) {
				var m = arguments[1];
				m.id = m.id || m.options.id || arguments[0].id;
				this.addManager(m);
				return
			}
			if (!manager.id) {
				manager.id = this.getId(manager.__idPrev());
			}
			if (this.managers[manager.id]) {
				throw new Error(this.error.managerIsExist);
			}
			this.managers[manager.id] = manager;
		},
		remove: function(arg) {
			if (typeof arg == "string" || typeof arg == "number") {
				delete $.quiui.managers[arg];
			} else {
				if (typeof arg == "object" && arg instanceof $.quiui.core.Component) {
					delete $.quiui.managers[arg.id];
				}
			}
		},
		get: function(arg, idAttrName) {
			idAttrName = idAttrName || "quiuiid";
			if (typeof arg == "string" || typeof arg == "number") {
				return $.quiui.managers[arg];
			} else {
				if (typeof arg == "object" && arg.length) {
					if (!arg[0][idAttrName] && !$(arg[0]).attr(idAttrName)) {
						return null;
					}
					return $.quiui.managers[arg[0][idAttrName] || $(arg[0]).attr(idAttrName)];
				}
			}
			return null;
		},
		find: function(type) {
			var arr = [];
			for (var id in this.managers) {
				var manager = this.managers[id];
				if (type instanceof Function) {
					if (manager instanceof type) {
						arr.push(manager);
					}
				} else {
					if (type instanceof Array) {
						if ($.inArray(manager.__getType(), type) != -1) {
							arr.push(manager);
						}
					} else {
						if (manager.__getType() == type) {
							arr.push(manager);
						}
					}
				}
			}
			return arr;
		},
		run: function(plugin, args, ext) {
			if (!plugin) {
				return
			}
			ext = $.extend({
				defaultsNamespace: "quiDefaults",
				methodsNamespace: "quiMethods",
				controlNamespace: "controls",
				idAttrName: "quiuiid",
				isStatic: false,
				hasElement: true,
				propertyToElemnt: null
			}, ext || {});
			plugin = plugin.replace(/^quiGet/, "");
			plugin = plugin.replace(/^qui/, "");
			if (this == null || this == window || ext.isStatic) {
				if (!$.quiui.plugins[plugin]) {
					$.quiui.plugins[plugin] = {
						fn: $["qui" + plugin],
						isStatic: true
					}
				}
				return new $.quiui[ext.controlNamespace][plugin]($.extend({}, $[ext.defaultsNamespace][plugin] || {}, $[ext.defaultsNamespace][plugin + "String"] || {}, args.length > 0 ? args[0] : {}))
			}
			if (!$.quiui.plugins[plugin]) {
				$.quiui.plugins[plugin] = {
					fn: $.fn["qui" + plugin],
					isStatic: false
				};
			}
			if (/Manager$/.test(plugin)) {
				return $.quiui.get(this, ext.idAttrName);
			}
			this.each(function() {
				if (this[ext.idAttrName] || $(this).attr(ext.idAttrName)) {
					var manager = $.quiui.get(this[ext.idAttrName] || $(this).attr(ext.idAttrName));
					if (manager && args.length > 0) {
						manager.set(args[0]);
					}
					return;
				}
				if (args.length >= 1 && typeof args[0] == "string") {
					return;
				}
				var options = args.length > 0 ? args[0] : null;
				var p = $.extend({}, $[ext.defaultsNamespace][plugin] || {}, $[ext.defaultsNamespace][plugin + "String"] || {}, options || {});
				if (ext.propertyToElemnt) {
					p[ext.propertyToElemnt] = this;
				}
				if (ext.hasElement) {
					new $.quiui[ext.controlNamespace][plugin](this, p);
				} else {
					new $.quiui[ext.controlNamespace][plugin](p);
				}
			});
			if (this.length == 0) {
				return null
			}
			if (args.length == 0) {
				return $.quiui.get(this, ext.idAttrName);
			}
			if (typeof args[0] == "object") {
				return $.quiui.get(this, ext.idAttrName);
			}
			if (typeof args[0] == "string") {
				var manager = $.quiui.get(this, ext.idAttrName);
				if (manager == null) {
					return
				}
				if (args[0] == "option") {
					if (args.length == 2) {
						return manager.get(args[1]);
					} else {
						if (args.length >= 3) {
							return manager.set(args[1], args[2]);
						}
					}
				} else {
					var method = args[0];
					if (!manager[method]) {
						return;
					}
					var params = Array.apply(null, args);
					params.shift();
					return manager[method].apply(manager, params);
				}
			}
			return null;
		},
		defaults: {},
		methods: {},
		core: {},
		controls: {},
		plugins: {}
	};
	$.quiDefaults = {};
	$.quiMethos = {};
	$.quiui.defaults = $.quiDefaults;
	$.quiui.methods = $.quiMethos;
	$.fn.qui = function(plugin) {
		if (plugin) {
			return $.quiui.run.call(this, plugin, arguments);
		} else {
			return $.quiui.get(this);
		}
	};
	$.quiui.core.Component = function(options) {
		this.events = this.events || {};
		this.options = options || {};
		this.children = {};
	};
	$.extend($.quiui.core.Component.prototype, {
		__getType: function() {
			return "$.quiui.core.Component";
		},
		__idPrev: function() {
			return "quiui";
		},
		set: function(arg, value) {
			if (!arg) {
				return
			}
			if (typeof arg == "object") {
				var tmp;
				if (this.options != arg) {
					$.extend(this.options, arg);
					tmp = arg;
				} else {
					tmp = $.extend({}, arg);
				}
				if (value == undefined || value == true) {
					for (var p in tmp) {
						if (p.indexOf("on") == 0) {
							this.set(p, tmp[p]);
						}
					}
				}
				if (value == undefined || value == false) {
					for (var p in tmp) {
						if (p.indexOf("on") != 0) {
							this.set(p, tmp[p]);
						}
					}
				}
				return
			}
			var name = arg;
			if (name.indexOf("on") == 0) {
				if (typeof value == "function") {
					this.bind(name.substr(2), value);
				}
				return;
			}
			this.trigger("propertychange", arg, value);
			if (!this.options) {
				this.options = {};
			}
			this.options[name] = value;
			var pn = "_set" + name.substr(0, 1).toUpperCase() + name.substr(1);
			if (this[pn]) {
				this[pn].call(this, value);
			}
			this.trigger("propertychanged", arg, value);
		},
		get: function(name) {
			var pn = "_get" + name.substr(0, 1).toUpperCase() + name.substr(1);
			if (this[pn]) {
				return this[pn].call(this, name);
			}
			return this.options[name];
		},
		hasBind: function(arg) {
			var name = arg.toLowerCase();
			var event = this.events[name];
			if (event && event.length) {
				return true;
			}
			return false;
		},
		trigger: function(arg, data) {
			var name = arg.toLowerCase();
			var event = this.events[name];
			if (!event) {
				return
			}
			data = data || [];
			if ((data instanceof Array) == false) {
				data = [data];
			}
			for (var i = 0; i < event.length; i++) {
				var ev = event[i];
				if (ev.handler.apply(ev.context, data) == false) {
					return false;
				}
			}
		},
		bind: function(arg, handler, context) {
			if (typeof arg == "object") {
				for (var p in arg) {
					this.bind(p, arg[p]);
				}
				return;
			}
			if (typeof handler != "function") {
				return false;
			}
			var name = arg.toLowerCase();
			var event = this.events[name] || [];
			context = context || this;
			event.push({
				handler: handler,
				context: context
			});
			this.events[name] = event;
		},
		unbind: function(arg, handler) {
			if (!arg) {
				this.events = {};
				return
			}
			var name = arg.toLowerCase();
			var event = this.events[name];
			if (!event || !event.length) {
				return
			}
			if (!handler) {
				delete this.events[name];
			} else {
				for (var i = 0, l = event.length; i < l; i++) {
					if (event[i].handler == handler) {
						event.splice(i, 1);
						break;
					}
				}
			}
		},
		destroy: function() {
			$.quiui.remove(this);
		}
	});
	$.quiui.core.UIComponent = function(element, options) {
		$.quiui.core.UIComponent.base.constructor.call(this, options);
		var extendMethods = this._extendMethods();
		if (extendMethods) {
			$.extend(this, extendMethods);
		}
		this.element = element;
		this._init();
		this._preRender();
		this.trigger("render");
		this._render();
		this.trigger("rendered");
		this._rendered();
	};
	$.quiui.core.UIComponent.quiExtend($.quiui.core.Component, {
		__getType: function() {
			return "$.quiui.core.UIComponent";
		},
		_extendMethods: function() {},
		_init: function() {
			this.type = this.__getType();
			if (!this.element) {
				this.id = this.options.id || $.quiui.getId(this.__idPrev());
			} else {
				this.id = this.options.id || this.element.id || $.quiui.getId(this.__idPrev());
			}
			$.quiui.add(this);
			if (!this.element) {
				return
			}
			var attributes = this.attr();
			if (attributes && attributes instanceof Array) {
				for (var i = 0; i < attributes.length; i++) {
					var name = attributes[i];
					this.options[name] = $(this.element).attr(name);
				}
			}
			var p = this.options;
			if ($(this.element).attr("quiui")) {
				try {
					var attroptions = $(this.element).attr("quiui");
					if (attroptions.indexOf("{") != 0) {
						attroptions = "{" + attroptions + "}";
					}
					eval("attroptions = " + attroptions + ";");
					if (attroptions) {
						$.extend(p, attroptions);
					}
				} catch (e) {}
			}
		},
		_preRender: function() {},
		_render: function() {},
		_rendered: function() {
			if (this.element) {
				$(this.element).attr("quiuiid", this.id)
			}
		},
		attr: function() {
			return [];
		},
		destroy: function() {
			if (this.element) {
				$(this.element).remove();
			}
			this.options = null;
			$.quiui.remove(this);
		}
	});
	$.quiui.controls.Input = function(element, options) {
		$.quiui.controls.Input.base.constructor.call(this, element, options);
	};
	$.quiui.controls.Input.quiExtend($.quiui.core.UIComponent, {
		__getType: function() {
			return "$.quiui.controls.Input";
		},
		attr: function() {
			return ["nullText"];
		},
		setValue: function(value) {
			return this.set("value", value);
		},
		getValue: function() {
			return this.get("value");
		},
		setEnabled: function() {
			return this.set("disabled", false);
		},
		setDisabled: function() {
			return this.set("disabled", true);
		},
		updateStyle: function() {}
	});
	$.quiui.win = {
		top: false,
		mask: function(win) {
			function setHeight() {
				if (!$.quiui.win.windowMask) {
					return
				}
				var h = $(window).height() + $(window).scrollTop();
				$.quiui.win.windowMask.height(h);
			}
			if (!this.windowMask) {
				this.windowMask = $("<div class='l-window-mask' style='display: block;'></div>").appendTo("body");
				$(window).bind("resize.quiuiwin", setHeight);
				$(window).bind("scroll", setHeight);
			}
			this.windowMask.show();
			setHeight();
			this.masking = true;
		},
		unmask: function(win) {
			var jwins = $("body > .l-dialog:visible,body > .l-window:visible");
			for (var i = 0, l = jwins.length; i < l; i++) {
				var winid = jwins.eq(i).attr("quiuiid");
				if (win && win.id == winid) {
					continue;
				}
				var winmanager = $.quiui.get(winid);
				if (!winmanager) {
					continue;
				}
				var modal = winmanager.get("modal");
				if (modal) {
					return;
				}
			}
			if (this.windowMask) {
				this.windowMask.hide();
			}
			this.masking = false;
		},
		createTaskbar: function() {
			if (!this.taskbar) {
				this.taskbar = $('<div class="l-taskbar"><div class="l-taskbar-tasks"></div><div class="l-clear"></div></div>').appendTo("body");
				if (this.top) {
					this.taskbar.addClass("l-taskbar-top");
				}
				this.taskbar.tasks = $(".l-taskbar-tasks:first", this.taskbar);
				this.tasks = {};
			}
			this.taskbar.show();
			this.taskbar.animate({
				bottom: 0
			});
			return this.taskbar;
		},
		removeTaskbar: function() {
			var self = this;
			self.taskbar.animate({
				bottom: -32
			}, function() {
				self.taskbar.remove();
				self.taskbar = null;
			});
		},
		activeTask: function(win) {
			for (var winid in this.tasks) {
				var t = this.tasks[winid];
				if (winid == win.id) {
					t.addClass("l-taskbar-task-active");
				} else {
					t.removeClass("l-taskbar-task-active");
				}
			}
		},
		getTask: function(win) {
			var self = this;
			if (!self.taskbar) {
				return
			}
			if (self.tasks[win.id]) {
				return self.tasks[win.id];
			}
			return null;
		},
		addTask: function(win) {
			var self = this;
			if (!self.taskbar) {
				self.createTaskbar();
			}
			if (self.tasks[win.id]) {
				return self.tasks[win.id];
			}
			var title = win.get("title");
			var task = self.tasks[win.id] = $('<div class="l-taskbar-task"><div class="l-taskbar-task-icon"></div><div class="l-taskbar-task-content">' + title + "</div></div>");
			self.taskbar.tasks.append(task);
			self.activeTask(win);
			task.bind("click", function() {
				self.activeTask(win);
				if (win.actived) {
					win.min();
				} else {
					win.active();
				}
			}).hover(function() {
				$(this).addClass("l-taskbar-task-over");
			}, function() {
				$(this).removeClass("l-taskbar-task-over");
			});
			return task;
		},
		hasTask: function() {
			for (var p in this.tasks) {
				if (this.tasks[p]) {
					return true;
				}
			}
			return false;
		},
		removeTask: function(win) {
			var self = this;
			if (!self.taskbar) {
				return;
			}
			if (self.tasks[win.id]) {
				self.tasks[win.id].unbind();
				self.tasks[win.id].remove();
				delete self.tasks[win.id];
			}
			if (!self.hasTask()) {
				self.removeTaskbar();
			}
		},
		setFront: function(win) {
			var wins = $.quiui.find($.quiui.core.Win);
			for (var i in wins) {
				var w = wins[i];
				if (w == win) {
					$(w.element).css("z-index", "9200");
					this.activeTask(w);
				} else {
					$(w.element).css("z-index", "9100");
				}
			}
		}
	};
	$.quiui.core.Win = function(element, options) {
		$.quiui.core.Win.base.constructor.call(this, element, options);
	};
	$.quiui.core.Win.quiExtend($.quiui.core.UIComponent, {
		__getType: function() {
			return "$.quiui.controls.Win";
		},
		mask: function() {
			if (this.options.modal) {
				$.quiui.win.mask(this);
			}
		},
		unmask: function() {
			if (this.options.modal) {
				$.quiui.win.unmask(this);
			}
		},
		min: function() {},
		max: function() {},
		active: function() {}
	});
	$.quiui.draggable = {
		dragging: false
	};
	$.quiui.resizable = {
		reszing: false
	};
	$.quiui.toJSON = typeof JSON === "object" && JSON.stringify ? JSON.stringify : function(o) {
		var f = function(n) {
				return n < 10 ? "0" + n : n
			},
			escapable = /[\\\"--­؀-؄܏឴឵‌-‏- ⁠-⁯﻿￰-￿]/g,
			quote = function(value) {
				escapable.lastIndex = 0;
				return escapable.test(value) ? '"' + value.replace(escapable, function(a) {
					var c = meta[a];
					return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)}) + '"' : '"' + value + '"'
			};
		if (o === null) {
			return "null"
		}
		var type = typeof o;
		if (type === "undefined") {
			return undefined
		}
		if (type === "string") {
			return quote(o)
		}
		if (type === "number" || type === "boolean") {
			return "" + o
		}
		if (type === "object") {
			if (typeof o.toJSON === "function") {
				return $.quiui.toJSON(o.toJSON())
			}
			if (o.constructor === Date) {
				return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
			}
			var pairs = [];
			if (o.constructor === Array) {
				for (var i = 0, l = o.length; i < l; i++) {
					pairs.push($.quiui.toJSON(o[i]) || "null")
				}
				return "[" + pairs.join(",") + "]"
			}
			var name, val;
			for (var k in o) {
				type = typeof k;
				if (type === "number") {
					name = '"' + k + '"'
				} else {
					if (type === "string") {
						name = quote(k)
					} else {
						continue
					}
				}
				type = typeof o[k];
				if (type === "function" || type === "undefined") {
					continue
				}
				val = $.quiui.toJSON(o[k]);
				pairs.push(name + ":" + val)
			}
			return "{" + pairs.join(",") + "}"
		}
	}
})(jQuery);
(function($) {
	var l = $.quiui;
	$.fn.quiGrid = function(options) {
		return $.quiui.run.call(this, "quiGrid", arguments)
	};
	$.fn.quiGetGridManager = function() {
		return $.quiui.run.call(this, "quiGetGridManager", arguments)
	};
	var gridHeaderHeight = 26;
	var gridRowHeight = 26;
	if ($("#skin").attr("splitMode") == true || $("#skin").attr("splitMode") == "true") {} else {
		var $parentThemeDom = $(window.top.document.getElementById("theme"));
		if ($parentThemeDom.attr("gridHeaderHeight") != null) {
			gridHeaderHeight = Number($parentThemeDom.attr("gridHeaderHeight"))
		}
		if ($parentThemeDom.attr("gridRowHeight") != null) {
			gridRowHeight = Number($parentThemeDom.attr("gridRowHeight"))
		}
	}
	$.quiDefaults.Grid = {
		title: null,
		width: "auto",
		height: "auto",
		columnWidth: null,
		resizable: true,
		url: false,
		usePager: true,
		page: 1,
		pageSize: 10,
		pageSizeOptions: [5, 10, 20, 30, 40, 50],
		params: [],
		columns: [],
		minColToggle: 1,
		dataType: "server",
		dataAction: "server",
		showTableToggleBtn: false,
		switchPageSizeApplyComboBox: false,
		allowAdjustColWidth: true,
		checkbox: false,
		allowHideColumn: true,
		enabledEdit: false,
		isScroll: true,
		onDragCol: null,
		onToggleCol: null,
		onChangeSort: null,
		onSuccess: null,
		onDblClickRow: null,
		onSelectRow: null,
		onUnSelectRow: null,
		onBeforeCheckRow: null,
		onCheckRow: null,
		onBeforeCheckAllRow: null,
		onCheckAllRow: null,
		onBeforeShowData: null,
		onAfterShowData: null,
		onError: null,
		onSubmit: null,
		dateFormat: "yyyy-MM-dd",
		InWindow: true,
		statusName: "__status",
		method: "post",
		async: true,
		fixedCellHeight: true,
		heightDiff: -10,
		cssClass: null,
		root: "rows",
		record: "pager.totalRows",
		pageParmName: "pager.pageNo",
		pagesizeParmName: "pager.pageSize",
		sortnameParmName: "sort",
		sortorderParmName: "direction",
		onReload: null,
		onToFirst: null,
		onToPrev: null,
		onToNext: null,
		onToLast: null,
		allowUnSelectRow: false,
		alternatingRow: true,
		mouseoverRowCssClass: "l-grid-row-over",
		enabledSort: true,
		rowAttrRender: null,
		groupColumnName: null,
		groupColumnDisplay: "分组",
		groupRender: null,
		totalRender: null,
		delayLoad: false,
		where: null,
		selectRowButtonOnly: true,
		onAfterAddRow: null,
		onBeforeEdit: null,
		onBeforeSubmitEdit: null,
		onAfterEdit: null,
		onLoading: null,
		onLoaded: null,
		onContextmenu: null,
		whenRClickToSelect: false,
		contentType: null,
		checkboxColWidth: 27,
		detailColWidth: 29,
		clickToEdit: true,
		detailToEdit: false,
		onEndEdit: null,
		minColumnWidth: 80,
		tree: null,
		isChecked: null,
		frozen: true,
		frozenDetail: false,
		frozenCheckbox: true,
		detailHeight: 260,
		rownumbers: false,
		frozenRownumbers: true,
		rownumbersColWidth: 26,
		colDraggable: false,
		rowDraggable: false,
		rowDraggingRender: null,
		autoCheckChildren: true,
		onRowDragDrop: null,
		rowHeight: gridRowHeight,
		headerRowHeight: gridHeaderHeight,
		toolbar: null,
		headerImg: null,
		totalType: "auto",
		oldTotalWidth: 100,
		percentWidthMode: false,
		multihead: false,
		showPageInfo: true
	};
	$.quiDefaults.GridString = {
		errorMessage: "发生错误",
		pageStatMessage: "显示从{from}到{to}，总 {total} 条 。每页显示：{pagesize}",
		pageTextMessage: "Page",
		loadingMessage: "加载中...",
		findTextMessage: "查找",
		noRecordMessage: "没有符合条件的记录存在",
		isContinueByDataChanged: "数据已经改变,如果继续将丢失数据,是否继续?",
		cancelMessage: "取消",
		saveMessage: "保存",
		applyMessage: "应用",
		draggingMessage: "{count}行"
	};
	$.quiMethos.Grid = $.quiMethos.Grid || {};
	$.quiDefaults.Grid.sorters = $.quiDefaults.Grid.sorters || {};
	$.quiDefaults.Grid.formatters = $.quiDefaults.Grid.formatters || {};
	$.quiDefaults.Grid.editors = $.quiDefaults.Grid.editors || {};
	$.quiDefaults.Grid.sorters.date = function(val1, val2) {
		return val1 < val2 ? -1 : val1 > val2 ? 1 : 0
	};
	$.quiDefaults.Grid.sorters["int"] = function(val1, val2) {
		return parseInt(val1) < parseInt(val2) ? -1 : parseInt(val1) > parseInt(val2) ? 1 : 0
	};
	$.quiDefaults.Grid.sorters["float"] = function(val1, val2) {
		return parseFloat(val1) < parseFloat(val2) ? -1 : parseFloat(val1) > parseFloat(val2) ? 1 : 0
	};
	$.quiDefaults.Grid.sorters.string = function(val1, val2) {
		return val1.localeCompare(val2)
	};
	$.quiDefaults.Grid.formatters.date = function(value, column) {
		function getFormatDate(date, dateformat) {
			var g = this,
				p = this.options;
			if (isNaN(date)) {
				return null
			}
			var format = dateformat;
			var o = {
				"M+": date.getMonth() + 1,
				"d+": date.getDate(),
				"h+": date.getHours(),
				"m+": date.getMinutes(),
				"s+": date.getSeconds(),
				"q+": Math.floor((date.getMonth() + 3) / 3),
				S: date.getMilliseconds()
			};
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
				}
			}
			return format
		}
		if (!value) {
			return ""
		}
		if (typeof(value) == "string" && /^\/Date/.test(value)) {
			value = value.replace(/^\//, "new ").replace(/\/$/, "");
			eval("value = " + value)
		}
		if (value instanceof Date) {
			var format = column.format || this.options.dateFormat || "yyyy-MM-dd";
			return getFormatDate(value, format)
		} else {
			return value.toString()
		}
	};
	$.quiDefaults.Grid.editors.text = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input;
				if (column.editor.detailEdit == true) {
					input = $("<input type='text'/>");
					container.width("auto").height(30)
				} else {
					input = $("<input type='text' />");
					container.width("auto").height("auto")
				}
				if (column.editor.width) {
					input.width(column.editor.width)
				}
				if (column.editor.maxlength) {
					input.attr("maxlength", column.editor.maxlength)
				}
				if (column.editor.inputMode) {
					input.attr("inputMode", column.editor.inputMode)
				}
				container.append(input);
				input.render();
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					});
					input.addClass("float_left")
				}
				return input
			}
		},
		getValue: function(input, editParm) {
			return input.val()
		},
		setValue: function(input, value, editParm) {
			input.val(value)
		},
		resize: function(input, width, height, editParm) {
			var column = editParm.column;
			if (column.editor.detailEdit == true) {} else {
				if (column.editor.tip) {
					input.width(width - 24)
				} else {
					input.width(width - 4)
				}
			}
			input.focus()
		},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiDefaults.Grid.editors.textarea = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input;
				if (column.editor.detailEdit == true) {
					input = $("<textarea class='textarea'/>")
				} else {
					input = $("<textarea style='border:0;'/>")
				}
				container.width("auto").height("auto");
				if (column.editor.width) {
					input.width(column.editor.width)
				}
				if (column.editor.height) {
					input.height(column.editor.height)
				}
				container.append(input);
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					});
					input.addClass("float_left")
				}
				return input
			}
		},
		getValue: function(input, editParm) {
			return input.val()
		},
		setValue: function(input, value, editParm) {
			input.val(value)
		},
		resize: function(input, width, height, editParm) {
			var column = editParm.column;
			if (column.editor.detailEdit == true) {} else {
				if (column.editor.tip) {
					input.width(width - 24)
				} else {
					input.width(width - 4)
				}
				input.height(height - 3)
			}
			input.focus()
		},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiDefaults.Grid.editors.date = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input;
				if (column.editor.detailEdit == true) {
					input = $("<input type='text' class='date'/>");
					container.width("auto").height(30)
				} else {
					input = $("<input type='text' class='date'/>");
					container.width("auto").height("auto")
				}
				if (column.editor.dateFmt) {
					input.attr("dateFmt", column.editor.dateFmt)
				}
				if (column.editor.width) {
					input.width(column.editor.width)
				}
				container.append(input);
				input.render();
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					});
					input.addClass("float_left")
				}
				return input
			}
		},
		getValue: function(input, editParm) {
			return input.val()
		},
		setValue: function(input, value, editParm) {
			input.val(value)
		},
		resize: function(input, width, height, editParm) {
			var column = editParm.column;
			if (column.editor.detailEdit == true) {} else {
				if (column.editor.tip) {
					input.width(width - 24)
				} else {
					input.width(width - 4)
				}
			}
		},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiDefaults.Grid.editors.select = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input = $("<select></select>");
				if (column.editor.detailEdit == true) {
					container.width("auto").height(30)
				} else {
					container.width("auto").height("auto")
				}
				if (column.editor.data) {
					input.data("data", column.editor.data);
					input.attr("selectedValue", editParm.value)
				} else {
					if (column.editor.url) {
						input.attr("url", column.editor.url);
						input.attr("selectedValue", editParm.value)
					}
				}
				if (column.editor.selWidth) {
					input.attr("selWidth", column.editor.selWidth)
				}
				if (column.editor.boxWidth) {
					input.attr("boxWidth", column.editor.boxWidth)
				}
				if (column.editor.boxHeight) {
					input.attr("boxHeight", column.editor.boxHeight)
				}
				if (column.editor.openDirection) {
					input.attr("openDirection", column.editor.openDirection)
				}
				if (column.editor.editable) {
					input.attr("editable", column.editor.editable)
				}
				if (column.editor.colNum) {
					input.attr("colNum", column.editor.colNum)
				}
				if (column.editor.colWidth) {
					input.attr("colWidth", column.editor.colWidth)
				}
				container.append(input);
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					})
				}
				input.render();
				return input
			}
		},
		getValue: function(input, editParm) {
			var value = "";
			if (input.attr("editable") == "true") {
				value = input.attr("editValue")
			} else {
				value = input.val()
			}
			return value
		},
		setValue: function(input, value, editParm) {
			input.val(value)
		},
		resize: function(input, width, height, editParm) {},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiDefaults.Grid.editors.selectTree = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input = $("<div class='selectTree'></div>");
				if (column.editor.detailEdit == true) {
					container.width("auto").height(30)
				} else {
					container.width("auto").height("auto")
				}
				if (column.editor.data) {
					input.data("data", column.editor.data);
					input.attr("selectedValue", editParm.value)
				} else {
					if (column.editor.url) {
						input.attr("url", column.editor.url);
						input.attr("selectedValue", editParm.value)
					}
				}
				if (column.editor.selWidth) {
					input.attr("selWidth", column.editor.selWidth)
				}
				if (column.editor.boxWidth) {
					input.attr("boxWidth", column.editor.boxWidth)
				}
				if (column.editor.multiMode == true) {
					input.attr("multiMode", "true")
				}
				if (column.editor.noGroup == true) {
					input.attr("noGroup", "true")
				}
				if (column.editor.showInfo == true) {
					input.attr("showInfo", "true")
				} else {
					input.attr("showInfo", "false")
				}
				if (column.editor.boxHeight) {
					input.attr("boxHeight", column.editor.boxHeight)
				}
				if (column.editor.openDirection) {
					input.attr("openDirection", column.editor.openDirection)
				}
				if (column.editor.editable) {
					input.attr("editable", column.editor.editable)
				}
				if (column.editor.allSelectable) {
					input.attr("allSelectable", column.editor.allSelectable)
				}
				if (column.editor.exceptParent) {
					input.attr("exceptParent", column.editor.exceptParent)
				}
				container.append(input);
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					})
				}
				input.render();
				return input
			}
		},
		getValue: function(input, editParm) {
			var value = "";
			if (input.attr("editable") == "true") {
				value = input.attr("editValue")
			} else {
				value = input.attr("relValue")
			}
			return value
		},
		setValue: function(input, value, editParm) {
			input.setValue(value)
		},
		resize: function(input, width, height, editParm) {},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiDefaults.Grid.editors.stepper = {
		create: function(container, editParm) {
			if (quiType == "advanced" || quiType == "enterprise") {
				var column = editParm.column;
				var input = $("<input type='text' class='stepper'/>");
				if (column.editor.detailEdit == true) {
					container.width("auto").height(30)
				} else {
					container.width("auto").height("auto")
				}
				if (column.editor.width) {
					input.width(column.editor.width)
				}
				if (column.editor.min) {
					input.attr("min", column.editor.min)
				}
				if (column.editor.max) {
					input.attr("max", column.editor.max)
				}
				if (column.editor.step) {
					input.attr("step", column.editor.step)
				}
				container.append(input);
				input.render();
				if (column.editor.tip) {
					var $light = $('<span class="img_light hand"></span>');
					container.append($light);
					$light.hover(function() {
						$(this).removeClass("img_light");
						$(this).addClass("img_lightOn");
						$.cursorMessage(column.editor.tip, {
							hideTimeout: 10000
						})
					}, function() {
						$(this).addClass("img_light");
						$(this).removeClass("img_lightOn");
						$.hideCursorMessage()
					});
					input.addClass("float_left")
				}
				return input
			}
		},
		getValue: function(input, editParm) {
			return input.val()
		},
		setValue: function(input, value, editParm) {
			input.val(value)
		},
		resize: function(input, width, height, editParm) {
			var column = editParm.column;
			if (column.editor.detailEdit == true) {} else {
				if (column.editor.tip) {
					input.width(width - 24)
				} else {
					input.width(width - 4)
				}
			}
		},
		destroy: function(input, editParm) {
			input.qui("destroy")
		}
	};
	$.quiui.controls.Grid = function(element, options) {
		$.quiui.controls.Grid.base.constructor.call(this, element, options)
	};
	$.quiui.controls.Grid.quiExtend($.quiui.core.UIComponent, {
		__getType: function() {
			return "$.quiui.controls.Grid"
		},
		__idPrev: function() {
			return "grid"
		},
		_extendMethods: function() {
			return $.quiMethos.Grid
		},
		_init: function() {
			$.quiui.controls.Grid.base._init.call(this);
			var g = this,
				p = this.options;
			p.dataType = p.url ? "server" : "local";
			if (p.dataType == "local") {
				p.data = p.data || [];
				p.dataAction = "local"
			}
			if (p.isScroll == false) {
				p.height = "auto"
			}
			if (!p.frozen) {
				p.frozenCheckbox = false;
				p.frozenDetail = false;
				p.frozenRownumbers = false
			}
			if (p.detailToEdit) {
				p.enabledEdit = true;
				p.clickToEdit = false;
				p.detail = {
					height: "auto",
					onShowDetail: function(record, container, callback) {
						$(container).addClass("l-grid-detailpanel-edit");
						g.beginEdit(record, function(rowdata, column) {
							var editContainer = $("<div class='l-editbox'></div>");
							editContainer.width(120).height(p.rowHeight + 1);
							editContainer.appendTo(container);
							return editContainer
						});

						function removeRow() {
							$(container).parent().parent().remove();
							g.collapseDetail(record)
						}
						$("<div class='l-clear'></div>").appendTo(container);
						var $saveBtn = $("<button type='button'><span  class='icon_save'>" + p.saveMessage + "</span></button>");
						$saveBtn.render();
						$saveBtn.appendTo(container).click(function() {
							if (g.submitEdit(record) == false) {
								return false
							}
							g.endEdit(record);
							removeRow()
						});
						var $okBtn = $("<button type='button'><span  class='icon_ok'>" + p.applyMessage + "</span></button>");
						$okBtn.render();
						$okBtn.appendTo(container).click(function() {
							g.submitEdit(record)
						});
						var $cancelBtn = $("<button type='button'><span  class='icon_no'>" + p.cancelMessage + "</span></button>");
						$cancelBtn.render();
						$cancelBtn.appendTo(container).click(function() {
							g.cancelEdit(record);
							removeRow()
						})
					}
				}
			}
			if (p.tree) {
				p.tree.childrenName = p.tree.childrenName || "children";
				p.tree.isParent = p.tree.isParent ||
				function(rowData) {
					var exist;
					if (p.tree.childrenName in rowData) {
						if (null == rowData.children || rowData.children.length == 0) {
							exist = false
						} else {
							exist = true
						}
					} else {
						exist = false
					}
					return exist
				};
				p.tree.isExtend = p.tree.isExtend ||
				function(rowData) {
					if ("isextend" in rowData && rowData.isextend == false) {
						return false
					}
					return true
				}
			}
		},
		_render: function() {
			var g = this,
				p = this.options;
			g.grid = $(g.element);
			g.grid.addClass("l-panel");
			var gridhtmlarr = [];
			gridhtmlarr.push("        <div class='l-panel-header'><span class='l-panel-header-text'></span></div>");
			gridhtmlarr.push("                    <div class='l-grid-loading'></div>");
			gridhtmlarr.push("        <div class='l-panel-topbar'></div>");
			gridhtmlarr.push("        <div class='l-panel-bwarp'>");
			gridhtmlarr.push("            <div class='l-panel-body'>");
			gridhtmlarr.push("                <div class='l-grid'>");
			gridhtmlarr.push("                    <div class='l-grid-dragging-line'></div>");
			gridhtmlarr.push("                    <div class='l-grid-popup'><table cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");
			gridhtmlarr.push("                  <div class='l-grid1'>");
			if (p.multihead) {
				gridhtmlarr.push("                      <div class='l-grid-header l-grid-header-multi'>")
			} else {
				gridhtmlarr.push("                      <div class='l-grid-header l-grid-header1'>")
			}
			gridhtmlarr.push("                          <div class='l-grid-header-inner'><table class='l-grid-header-table' cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");
			gridhtmlarr.push("                      </div>");
			gridhtmlarr.push("                      <div class='l-grid-body l-grid-body1'>");
			gridhtmlarr.push("                      </div>");
			gridhtmlarr.push("                  </div>");
			gridhtmlarr.push("                  <div class='l-grid2'>");
			if (p.multihead) {
				gridhtmlarr.push("                      <div class='l-grid-header l-grid-header-multi'>")
			} else {
				gridhtmlarr.push("                      <div class='l-grid-header l-grid-header2'>")
			}
			gridhtmlarr.push("                          <div class='l-grid-header-inner'><table class='l-grid-header-table' cellpadding='0' cellspacing='0'><tbody></tbody></table></div>");
			gridhtmlarr.push("                      </div>");
			gridhtmlarr.push("                      <div class='l-grid-body l-grid-body2 l-scroll'>");
			gridhtmlarr.push("                      </div>");
			gridhtmlarr.push("                  </div>");
			gridhtmlarr.push("                 </div>");
			gridhtmlarr.push("              </div>");
			gridhtmlarr.push("         </div>");
			gridhtmlarr.push("         <div class='l-panel-bar'>");
			gridhtmlarr.push("            <div class='l-panel-bbar-inner'>");
			if (p.showPageInfo) {
				gridhtmlarr.push("                      <div class='l-bar-group  l-bar-message'><span class='l-bar-text'></span></div>")
			} else {
				gridhtmlarr.push("                      <div class='l-bar-group  l-bar-message' style='display:none;'><span class='l-bar-text'></span></div>")
			}
			gridhtmlarr.push("            <div class='l-bar-group l-bar-selectpagesize'></div>");
			gridhtmlarr.push("                <div class='l-bar-separator'></div>");
			gridhtmlarr.push("                <div class='l-bar-group'>");
			gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnfirst'><span></span></div>");
			gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnprev'><span></span></div>");
			gridhtmlarr.push("                </div>");
			gridhtmlarr.push("                <div class='l-bar-separator'></div>");
			gridhtmlarr.push("                <div class='l-bar-group'><span class='pcontrol'> <input type='text' size='4' value='1' style='width:20px' maxlength='3' /> / <span></span></span></div>");
			gridhtmlarr.push("                <div class='l-bar-separator'></div>");
			gridhtmlarr.push("                <div class='l-bar-group'>");
			gridhtmlarr.push("                     <div class='l-bar-button l-bar-btnnext'><span></span></div>");
			gridhtmlarr.push("                    <div class='l-bar-button l-bar-btnlast'><span></span></div>");
			gridhtmlarr.push("                </div>");
			gridhtmlarr.push("                <div class='l-bar-separator'></div>");
			gridhtmlarr.push("                <div class='l-bar-group'>");
			gridhtmlarr.push("                     <div class='l-bar-button l-bar-btnload'><span></span></div>");
			gridhtmlarr.push("                </div>");
			gridhtmlarr.push("                <div class='l-bar-separator'></div>");
			gridhtmlarr.push("                <div class='l-clear'></div>");
			gridhtmlarr.push("            </div>");
			gridhtmlarr.push("         </div>");
			g.grid.html(gridhtmlarr.join(""));
			g.header = $(".l-panel-header:first", g.grid);
			g.body = $(".l-panel-body:first", g.grid);
			g.toolbar = $(".l-panel-bar:first", g.grid);
			g.popup = $(".l-grid-popup:first", g.grid);
			g.gridloading = $(".l-grid-loading:first", g.grid);
			g.draggingline = $(".l-grid-dragging-line", g.grid);
			g.topbar = $(".l-panel-topbar:first", g.grid);
			g.gridview = $(".l-grid:first", g.grid);
			g.gridview.attr("id", g.id + "grid");
			g.gridview1 = $(".l-grid1:first", g.gridview);
			g.gridview2 = $(".l-grid2:first", g.gridview);
			g.gridheader = $(".l-grid-header:first", g.gridview2);
			g.gridbody = $(".l-grid-body:first", g.gridview2);
			g.f = {};
			g.f.gridheader = $(".l-grid-header:first", g.gridview1);
			g.f.gridbody = $(".l-grid-body:first", g.gridview1);
			g.currentData = null;
			g.changedCells = {};
			g.editors = {};
			g.editor = {
				editing: false
			};
			if (p.height == "auto") {
				g.bind("SysGridHeightChanged", function() {
					if (g.enabledFrozen()) {
						g.gridview.height(Math.max(g.gridview1.height(), g.gridview2.height()))
					}
				})
			}
			var pc = $.extend({}, p);
			this._bulid();
			this._setColumns(p.columns);
			delete pc.columns;
			delete pc.data;
			delete pc.url;
			g.set(pc);
			if (!p.delayLoad) {
				if (p.url) {
					g.set({
						url: p.url
					})
				} else {
					if (p.data) {
						g.set({
							data: p.data
						})
					}
				}
			}
		},
		_setFrozen: function(frozen) {
			if (frozen) {
				this.grid.addClass("l-frozen")
			} else {
				this.grid.removeClass("l-frozen")
			}
		},
		_setCssClass: function(value) {
			this.grid.addClass(value)
		},
		_setLoadingMessage: function(value) {
			this.gridloading.html(value)
		},
		_setHeight: function(h) {
			var g = this,
				p = this.options;
			g.unbind("SysGridHeightChanged");
			if (h == "auto") {
				g.bind("SysGridHeightChanged", function() {
					if (g.enabledFrozen()) {
						g.gridview.height(Math.max(g.gridview1.height(), g.gridview2.height()))
					}
				});
				return
			}
			if (typeof h == "string" && h.indexOf("%") > 0) {
				if (p.inWindow) {
					h = $(window).height() * parseFloat(h) * 0.01
				} else {
					h = g.grid.parent().height() * parseFloat(h) * 0.01
				}
			}
			if (p.title) {
				h -= 24
			}
			if (p.usePager) {
				h -= 32
			}
			if (p.totalRender) {
				h -= 25
			}
			if (p.toolbar) {
				h -= g.topbar.outerHeight()
			}
			var gridHeaderHeight = p.headerRowHeight * (g._columnMaxLevel - 1) + p.headerRowHeight - 1;
			h -= gridHeaderHeight;
			if (h > 0) {
				g.gridbody.height(h);
				if (h > 18) {
					g.f.gridbody.height(h - 18)
				}
				g.gridview.height(h + gridHeaderHeight)
			}
		},
		_updateFrozenWidth: function() {
			var g = this,
				p = this.options;
			if (g.enabledFrozen()) {
				g.gridview1.width(g.f.gridtablewidth);
				var view2width = g.gridview.width() - g.f.gridtablewidth;
				g.gridview2.css({
					left: g.f.gridtablewidth
				});
				if (view2width > 0) {
					g.gridview2.css({
						width: view2width
					})
				}
			}
		},
		_setWidth: function(value) {
			var g = this,
				p = this.options;
			if (g.enabledFrozen()) {
				g._onResize()
			}
		},
		_setUrl: function(value) {
			this.options.url = value;
			if (value) {
				this.options.dataType = "server";
				this.loadData(true)
			} else {
				this.options.dataType = "local"
			}
		},
		_setData: function(value) {
			this.loadData(this.options.data)
		},
		loadData: function(loadDataParm) {
			var g = this,
				p = this.options;
			g.loading = true;
			var clause = null;
			var loadServer = true;
			if (typeof(loadDataParm) == "function") {
				clause = loadDataParm;
				loadServer = false
			} else {
				if (typeof(loadDataParm) == "boolean") {
					loadServer = loadDataParm
				} else {
					if (typeof(loadDataParm) == "object" && loadDataParm) {
						loadServer = false;
						p.dataType = "local";
						p.data = loadDataParm
					}
				}
			}
			if (!p.newPage) {
				p.newPage = 1
			}
			if (p.dataAction == "server") {
				if (!p.sortOrder) {
					p.sortOrder = "desc"
				}
			}
			var param = [];
			if (p.params) {
				if (p.params.length) {
					$(p.params).each(function() {
						param.push({
							name: this.name,
							value: this.value
						})
					})
				} else {
					if (typeof p.params == "object") {
						for (var name in p.params) {
							param.push({
								name: name,
								value: p.params[name]
							})
						}
					}
				}
			}
			if (p.dataAction == "server") {
				if (p.usePager) {
					param.push({
						name: p.pageParmName,
						value: p.newPage
					});
					param.push({
						name: p.pagesizeParmName,
						value: p.pageSize
					})
				}
				if (p.sortName) {
					param.push({
						name: p.sortnameParmName,
						value: p.sortName
					});
					param.push({
						name: p.sortorderParmName,
						value: p.sortOrder
					})
				}
			}
			$(".l-bar-btnload span", g.toolbar).addClass("l-disabled");
			$(".l-grid-hd-row").removeClass("l-checked");
			if (p.dataType == "local") {
				g.filteredData = g.data = p.data;
				if (clause) {
					g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause)
				}
				if (p.usePager) {
					g.currentData = g._getCurrentPageData(g.filteredData)
				} else {
					g.currentData = g.filteredData
				}
				g._showData()
			} else {
				if (p.dataAction == "local" && !loadServer) {
					if (g.data && g.data[p.root]) {
						g.filteredData = g.data;
						if (clause) {
							g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause)
						}
						g.currentData = g._getCurrentPageData(g.filteredData);
						g._showData()
					}
				} else {
					g.loadServerData(param, clause)
				}
			}
			g.loading = false
		},
		loadServerData: function(param, clause) {
			var g = this,
				p = this.options;
			var ajaxOptions = {
				type: p.method,
				url: p.url,
				data: param,
				async: p.async,
				dataType: "json",
				beforeSend: function() {
					if (g.hasBind("loading")) {
						g.trigger("loading")
					} else {
						g.toggleLoading(true)
					}
				},
				success: function(data) {
					g.trigger("success", [data, g]);
					if (!data || !data[p.root] || !data[p.root].length) {
						g.currentData = g.data = {};
						g.currentData[p.root] = g.data[p.root] = [];
						g.currentData[p.record] = g.data[p.record] = 0;
						g._showData();
						return
					}
					g.data = data;
					if (p.dataAction == "server") {
						g.currentData = g.data
					} else {
						g.filteredData = g.data;
						if (clause) {
							g.filteredData[p.root] = g._searchData(g.filteredData[p.root], clause)
						}
						if (p.usePager) {
							g.currentData = g._getCurrentPageData(g.filteredData)
						} else {
							g.currentData = g.filteredData
						}
					}
					g._showData.quiDefer(g, 10, [g.currentData])
				},
				complete: function() {
					g.trigger("complete", [g]);
					if (g.hasBind("loaded")) {
						g.trigger("loaded", [g])
					} else {
						g.toggleLoading.quiDefer(g, 10, [false])
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					g.currentData = g.data = {};
					g.currentData[p.root] = g.data[p.root] = [];
					g.currentData[p.record] = g.data[p.record] = 0;
					g.toggleLoading.quiDefer(g, 10, [false]);
					$(".l-bar-btnload span", g.toolbar).removeClass("l-disabled");
					g.trigger("error", [XMLHttpRequest, textStatus, errorThrown])
				}
			};
			if (p.contentType) {
				ajaxOptions.contentType = p.contentType
			}
			$.ajax(ajaxOptions)
		},
		toggleLoading: function(show) {
			this.gridloading[show ? "show" : "hide"]()
		},
		setNewPage: function(value) {
			var g = this,
				p = this.options;
			p.newPage = value
		},
		getParams: function() {
			var g = this,
				p = this.options;
			return p.params
		},
		_createEditor: function(editor, container, editParm, width, height) {
			var editorInput = editor.create(container, editParm);
			if (editor.setValue) {
				editor.setValue(editorInput, editParm.value, editParm)
			}
			if (editor.resize) {
				editor.resize(editorInput, width, height, editParm)
			}
			return editorInput
		},
		beginEdit: function(rowParm, containerBulider) {
			var g = this,
				p = this.options;
			if (!p.enabledEdit || p.clickToEdit) {
				return
			}
			var rowdata = g.getRow(rowParm);
			if (rowdata._editing) {
				return
			}
			if (g.trigger("beginEdit", {
				record: rowdata,
				rowindex: rowdata.__index
			}) == false) {
				return
			}
			g.editors[rowdata.__id] = {};
			rowdata._editing = true;
			g.reRender({
				rowdata: rowdata
			});
			containerBulider = containerBulider ||
			function(rowdata, column) {
				var cellobj = g.getCellObj(rowdata, column);
				var container = $(cellobj).html("");
				g.setCellEditing(rowdata, column, true);
				return container
			};
			for (var i = 0, l = g.columns.length; i < l; i++) {
				var column = g.columns[i];
				if (!column.name || !column.editor || !column.editor.type || !p.editors[column.editor.type]) {
					continue
				}
				var editor = p.editors[column.editor.type];
				var editParm = {
					record: rowdata,
					value: rowdata[column.name],
					column: column,
					rowindex: rowdata.__index,
					grid: g
				};
				var container = containerBulider(rowdata, column);
				var width = container.width(),
					height = container.height();
				var editorInput = g._createEditor(editor, container, editParm, width, height);
				g.editors[rowdata.__id][column.__id] = {
					editor: editor,
					input: editorInput,
					editParm: editParm,
					container: container
				}
			}
			g.trigger("afterBeginEdit", {
				record: rowdata,
				rowindex: rowdata.__index
			})
		},
		cancelEdit: function(rowParm) {
			var g = this;
			if (rowParm == undefined) {
				for (var rowid in g.editors) {
					g.cancelEdit(rowid)
				}
			} else {
				var rowdata = g.getRow(rowParm);
				if (!g.editors[rowdata.__id]) {
					return
				}
				if (g.trigger("cancelEdit", {
					record: rowdata,
					rowindex: rowdata.__index
				}) == false) {
					return
				}
				for (var columnid in g.editors[rowdata.__id]) {
					var o = g.editors[rowdata.__id][columnid];
					if (o.editor.destroy) {
						o.editor.destroy(o.input, o.editParm)
					}
				}
				delete g.editors[rowdata.__id];
				delete rowdata._editing;
				g.reRender({
					rowdata: rowdata
				})
			}
		},
		addEditRow: function(rowdata, neardata, isBefore) {
			this.submitEdit();
			rowdata = this.add(rowdata, neardata, isBefore);
			this.beginEdit(rowdata);
			this.select(rowdata)
		},
		submitEdit: function(rowParm) {
			var g = this,
				p = this.options;
			if (rowParm == undefined) {
				for (var rowid in g.editors) {
					g.submitEdit(rowid)
				}
			} else {
				var rowdata = g.getRow(rowParm);
				var newdata = {};
				if (!g.editors[rowdata.__id]) {
					return
				}
				for (var columnid in g.editors[rowdata.__id]) {
					var o = g.editors[rowdata.__id][columnid];
					var column = o.editParm.column;
					if (column.name) {
						newdata[column.name] = o.editor.getValue(o.input, o.editParm)
					}
				}
				if (g.trigger("beforeSubmitEdit", {
					record: rowdata,
					rowindex: rowdata.__index,
					newdata: newdata
				}) == false) {
					return false
				}
				g.updateRow(rowdata, newdata);
				g.trigger("afterSubmitEdit", {
					record: rowdata,
					rowindex: rowdata.__index,
					newdata: newdata
				})
			}
		},
		endEdit: function(rowParm) {
			var g = this,
				p = this.options;
			if (g.editor.editing) {
				var o = g.editor;
				g.trigger("sysEndEdit", [g.editor.editParm]);
				g.trigger("endEdit", [g.editor.editParm]);
				if (o.editor.destroy) {
					o.editor.destroy(o.input, o.editParm)
				}
				g.editor.container.remove();
				g.reRender({
					rowdata: g.editor.editParm.record,
					column: g.editor.editParm.column
				});
				g.trigger("afterEdit", [g.editor.editParm]);
				g.editor = {
					editing: false
				}
			} else {
				if (rowParm != undefined) {
					var rowdata = g.getRow(rowParm);
					if (!g.editors[rowdata.__id]) {
						return
					}
					if (g.submitEdit(rowParm) == false) {
						return false
					}
					for (var columnid in g.editors[rowdata.__id]) {
						var o = g.editors[rowdata.__id][columnid];
						if (o.editor.destroy) {
							o.editor.destroy(o.input, o.editParm)
						}
					}
					delete g.editors[rowdata.__id];
					delete rowdata._editing;
					g.trigger("afterEdit", {
						record: rowdata,
						rowindex: rowdata.__index
					})
				} else {
					for (var rowid in g.editors) {
						g.endEdit(rowid)
					}
				}
			}
		},
		setWidth: function(w) {
			return this._setWidth(w)
		},
		setHeight: function(h) {
			return this._setHeight(h)
		},
		enabledCheckbox: function() {
			return this.options.checkbox ? true : false
		},
		enabledFrozen: function() {
			var g = this,
				p = this.options;
			if (!p.frozen) {
				return false
			}
			var cols = g.columns || [];
			if (g.enabledDetail() && p.frozenDetail || g.enabledCheckbox() && p.frozenCheckbox || p.frozenRownumbers && p.rownumbers) {
				return true
			}
			for (var i = 0, l = cols.length; i < l; i++) {
				if (cols[i].frozen) {
					return true
				}
			}
			this._setFrozen(false);
			return false
		},
		enabledDetailEdit: function() {
			if (!this.enabledDetail()) {
				return false
			}
			return this.options.detailToEdit ? true : false
		},
		enabledDetail: function() {
			if (this.options.detail && this.options.detail.onShowDetail) {
				return true
			}
			return false
		},
		enabledGroup: function() {
			return this.options.groupColumnName ? true : false
		},
		deleteSelectedRow: function() {
			if (!this.selected) {
				return
			}
			for (var i in this.selected) {
				var o = this.selected[i];
				if (o.__id in this.records) {
					this._deleteData.quiDefer(this, 10, [o])
				}
			}
			this.reRender.quiDefer(this, 20)
		},
		removeRange: function(rowArr) {
			var g = this,
				p = this.options;
			$.each(rowArr, function() {
				g._removeData(this)
			});
			g.reRender()
		},
		remove: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			g._removeData(rowParm);
			g.reRender()
		},
		deleteRange: function(rowArr) {
			var g = this,
				p = this.options;
			$.each(rowArr, function() {
				g._deleteData(this)
			});
			g.reRender()
		},
		deleteRow: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata) {
				return
			}
			g._deleteData(rowdata);
			g.reRender();
			g.isDataChanged = true
		},
		_deleteData: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			rowdata[p.statusName] = "delete";
			if (p.tree) {
				var children = g.getChildren(rowdata, true);
				if (children) {
					for (var i = 0, l = children.length; i < l; i++) {
						children[i][p.statusName] = "delete"
					}
				}
			}
			g.deletedRows = g.deletedRows || [];
			g.deletedRows.push(rowdata);
			g._removeSelected(rowdata)
		},
		updateCell: function(arg, value, rowParm) {
			var g = this,
				p = this.options;
			var column, cellObj, rowdata;
			if (typeof(arg) == "string") {
				for (var i = 0, l = g.columns.length; i < l; i++) {
					if (g.columns[i].name == arg) {
						g.updateCell(i, value, rowParm)
					}
				}
				return
			}
			if (typeof(arg) == "number") {
				column = g.columns[arg];
				rowdata = g.getRow(rowParm);
				cellObj = g.getCellObj(rowdata, column)
			} else {
				if (typeof(arg) == "object" && arg.__id) {
					column = arg;
					rowdata = g.getRow(rowParm);
					cellObj = g.getCellObj(rowdata, column)
				} else {
					cellObj = arg;
					var ids = cellObj.id.split("|");
					var columnid = ids[ids.length - 1];
					column = g._columns[columnid];
					var row = $(cellObj).parent();
					rowdata = rowdata || g.getRow(row[0])
				}
			}
			if (value != null && column.name) {
				rowdata[column.name] = value;
				if (rowdata[p.statusName] != "add") {
					rowdata[p.statusName] = "update"
				}
				g.isDataChanged = true
			}
			g.reRender({
				rowdata: rowdata,
				column: column
			})
		},
		addRows: function(rowdataArr, neardata, isBefore, parentRowData) {
			var g = this,
				p = this.options;
			$(rowdataArr).each(function() {
				g.addRow(this, neardata, isBefore, parentRowData)
			})
		},
		_createRowid: function() {
			return "r" + (1000 + this.recordNumber)
		},
		_isRowId: function(str) {
			return (str in this.records)
		},
		_addNewRecord: function(o, previd, pid) {
			var g = this,
				p = this.options;
			g.recordNumber++;
			o.__id = g._createRowid();
			o.__previd = previd;
			if (previd && previd != -1) {
				var prev = g.records[previd];
				if (prev.__nextid && prev.__nextid != -1) {
					var prevOldNext = g.records[prev.__nextid];
					if (prevOldNext) {
						prevOldNext.__previd = o.__id
					}
				}
				prev.__nextid = o.__id;
				o.__index = prev.__index + 1
			} else {
				o.__index = 0
			}
			if (p.tree) {
				if (pid && pid != -1) {
					var parent = g.records[pid];
					o.__pid = pid;
					o.__level = parent.__level + 1
				} else {
					o.__pid = -1;
					o.__level = 1
				}
				o.__hasChildren = o[p.tree.childrenName] ? true : false
			}
			if (o[p.statusName] != "add") {
				o[p.statusName] = "nochanged"
			}
			g.rows[o.__index] = o;
			g.records[o.__id] = o;
			return o
		},
		_getRows: function(data) {
			var g = this,
				p = this.options;
			var targetData = [];

			function load(data) {
				if (!data || !data.length) {
					return
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var o = data[i];
					targetData.push(o);
					if (o[p.tree.childrenName]) {
						load(o[p.tree.childrenName])
					}
				}
			}
			load(data);
			return targetData
		},
		_updateGridData: function() {
			var g = this,
				p = this.options;
			g.recordNumber = 0;
			g.rows = [];
			g.records = {};
			var previd = -1;

			function load(data, pid) {
				if (!data || !data.length) {
					return
				}
				for (var i = 0, l = data.length; i < l; i++) {
					var o = data[i];
					g.formatRecord(o);
					if (o[p.statusName] == "delete") {
						continue
					}
					g._addNewRecord(o, previd, pid);
					previd = o.__id;
					if (o.__hasChildren) {
						load(o[p.tree.childrenName], o.__id)
					}
				}
			}
			load(g.currentData[p.root], -1);
			return g.rows
		},
		_moveData: function(from, to, isAfter) {
			var g = this,
				p = this.options;
			var fromRow = g.getRow(from);
			var toRow = g.getRow(to);
			var fromIndex, toIndex;
			var listdata = g._getParentChildren(fromRow);
			fromIndex = $.inArray(fromRow, listdata);
			listdata.splice(fromIndex, 1);
			listdata = g._getParentChildren(toRow);
			toIndex = $.inArray(toRow, listdata);
			listdata.splice(toIndex + (isAfter ? 1 : 0), 0, fromRow)
		},
		move: function(from, to, isAfter) {
			this._moveData(from, to, isAfter);
			this.reRender()
		},
		moveRange: function(rows, to, isAfter) {
			for (var i in rows) {
				this._moveData(rows[i], to, isAfter)
			}
			this.reRender()
		},
		up: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var listdata = g._getParentChildren(rowdata);
			var index = $.inArray(rowdata, listdata);
			if (index == -1 || index == 0) {
				return
			}
			var selected = g.getSelected();
			g.move(rowdata, listdata[index - 1], false);
			g.select(selected)
		},
		down: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var listdata = g._getParentChildren(rowdata);
			var index = $.inArray(rowdata, listdata);
			if (index == -1 || index == listdata.length - 1) {
				return
			}
			var selected = g.getSelected();
			g.move(rowdata, listdata[index + 1], true);
			g.select(selected)
		},
		addRow: function(rowdata, neardata, isBefore, parentRowData) {
			var g = this,
				p = this.options;
			rowdata = rowdata || {};
			g._addData(rowdata, parentRowData, neardata, isBefore);
			g.reRender();
			rowdata[p.statusName] = "add";
			if (p.tree) {
				var children = g.getChildren(rowdata, true);
				if (children) {
					for (var i = 0, l = children.length; i < l; i++) {
						children[i][p.statusName] = "add"
					}
				}
			}
			g.isDataChanged = true;
			p.total = p.total ? (p.total + 1) : 1;
			p.pageCount = Math.ceil(p.total / p.pageSize);
			g._buildPager();
			g.trigger("SysGridHeightChanged");
			g.trigger("afterAddRow", [rowdata]);
			return rowdata
		},
		updateRow: function(rowDom, newRowData) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowDom);
			g.isDataChanged = true;
			$.extend(rowdata, newRowData || {});
			if (rowdata[p.statusName] != "add") {
				rowdata[p.statusName] = "update"
			}
			g.reRender.quiDefer(g, 10, [{
				rowdata: rowdata
			}]);
			return rowdata
		},
		setCellEditing: function(rowdata, column, editing) {
			var g = this,
				p = this.options;
			var cell = g.getCellObj(rowdata, column);
			var methodName = editing ? "addClass" : "removeClass";
			$(cell)[methodName]("l-grid-row-cell-editing");
			if (rowdata.__id != 0) {
				var prevrowobj = $(g.getRowObj(rowdata.__id)).prev();
				if (!prevrowobj.length) {
					return
				}
				var prevrow = g.getRow(prevrowobj[0]);
				var cellprev = g.getCellObj(prevrow, column);
				if (!cellprev) {
					return
				}
				$(cellprev)[methodName]("l-grid-row-cell-editing-topcell")
			}
			if (column.__previd != -1 && column.__previd != null) {
				var cellprev = $(g.getCellObj(rowdata, column)).prev();
				$(cellprev)[methodName]("l-grid-row-cell-editing-leftcell")
			}
		},
		reRender: function(e) {
			var g = this,
				p = this.options;
			e = e || {};
			var rowdata = e.rowdata,
				column = e.column;
			if (column && (column.isdetail || column.ischeckbox)) {
				return
			}
			if (rowdata && rowdata[p.statusName] == "delete") {
				return
			}
			if (rowdata && column) {
				var cell = g.getCellObj(rowdata, column);
				$(cell).html(g._getCellHtml(rowdata, column));
				if (!column.issystem) {
					g.setCellEditing(rowdata, column, false)
				}
			} else {
				if (rowdata) {
					$(g.columns).each(function() {
						g.reRender({
							rowdata: rowdata,
							column: this
						})
					})
				} else {
					if (column) {
						for (var rowid in g.records) {
							g.reRender({
								rowdata: g.records[rowid],
								column: column
							})
						}
						for (var i = 0; i < g.totalNumber; i++) {
							var tobj = document.getElementById(g.id + "|total" + i + "|" + column.__id);
							$("div:first", tobj).html(g._getTotalCellContent(column, g.groups && g.groups[i] ? g.groups[i] : g.currentData[p.root]))
						}
					} else {
						g._showData()
					}
				}
			}
		},
		getData: function(status, removeStatus) {
			var g = this,
				p = this.options;
			var data = [];
			for (var rowid in g.records) {
				var o = $.extend(true, {}, g.records[rowid]);
				if (o[p.statusName] == status || status == undefined) {
					data.push(g.formatRecord(o, removeStatus))
				}
			}
			return data
		},
		formatRecord: function(o, removeStatus) {
			delete o.__id;
			delete o.__previd;
			delete o.__nextid;
			delete o.__index;
			if (this.options.tree) {
				delete o.__pid;
				delete o.__level;
				delete o.__hasChildren
			}
			if (removeStatus) {
				delete o[this.options.statusName]
			}
			return o
		},
		getUpdated: function() {
			return this.getData("update", true)
		},
		getDeleted: function() {
			return this.deletedRows
		},
		getAdded: function() {
			return this.getData("add", true)
		},
		getColumn: function(columnParm) {
			var g = this,
				p = this.options;
			if (typeof columnParm == "string") {
				if (g._isColumnId(columnParm)) {
					return g._columns[columnParm]
				} else {
					return g.columns[parseInt(columnParm)]
				}
			} else {
				if (typeof(columnParm) == "number") {
					return g.columns[columnParm]
				} else {
					if (typeof columnParm == "object" && columnParm.nodeType == 1) {
						var ids = columnParm.id.split("|");
						var columnid = ids[ids.length - 1];
						return g._columns[columnid]
					}
				}
			}
			return columnParm
		},
		getColumnType: function(columnname) {
			var g = this,
				p = this.options;
			for (i = 0; i < g.columns.length; i++) {
				if (g.columns[i].name == columnname) {
					if (g.columns[i].type) {
						return g.columns[i].type
					}
					return "string"
				}
			}
			return null
		},
		isTotalSummary: function() {
			var g = this,
				p = this.options;
			for (var i = 0; i < g.columns.length; i++) {
				if (g.columns[i].totalSummary) {
					return true
				}
			}
			return false
		},
		getColumns: function(columnLevel) {
			var g = this,
				p = this.options;
			var columns = [];
			for (var id in g._columns) {
				var col = g._columns[id];
				if (columnLevel != undefined) {
					if (col.__level == columnLevel) {
						columns.push(col)
					}
				} else {
					if (col.__leaf) {
						columns.push(col)
					}
				}
			}
			return columns
		},
		changeSort: function(columnName, sortOrder) {
			var g = this,
				p = this.options;
			if (g.loading) {
				return true
			}
			if (p.dataAction == "local") {
				var columnType = g.getColumnType(columnName);
				if (!g.sortedData) {
					g.sortedData = g.filteredData
				}
				if (p.sortName == columnName) {
					g.sortedData[p.root].reverse()
				} else {
					g.sortedData[p.root].sort(function(data1, data2) {
						return g._compareData(data1, data2, columnName, columnType)
					})
				}
				if (p.usePager) {
					g.currentData = g._getCurrentPageData(g.sortedData)
				} else {
					g.currentData = g.sortedData
				}
				g._showData()
			}
			p.sortName = columnName;
			p.sortOrder = sortOrder;
			if (p.dataAction == "server") {
				g.loadData(p.where)
			}
			g.trigger("changeSort")
		},
		changePage: function(ctype) {
			var g = this,
				p = this.options;
			if (g.loading) {
				return true
			}
			if (p.dataAction != "local" && g.isDataChanged) {
				return false
			}
			p.pageCount = parseInt($(".pcontrol span", g.toolbar).html());
			switch (ctype) {
			case "first":
				if (p.page == 1) {
					return
				}
				p.newPage = 1;
				break;
			case "prev":
				if (p.page == 1) {
					return
				}
				if (p.page > 1) {
					p.newPage = parseInt(p.page) - 1
				}
				break;
			case "next":
				if (p.page >= p.pageCount) {
					return
				}
				p.newPage = parseInt(p.page) + 1;
				break;
			case "last":
				if (p.page >= p.pageCount) {
					return
				}
				p.newPage = p.pageCount;
				break;
			case "input":
				var nv = parseInt($(".pcontrol input", g.toolbar).val());
				if (isNaN(nv)) {
					nv = 1
				}
				if (nv < 1) {
					nv = 1
				} else {
					if (nv > p.pageCount) {
						nv = p.pageCount
					}
				}
				$(".pcontrol input", g.toolbar).val(nv);
				p.newPage = nv;
				break
			}
			if (p.newPage == p.page) {
				return false
			}
			if (p.newPage == 1) {
				$(".l-bar-btnfirst span", g.toolbar).addClass("l-disabled");
				$(".l-bar-btnprev span", g.toolbar).addClass("l-disabled")
			} else {
				$(".l-bar-btnfirst span", g.toolbar).removeClass("l-disabled");
				$(".l-bar-btnprev span", g.toolbar).removeClass("l-disabled")
			}
			if (p.newPage == p.pageCount) {
				$(".l-bar-btnlast span", g.toolbar).addClass("l-disabled");
				$(".l-bar-btnnext span", g.toolbar).addClass("l-disabled")
			} else {
				$(".l-bar-btnlast span", g.toolbar).removeClass("l-disabled");
				$(".l-bar-btnnext span", g.toolbar).removeClass("l-disabled")
			}
			g.trigger("changePage", [p.newPage]);
			if (p.dataAction == "server") {
				g.loadData(p.where)
			} else {
				g.currentData = g._getCurrentPageData(g.filteredData);
				g._showData()
			}
		},
		getSelectedRow: function() {
			for (var i in this.selected) {
				var o = this.selected[i];
				if (o.__id in this.records) {
					return o
				}
			}
			return null
		},
		getSelectedRows: function() {
			var arr = [];
			for (var i in this.selected) {
				var o = this.selected[i];
				if (o.__id in this.records) {
					arr.push(o)
				}
			}
			return arr
		},
		getSelectedRowObj: function() {
			for (var i in this.selected) {
				var o = this.selected[i];
				if (o.__id in this.records) {
					return this.getRowObj(o)
				}
			}
			return null
		},
		getSelectedRowObjs: function() {
			var arr = [];
			for (var i in this.selected) {
				var o = this.selected[i];
				if (o.__id in this.records) {
					arr.push(this.getRowObj(o))
				}
			}
			return arr
		},
		getCellObj: function(rowParm, column) {
			var rowdata = this.getRow(rowParm);
			column = this.getColumn(column);
			return document.getElementById(this._getCellDomId(rowdata, column))
		},
		getRowObj: function(rowParm, frozen) {
			var g = this,
				p = this.options;
			if (rowParm == null) {
				return null
			}
			if (typeof(rowParm) == "string") {
				if (g._isRowId(rowParm)) {
					return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + rowParm)
				} else {
					return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + g.rows[parseInt(rowParm)]["__id"])
				}
			} else {
				if (typeof(rowParm) == "number") {
					return document.getElementById(g.id + (frozen ? "|1|" : "|2|") + g.rows[rowParm]["__id"])
				} else {
					if (typeof(rowParm) == "object" && rowParm.__id) {
						return g.getRowObj(rowParm.__id, frozen)
					}
				}
			}
			return rowParm
		},
		getRow: function(rowParm) {
			var g = this,
				p = this.options;
			if (rowParm == null) {
				return null
			}
			if (typeof(rowParm) == "string") {
				if (g._isRowId(rowParm)) {
					return g.records[rowParm]
				} else {
					return g.rows[parseInt(rowParm)]
				}
			} else {
				if (typeof(rowParm) == "number") {
					return g.rows[parseInt(rowParm)]
				} else {
					if (typeof(rowParm) == "object" && rowParm.nodeType == 1 && !rowParm.__id) {
						return g._getRowByDomId(rowParm.id)
					}
				}
			}
			return rowParm
		},
		_setColumnVisible: function(column, hide) {
			var g = this,
				p = this.options;
			if (!hide) {
				column._hide = false;
				document.getElementById(column.__domid).style.display = "";
				if (column.__pid != -1) {
					var pcol = g._columns[column.__pid];
					if (pcol._hide) {
						document.getElementById(pcol.__domid).style.display = "";
						this._setColumnVisible(pcol, hide)
					}
				}
			} else {
				column._hide = true;
				document.getElementById(column.__domid).style.display = "none";
				if (column.__pid != -1) {
					var hideall = true;
					var pcol = this._columns[column.__pid];
					for (var i = 0; pcol && i < pcol.columns.length; i++) {
						if (!pcol.columns[i]._hide) {
							hideall = false;
							break
						}
					}
					if (hideall) {
						pcol._hide = true;
						document.getElementById(pcol.__domid).style.display = "none";
						this._setColumnVisible(pcol, hide)
					}
				}
			}
		},
		toggleCol: function(columnparm, visible, toggleByPopup) {
			var g = this,
				p = this.options;
			var column;
			if (typeof(columnparm) == "number") {
				column = g.columns[columnparm]
			} else {
				if (typeof(columnparm) == "object" && columnparm.__id) {
					column = columnparm
				} else {
					if (typeof(columnparm) == "string") {
						if (g._isColumnId(columnparm)) {
							column = g._columns[columnparm]
						} else {
							$(g.columns).each(function() {
								if (this.name == columnparm) {
									g.toggleCol(this, visible, toggleByPopup)
								}
							});
							return
						}
					}
				}
			}
			if (!column) {
				return
			}
			var columnindex = column.__leafindex;
			var headercell = document.getElementById(column.__domid);
			if (!headercell) {
				return
			}
			headercell = $(headercell);
			var cells = [];
			for (var i in g.rows) {
				var obj = g.getCellObj(g.rows[i], column);
				if (obj) {
					cells.push(obj)
				}
			}
			for (var i = 0; i < g.totalNumber; i++) {
				var tobj = document.getElementById(g.id + "|total" + i + "|" + column.__id);
				if (tobj) {
					cells.push(tobj)
				}
			}
			var colwidth = column._width;
			if (visible && column._hide) {
				if (column.frozen) {
					g.f.gridtablewidth += (parseInt(colwidth) + 1)
				} else {
					g.gridtablewidth += (parseInt(colwidth) + 1)
				}
				g._setColumnVisible(column, false);
				$(cells).show()
			} else {
				if (!visible && !column._hide) {
					if (column.frozen) {
						g.f.gridtablewidth -= (parseInt(colwidth) + 1)
					} else {
						g.gridtablewidth -= (parseInt(colwidth) + 1)
					}
					g._setColumnVisible(column, true);
					$(cells).hide()
				}
			}
			if (column.frozen) {
				$("div:first", g.f.gridheader).width(g.f.gridtablewidth);
				$("div:first", g.f.gridbody).width(g.f.gridtablewidth)
			} else {
				$("div:first", g.gridheader).width(g.gridtablewidth + 40);
				$("div:first", g.gridbody).width(g.gridtablewidth)
			}
			g._updateFrozenWidth();
			if (!toggleByPopup) {
				$(":checkbox[columnindex=" + columnindex + "]", g.popup).each(function() {
					this.checked = visible;
					if ($.fn.quiCheckBox) {
						var checkboxmanager = $(this).quiGetCheckBoxManager();
						if (checkboxmanager) {
							checkboxmanager.updateStyle()
						}
					}
				})
			}
		},
		setColumnWidth: function(columnparm, newwidth) {
			var g = this,
				p = this.options;
			if (!newwidth) {
				return
			}
			newwidth = parseInt(newwidth, 10);
			var column;
			if (typeof(columnparm) == "number") {
				column = g.columns[columnparm]
			} else {
				if (typeof(columnparm) == "object" && columnparm.__id) {
					column = columnparm
				} else {
					if (typeof(columnparm) == "string") {
						if (g._isColumnId(columnparm)) {
							column = g._columns[columnparm]
						} else {
							$(g.columns).each(function() {
								if (this.name == columnparm) {
									g.setColumnWidth(this, newwidth)
								}
							});
							return
						}
					}
				}
			}
			if (!column) {
				return
			}
			var mincolumnwidth = p.minColumnWidth;
			if (column.minWidth) {
				mincolumnwidth = column.minWidth
			}
			newwidth = newwidth < mincolumnwidth ? mincolumnwidth : newwidth;
			var diff = newwidth - column._width;
			if (g.trigger("beforeChangeColumnWidth", [column, newwidth]) == false) {
				return
			}
			column._width = newwidth;
			if (column.frozen) {
				g.f.gridtablewidth += diff;
				$("div:first", g.f.gridheader).width(g.f.gridtablewidth);
				$("div:first", g.f.gridbody).width(g.f.gridtablewidth)
			} else {
				g.gridtablewidth += diff;
				$("div:first", g.gridheader).width(g.gridtablewidth + 40);
				$("div:first", g.gridbody).width(g.gridtablewidth)
			}
			$(document.getElementById(column.__domid)).css("width", newwidth);
			var cells = [];
			for (var rowid in g.records) {
				var obj = g.getCellObj(g.records[rowid], column);
				if (obj) {
					cells.push(obj)
				}
				if (!g.enabledDetailEdit() && g.editors[rowid] && g.editors[rowid][column.__id]) {
					var o = g.editors[rowid][column.__id];
					if (o.editor.resize) {
						o.editor.resize(o.input, newwidth, o.container.height(), o.editParm)
					}
				}
			}
			for (var i = 0; i < g.totalNumber; i++) {
				var tobj = document.getElementById(g.id + "|total" + i + "|" + column.__id);
				if (tobj) {
					cells.push(tobj)
				}
			}
			$(cells).css("width", newwidth).find("> div.l-grid-row-cell-inner:first").css("width", newwidth - 8);
			g._updateFrozenWidth();
			g.trigger("afterChangeColumnWidth", [column, newwidth])
		},
		changeHeaderText: function(columnparm, headerText) {
			var g = this,
				p = this.options;
			var column;
			if (typeof(columnparm) == "number") {
				column = g.columns[columnparm]
			} else {
				if (typeof(columnparm) == "object" && columnparm.__id) {
					column = columnparm
				} else {
					if (typeof(columnparm) == "string") {
						if (g._isColumnId(columnparm)) {
							column = g._columns[columnparm]
						} else {
							$(g.columns).each(function() {
								if (this.name == columnparm) {
									g.changeHeaderText(this, headerText)
								}
							});
							return
						}
					}
				}
			}
			if (!column) {
				return
			}
			var columnindex = column.__leafindex;
			var headercell = document.getElementById(column.__domid);
			$(".l-grid-hd-cell-text", headercell).html(headerText);
			if (p.allowHideColumn) {
				$(":checkbox[columnindex=" + columnindex + "]", g.popup).parent().next().html(headerText)
			}
		},
		changeCol: function(from, to, isAfter) {
			var g = this,
				p = this.options;
			if (!from || !to) {
				return
			}
			var fromCol = g.getColumn(from);
			var toCol = g.getColumn(to);
			fromCol.frozen = toCol.frozen;
			var fromColIndex, toColIndex;
			var fromColumns = fromCol.__pid == -1 ? p.columns : g._columns[fromCol.__pid].columns;
			var toColumns = toCol.__pid == -1 ? p.columns : g._columns[toCol.__pid].columns;
			fromColIndex = $.inArray(fromCol, fromColumns);
			toColIndex = $.inArray(toCol, toColumns);
			var sameParent = fromColumns == toColumns;
			var sameLevel = fromCol.__level == toCol.__level;
			toColumns.splice(toColIndex + (isAfter ? 1 : 0), 0, fromCol);
			if (!sameParent) {
				fromColumns.splice(fromColIndex, 1)
			} else {
				if (isAfter) {
					fromColumns.splice(fromColIndex, 1)
				} else {
					fromColumns.splice(fromColIndex + 1, 1)
				}
			}
			g._setColumns(p.columns);
			g.reRender()
		},
		resetHeight: function() {
			var g = this,
				p = this.options;
			if (p.height && p.height != "auto") {
				var windowHeight = $(window).height();
				var h = 0;
				var parentHeight = null;
				if (typeof(p.height) == "string" && p.height.indexOf("%") > 0) {
					var gridparent = g.grid.parent();
					if (p.InWindow) {
						parentHeight = windowHeight;
						parentHeight -= parseInt($("body").css("paddingTop"));
						parentHeight -= parseInt($("body").css("paddingBottom"))
					} else {
						parentHeight = gridparent.height()
					}
					h = parentHeight * parseFloat(p.height) * 0.01;
					if (p.InWindow || gridparent[0].tagName.toLowerCase() == "body") {
						h -= (g.grid.offset().top - parseInt($("body").css("paddingTop")))
					}
				} else {
					h = parseInt(p.height)
				}
				h += p.heightDiff;
				g.windowHeight = windowHeight;
				g._setHeight(h)
			}
		},
		resetWidth: function() {
			var g = this,
				p = this.options;
			if (g.enabledFrozen()) {
				var gridView1Width = g.gridview1.width();
				var gridViewWidth = g.gridview.width();
				g.gridview2.css({
					width: gridViewWidth - gridView1Width
				})
			}
			if (p.percentWidthMode == true) {
				if (p.oldTotalWidth != g.grid.width()) {
					var rownumbersColFix = 0;
					var checkboxColFix = 0;
					if (p.rownumbers) {
						rownumbersColFix = p.rownumbersColWidth + 2
					}
					if (p.checkbox) {
						checkboxColFix = p.checkboxColWidth + 2
					}
					g.gridtablewidth = g.grid.width() - rownumbersColFix - checkboxColFix;
					if (g.columns) {
						g.gridtablewidth = g.gridtablewidth
					}
					$(g.columns).each(function(i, column) {
						if (column.isrownumber) {} else {
							if (column.ischeckbox) {} else {
								if (column.isdetail) {} else {
									var colwidth;
									if (column.width) {
										colwidth = column.width;
										if (typeof(colwidth) == "string" && colwidth.indexOf("%") > 0) {
											column._width = colwidth = parseInt(parseInt(colwidth) * 0.01 * (g.grid.width() - g.columns.length - rownumbersColFix - checkboxColFix));
											g.setColumnWidth(column, column._width)
										}
									}
								}
							}
						}
					});
					p.oldTotalWidth = g.grid.width()
				}
			}
		},
		setScroller: function(scrollY, scrollX, animate) {
			var g = this,
				p = this.options;
			var scrollYNum;
			var scrollXNum;
			if (scrollY && typeof(scrollY) == "string") {
				if (scrollY == "bottom") {
					scrollYNum = g.gridbody.find(".l-grid-body-inner").height()
				} else {
					if (scrollY == "top") {
						scrollYNum = 0
					}
				}
			}
			if (scrollX && typeof(scrollX) == "string") {
				if (scrollX == "right") {
					scrollXNum = g.gridbody.find(".l-grid-body-inner").width()
				} else {
					if (scrollX == "left") {
						scrollXNum = 0
					}
				}
			}
			if (scrollX != null && scrollY != null) {
				if (animate == true) {
					g.gridbody.animate({
						scrollTop: scrollYNum,
						scrollLeft: scrollXNum
					}, 1000)
				} else {
					g.gridbody[0].scrollTop = scrollYNum;
					g.gridbody[0].scrollLeft = scrollXNum
				}
			} else {
				if (scrollX == null) {
					if (animate == true) {
						g.gridbody.animate({
							scrollTop: scrollYNum
						}, 1000)
					} else {
						g.gridbody[0].scrollTop = scrollYNum
					}
				} else {
					if (scrollY == null) {
						if (animate == true) {
							g.gridbody.animate({
								scrollLeft: scrollXNum
							}, 1000)
						} else {
							g.gridbody[0].scrollLeft = scrollXNum
						}
					}
				}
			}
		},
		collapseDetail: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata) {
				return
			}
			for (var i = 0, l = g.columns.length; i < l; i++) {
				if (g.columns[i].isdetail) {
					var row = g.getRowObj(rowdata);
					var cell = g.getCellObj(rowdata, g.columns[i]);
					$(row).next("tr.l-grid-detailpanel").hide();
					$(".l-grid-row-cell-detailbtn:first", cell).removeClass("l-open");
					g.trigger("SysGridHeightChanged");
					return
				}
			}
		},
		extendDetail: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata) {
				return
			}
			for (var i = 0, l = g.columns.length; i < l; i++) {
				if (g.columns[i].isdetail) {
					var row = g.getRowObj(rowdata);
					var cell = g.getCellObj(rowdata, g.columns[i]);
					$(row).next("tr.l-grid-detailpanel").show();
					$(".l-grid-row-cell-detailbtn:first", cell).addClass("l-open");
					g.trigger("SysGridHeightChanged");
					return
				}
			}
		},
		getParent: function(rowParm) {
			var g = this,
				p = this.options;
			if (!p.tree) {
				return null
			}
			var rowdata = g.getRow(rowParm);
			if (!rowdata) {
				return null
			}
			if (rowdata.__pid in g.records) {
				return g.records[rowdata.__pid]
			} else {
				return null
			}
		},
		getChildren: function(rowParm, deep) {
			var g = this,
				p = this.options;
			if (!p.tree) {
				return null
			}
			var rowData = g.getRow(rowParm);
			if (!rowData) {
				return null
			}
			var arr = [];

			function loadChildren(data) {
				if (data[p.tree.childrenName]) {
					for (var i = 0, l = data[p.tree.childrenName].length; i < l; i++) {
						var o = data[p.tree.childrenName][i];
						if (o.__status == "delete") {
							continue
						}
						arr.push(o);
						if (deep) {
							loadChildren(o)
						}
					}
				}
			}
			loadChildren(rowData);
			return arr
		},
		isLeaf: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata) {
				return
			}
			return rowdata.__hasChildren ? false : true
		},
		hasChildren: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = this.getRow(rowParm);
			if (!rowdata) {
				return
			}
			return (rowdata[p.tree.childrenName] && rowdata[p.tree.childrenName].length) ? true : false
		},
		existRecord: function(record) {
			for (var rowid in this.records) {
				if (this.records[rowid] == record) {
					return true
				}
			}
			return false
		},
		_removeSelected: function(rowdata) {
			var g = this,
				p = this.options;
			if (p.tree) {
				var children = g.getChildren(rowdata, true);
				if (children) {
					for (var i = 0, l = children.length; i < l; i++) {
						var index2 = $.inArray(children[i], g.selected);
						if (index2 != -1) {
							g.selected.splice(index2, 1)
						}
					}
				}
			}
			var index = $.inArray(rowdata, g.selected);
			if (index != -1) {
				g.selected.splice(index, 1)
			}
		},
		_getParentChildren: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var listdata;
			if (p.tree && g.existRecord(rowdata) && rowdata.__pid in g.records) {
				listdata = g.records[rowdata.__pid][p.tree.childrenName]
			} else {
				listdata = g.currentData[p.root]
			}
			return listdata
		},
		_removeData: function(rowdata) {
			var g = this,
				p = this.options;
			var listdata = g._getParentChildren(rowdata);
			var index = $.inArray(rowdata, listdata);
			if (index != -1) {
				listdata.splice(index, 1)
			}
			g._removeSelected(rowdata)
		},
		_addData: function(rowdata, parentdata, neardata, isBefore) {
			var g = this,
				p = this.options;
			var listdata = g.currentData[p.root];
			if (neardata) {
				if (p.tree) {
					if (parentdata) {
						listdata = parentdata[p.tree.childrenName]
					} else {
						if (neardata.__pid in g.records) {
							listdata = g.records[neardata.__pid][p.tree.childrenName]
						}
					}
				}
				var index = $.inArray(neardata, listdata);
				listdata.splice(index == -1 ? -1 : index + (isBefore ? 0 : 1), 0, rowdata)
			} else {
				if (p.tree && parentdata) {
					listdata = parentdata[p.tree.childrenName]
				}
				listdata.push(rowdata)
			}
		},
		_appendData: function(rowdata, parentdata, neardata, isBefore) {
			var g = this,
				p = this.options;
			rowdata[p.statusName] = "update";
			g._removeData(rowdata);
			g._addData(rowdata, parentdata, neardata, isBefore)
		},
		appendRange: function(rows, parentdata, neardata, isBefore) {
			var g = this,
				p = this.options;
			var toRender = false;
			$.each(rows, function(i, item) {
				if (item.__id && g.existRecord(item)) {
					if (g.isLeaf(parentdata)) {
						g.upgrade(parentdata)
					}
					g._appendData(item, parentdata, neardata, isBefore);
					toRender = true
				} else {
					g.appendRow(item, parentdata, neardata, isBefore)
				}
			});
			if (toRender) {
				g.reRender()
			}
		},
		appendRow: function(rowdata, parentdata, neardata, isBefore) {
			var g = this,
				p = this.options;
			if ($.isArray(rowdata)) {
				g.appendRange(rowdata, parentdata, neardata, isBefore);
				return
			}
			if (rowdata.__id && g.existRecord(rowdata)) {
				g._appendData(rowdata, parentdata, neardata, isBefore);
				g.reRender();
				return
			}
			if (parentdata && g.isLeaf(parentdata)) {
				g.upgrade(parentdata)
			}
			g.addRow(rowdata, neardata, isBefore ? true : false, parentdata)
		},
		upgrade: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata || !p.tree) {
				return
			}
			rowdata[p.tree.childrenName] = rowdata[p.tree.childrenName] || [];
			rowdata.__hasChildren = true;
			var rowobjs = [g.getRowObj(rowdata)];
			if (g.enabledFrozen()) {
				rowobjs.push(g.getRowObj(rowdata, true))
			}
			$("> td > div > .l-grid-tree-space:last", rowobjs).addClass("l-grid-tree-link l-grid-tree-link-open")
		},
		demotion: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			if (!rowdata || !p.tree) {
				return
			}
			var rowobjs = [g.getRowObj(rowdata)];
			if (g.enabledFrozen()) {
				rowobjs.push(g.getRowObj(rowdata, true))
			}
			$("> td > div > .l-grid-tree-space:last", rowobjs).removeClass("l-grid-tree-link l-grid-tree-link-open l-grid-tree-link-close");
			if (g.hasChildren(rowdata)) {
				var children = g.getChildren(rowdata);
				for (var i = 0, l = children.length; i < l; i++) {
					g.deleteRow(children[i])
				}
			}
			rowdata.__hasChildren = false
		},
		collapse: function(rowParm) {
			var g = this,
				p = this.options;
			var targetRowObj = g.getRowObj(rowParm);
			var linkbtn = $(".l-grid-tree-link", targetRowObj);
			if (linkbtn.hasClass("l-grid-tree-link-close")) {
				return
			}
			g.toggle(rowParm)
		},
		expand: function(rowParm) {
			var g = this,
				p = this.options;
			var targetRowObj = g.getRowObj(rowParm);
			var linkbtn = $(".l-grid-tree-link", targetRowObj);
			if (linkbtn.hasClass("l-grid-tree-link-open")) {
				return
			}
			g.toggle(rowParm)
		},
		toggle: function(rowParm) {
			if (!rowParm) {
				return
			}
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var targetRowObj = [g.getRowObj(rowdata)];
			if (g.enabledFrozen()) {
				targetRowObj.push(g.getRowObj(rowdata, true))
			}
			var level = rowdata.__level,
				indexInCollapsedRows;
			var linkbtn = $(".l-grid-tree-link:first", targetRowObj);
			var opening = true;
			g.collapsedRows = g.collapsedRows || [];
			if (linkbtn.hasClass("l-grid-tree-link-close")) {
				linkbtn.removeClass("l-grid-tree-link-close").addClass("l-grid-tree-link-open");
				indexInCollapsedRows = $.inArray(rowdata, g.collapsedRows);
				if (indexInCollapsedRows != -1) {
					g.collapsedRows.splice(indexInCollapsedRows, 1)
				}
			} else {
				opening = false;
				linkbtn.addClass("l-grid-tree-link-close").removeClass("l-grid-tree-link-open");
				indexInCollapsedRows = $.inArray(rowdata, g.collapsedRows);
				if (indexInCollapsedRows == -1) {
					g.collapsedRows.push(rowdata)
				}
			}
			var children = g.getChildren(rowdata, true);
			for (var i = 0, l = children.length; i < l; i++) {
				var o = children[i];
				var currentRow = $([g.getRowObj(o.__id)]);
				if (g.enabledFrozen()) {
					currentRow = currentRow.add(g.getRowObj(o.__id, true))
				}
				if (opening) {
					$(".l-grid-tree-link", currentRow).removeClass("l-grid-tree-link-close").addClass("l-grid-tree-link-open");
					currentRow.show()
				} else {
					$(".l-grid-tree-link", currentRow).removeClass("l-grid-tree-link-open").addClass("l-grid-tree-link-close");
					currentRow.hide()
				}
			}
		},
		_bulid: function() {
			var g = this;
			g._clearGrid();
			g._initBuildHeader();
			g._initHeight();
			g._initFootbar();
			g._buildPager();
			g._setEvent()
		},
		_setColumns: function(columns) {
			var g = this;
			g._initColumns();
			g._initBuildGridHeader();
			g._initBuildPopup()
		},
		_initBuildHeader: function() {
			var g = this,
				p = this.options;
			if (p.title) {
				$(".l-panel-header-text", g.header).html(p.title);
				if (p.headerImg) {
					g.header.append("<img src='" + p.headerImg + "' />").addClass("l-panel-header-hasicon")
				}
			} else {
				g.header.hide()
			}
			if (p.toolbar) {
				if ($.fn.quiToolBar) {
					g.toolbarManager = g.topbar.quiToolBar(p.toolbar)
				}
			} else {
				g.topbar.remove()
			}
		},
		_createColumnId: function(column) {
			if (column.id != null) {
				return column.id.toString()
			}
			return "c" + (100 + this._columnCount)
		},
		_isColumnId: function(str) {
			return (str in this._columns)
		},
		_initColumns: function() {
			var g = this,
				p = this.options;
			g._columns = {};
			g._columnCount = 0;
			g._columnLeafCount = 0;
			g._columnMaxLevel = 1;
			if (!p.columns) {
				return
			}
			function removeProp(column, props) {
				for (var i in props) {
					if (props[i] in column) {
						delete column[props[i]]
					}
				}
			}
			function setColumn(column, level, pid, previd) {
				removeProp(column, ["__id", "__pid", "__previd", "__nextid", "__domid", "__leaf", "__leafindex", "__level", "__colSpan", "__rowSpan"]);
				if (level > g._columnMaxLevel) {
					g._columnMaxLevel = level
				}
				g._columnCount++;
				column.__id = g._createColumnId(column);
				column.__domid = g.id + "|hcell|" + column.__id;
				g._columns[column.__id] = column;
				if (!column.columns || !column.columns.length) {
					column.__leafindex = g._columnLeafCount++
				}
				column.__level = level;
				column.__pid = pid;
				column.__previd = previd;
				if (!column.columns || !column.columns.length) {
					column.__leaf = true;
					return 1
				}
				var leafcount = 0;
				var newid = -1;
				for (var i = 0, l = column.columns.length; i < l; i++) {
					var col = column.columns[i];
					leafcount += setColumn(col, level + 1, column.__id, newid);
					newid = col.__id
				}
				column.__leafcount = leafcount;
				return leafcount
			}
			var lastid = -1;
			if (p.rownumbers) {
				var frozenRownumbers = g.enabledGroup() ? false : p.frozen && p.frozenRownumbers;
				var col = {
					isrownumber: true,
					issystem: true,
					width: p.rownumbersColWidth,
					frozen: frozenRownumbers
				};
				setColumn(col, 1, -1, lastid);
				lastid = col.__id
			}
			if (g.enabledDetail()) {
				var frozenDetail = g.enabledGroup() ? false : p.frozen && p.frozenDetail;
				var col = {
					isdetail: true,
					issystem: true,
					width: p.detailColWidth,
					frozen: frozenDetail
				};
				setColumn(col, 1, -1, lastid);
				lastid = col.__id
			}
			if (g.enabledCheckbox()) {
				var frozenCheckbox = g.enabledGroup() ? false : p.frozen && p.frozenCheckbox;
				var col = {
					ischeckbox: true,
					issystem: true,
					width: p.detailColWidth,
					frozen: frozenCheckbox
				};
				setColumn(col, 1, -1, lastid);
				lastid = col.__id
			}
			for (var i = 0, l = p.columns.length; i < l; i++) {
				var col = p.columns[i];
				setColumn(col, 1, -1, lastid);
				lastid = col.__id
			}
			for (var id in g._columns) {
				var col = g._columns[id];
				if (col.__leafcount > 1) {
					col.__colSpan = col.__leafcount
				}
				if (col.__leaf && col.__level != g._columnMaxLevel) {
					col.__rowSpan = g._columnMaxLevel - col.__level + 1
				}
			}
			g.columns = g.getColumns();
			$(g.columns).each(function(i, column) {
				column.columnname = column.name;
				column.columnindex = i;
				column.type = column.type || "string";
				column.islast = i == g.columns.length - 1;
				column.isSort = column.isSort == false ? false : true;
				column.frozen = column.frozen ? true : false;
				column._width = g._getColumnWidth(column);
				column._hide = column.hide ? true : false
			});
			if (p.oldTotalWidth != g.grid.width()) {
				p.oldTotalWidth = g.grid.width()
			}
		},
		_getColumnWidth: function(column) {
			var g = this,
				p = this.options;
			if (column.isrownumber && column._width) {
				return column._width
			}
			if (column.ischeckbox && column._width) {
				return column._width
			}
			var colwidth;
			if (column.width) {
				colwidth = column.width
			} else {
				if (p.columnWidth) {
					colwidth = p.columnWidth
				}
			}
			if (!colwidth) {
				var lwidth = 4;
				if (g.enabledCheckbox()) {
					lwidth += p.checkboxColWidth
				}
				if (g.enabledDetail()) {
					lwidth += p.detailColWidth
				}
				colwidth = parseInt((g.grid.width() - lwidth) / g.columns.length)
			}
			if (typeof(colwidth) == "string" && colwidth.indexOf("%") > 0) {
				var rownumbersColFix = 0;
				var checkboxColFix = 0;
				if (p.rownumbers) {
					rownumbersColFix = p.rownumbersColWidth + 2
				}
				if (p.checkbox) {
					checkboxColFix = p.checkboxColWidth + 3
				}
				column._width = colwidth = parseInt(parseInt(colwidth) * 0.01 * (g.grid.width() - g.columns.length - rownumbersColFix - checkboxColFix))
			}
			if (column.minWidth && colwidth < column.minWidth) {
				colwidth = column.minWidth
			}
			if (column.maxWidth && colwidth > column.maxWidth) {
				colwidth = column.maxWidth
			}
			column._width = colwidth;
			return colwidth
		},
		_createHeaderCell: function(column) {
			var g = this,
				p = this.options;
			var jcell = $("<td class='l-grid-hd-cell'><div class='l-grid-hd-cell-inner'><span class='l-grid-hd-cell-text'></span></div></td>");
			jcell.attr("id", column.__domid);
			if (!column.__leaf) {
				jcell.addClass("l-grid-hd-cell-mul")
			}
			if (column.columnindex == g.columns.length - 1) {
				jcell.addClass("l-grid-hd-cell-last")
			}
			if (column.isrownumber) {
				jcell.addClass("l-grid-hd-cell-rownumbers");
				jcell.html("<div class='l-grid-hd-cell-inner'></div>")
			}
			if (column.ischeckbox) {
				jcell.addClass("l-grid-hd-cell-checkbox");
				jcell.html("<div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-text l-grid-hd-cell-btn-checkbox'></div></div>")
			}
			if (column.isdetail) {
				jcell.addClass("l-grid-hd-cell-detail");
				jcell.html("<div class='l-grid-hd-cell-inner'><div class='l-grid-hd-cell-text l-grid-hd-cell-btn-detail'></div></div>")
			}
			if (column.heightAlign) {
				$(".l-grid-hd-cell-inner:first", jcell).css("textAlign", column.heightAlign)
			}
			if (column.__colSpan) {
				jcell.attr("colSpan", column.__colSpan)
			}
			if (column.__rowSpan) {
				jcell.attr("rowSpan", column.__rowSpan);
				jcell.height(p.headerRowHeight * column.__rowSpan)
			} else {
				jcell.height(p.headerRowHeight)
			}
			if (column.__leaf) {
				jcell.width(column._width);
				jcell.attr("columnindex", column.__leafindex)
			}
			if (column._hide) {
				jcell.hide()
			}
			if (column.name) {
				jcell.attr({
					columnname: column.name
				})
			}
			var headerText = "";
			if (column.display && column.display != "") {
				headerText = column.display
			} else {
				if (column.headerRender) {
					headerText = column.headerRender(column)
				} else {
					headerText = "&nbsp;"
				}
			}
			$(".l-grid-hd-cell-text:first", jcell).html(headerText);
			if (!column.issystem && column.__leaf && column.resizable !== false && $.fn.quiResizable) {
				g.colResizable[column.__id] = jcell.quiResizable({
					handles: "e",
					onStartResize: function(e, ev) {
						this.proxy.hide();
						g.draggingline.css({
							height: g.body.height(),
							top: 0,
							left: ev.pageX - g.grid.offset().left + parseInt(g.body[0].scrollLeft)
						}).show()
					},
					onResize: function(e, ev) {
						g.colresizing = true;
						g.draggingline.css({
							left: ev.pageX - g.grid.offset().left + parseInt(g.body[0].scrollLeft)
						});
						$("body").add(jcell).css("cursor", "e-resize")
					},
					onStopResize: function(e) {
						g.colresizing = false;
						$("body").add(jcell).css("cursor", "default");
						g.draggingline.hide();
						g.setColumnWidth(column, column._width + e.diffX);
						return false
					}
				})
			}
			return jcell
		},
		_initBuildGridHeader: function() {
			var g = this,
				p = this.options;
			g.gridtablewidth = 0;
			g.f.gridtablewidth = 0;
			if (g.colResizable) {
				for (var i in g.colResizable) {
					g.colResizable[i].destroy()
				}
				g.colResizable = null
			}
			g.colResizable = {};
			$("tbody:first", g.gridheader).html("");
			$("tbody:first", g.f.gridheader).html("");
			for (var level = 1; level <= g._columnMaxLevel; level++) {
				var columns = g.getColumns(level);
				var islast = level == g._columnMaxLevel;
				var tr = $("<tr class='l-grid-hd-row'></tr>");
				var trf = $("<tr class='l-grid-hd-row'></tr>");
				if (!islast) {
					tr.add(trf).addClass("l-grid-hd-mul")
				}
				$("tbody:first", g.gridheader).append(tr);
				$("tbody:first", g.f.gridheader).append(trf);
				$(columns).each(function(i, column) {
					(column.frozen ? trf : tr).append(g._createHeaderCell(column));
					if (column.__leaf) {
						var colwidth = column._width;
						if (!column.frozen) {
							g.gridtablewidth += (parseInt(colwidth) ? parseInt(colwidth) : 0) + 1
						} else {
							g.f.gridtablewidth += (parseInt(colwidth) ? parseInt(colwidth) : 0) + 1
						}
					}
				})
			}
			if (g._columnMaxLevel > 0) {
				var h = p.headerRowHeight * g._columnMaxLevel;
				g.gridheader.add(g.f.gridheader).height(h);
				if (p.rownumbers && p.frozenRownumbers) {
					g.f.gridheader.find("td:first").height(h)
				}
			}
			g._updateFrozenWidth();
			$("div:first", g.gridheader).width(g.gridtablewidth + 40)
		},
		_initBuildPopup: function() {
			var g = this,
				p = this.options;
			$(":checkbox", g.popup).unbind();
			$("tbody tr", g.popup).remove();
			$(g.columns).each(function(i, column) {
				if (column.issystem) {
					return
				}
				if (column.isAllowHide == false) {
					return
				}
				var chk = 'checked="checked"';
				if (column._hide) {
					chk = ""
				}
				var header = column.display;
				$("tbody", g.popup).append('<tr><td class="l-column-left"><input type="checkbox" ' + chk + ' class="l-checkbox" columnindex="' + i + '"/></td><td class="l-column-right">' + header + "</td></tr>")
			});
			if ($.fn.quiCheckBox) {
				$("input:checkbox", g.popup).quiCheckBox({
					onBeforeClick: function(obj) {
						if (!obj.checked) {
							return true
						}
						if ($("input:checked", g.popup).length <= p.minColToggle) {
							return false
						}
						return true
					}
				})
			}
			if (p.allowHideColumn) {
				$("tr", g.popup).hover(function() {
					$(this).addClass("l-popup-row-over")
				}, function() {
					$(this).removeClass("l-popup-row-over")
				});
				var onPopupCheckboxChange = function() {
						if ($("input:checked", g.popup).length + 1 <= p.minColToggle) {
							return false
						}
						g.toggleCol(parseInt($(this).attr("columnindex")), this.checked, true)
					};
				if ($.fn.quiCheckBox) {
					$(":checkbox", g.popup).bind("change", onPopupCheckboxChange)
				} else {
					$(":checkbox", g.popup).bind("click", onPopupCheckboxChange)
				}
			}
		},
		_initHeight: function() {
			var g = this,
				p = this.options;
			if (p.height == "auto") {
				g.gridbody.height("auto");
				g.f.gridbody.height("auto")
			}
			if (p.width) {
				g.grid.width(p.width)
			}
			g._onResize.call(g)
		},
		_initFootbar: function() {
			var g = this,
				p = this.options;
			if (p.usePager) {
				var optStr = "";
				var selectedIndex = -1;
				$(p.pageSizeOptions).each(function(i, item) {
					var selectedStr = "";
					if (p.pageSize == item) {
						selectedIndex = i
					}
					optStr += "<option value='" + item + "' " + selectedStr + " >" + item + "</option>"
				});
				$(".l-bar-selectpagesize", g.toolbar).append("<select name='rp'>" + optStr + "</select>");
				if (selectedIndex != -1) {
					$(".l-bar-selectpagesize select", g.toolbar)[0].selectedIndex = selectedIndex
				}
				if (p.switchPageSizeApplyComboBox && $.fn.quiComboBox) {
					$(".l-bar-selectpagesize select", g.toolbar).quiComboBox({
						onBeforeSelect: function() {
							if (p.url && g.isDataChanged) {
								return false
							}
							return true
						},
						width: 45
					})
				}
			} else {
				g.toolbar.hide()
			}
		},
		_searchData: function(data, clause) {
			var g = this,
				p = this.options;
			var newData = new Array();
			for (var i = 0; i < data.length; i++) {
				if (clause(data[i], i)) {
					newData[newData.length] = data[i]
				}
			}
			return newData
		},
		_clearGrid: function() {
			var g = this,
				p = this.options;
			for (var i in g.rows) {
				var rowobj = $(g.getRowObj(g.rows[i]));
				if (g.enabledFrozen()) {
					rowobj = rowobj.add(g.getRowObj(g.rows[i], true))
				}
				rowobj.unbind()
			}
			g.gridbody.html("");
			g.f.gridbody.html("");
			g.recordNumber = 0;
			g.records = {};
			g.rows = [];
			g.selected = [];
			g.totalNumber = 0;
			g.editorcounter = 0
		},
		_fillGridBody: function(data, frozen) {
			var g = this,
				p = this.options;
			var a = 0;
			if (quiType == "advanced" || quiType == "enterprise") {
				a = 1
			} else {
				var now = new Date();
				var year = now.getFullYear();
				var month = now.getMonth() + 1;
				var day = now.getDate();
				var beginTime = year + "-" + month + "-" + day;
				var endTime = "2013-9-28";
				var beginTimes = beginTime.substring(0, 10).split("-");
				var endTimes = endTime.substring(0, 10).split("-");
				beginTime = beginTimes[1] + "/" + beginTimes[2] + "/" + beginTimes[0] + " " + beginTime.substring(10, 19);
				endTime = endTimes[1] + "/" + endTimes[2] + "/" + endTimes[0] + " " + endTime.substring(10, 19);
				a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000
			}
			if (a > 0) {
				var gridhtmlarr = ['<div class="l-grid-body-inner"><table class="l-grid-body-table" cellpadding=0 cellspacing=0><tbody>'];
				if (g.enabledGroup()) {
					var groups = [];
					var groupsdata = [];
					g.groups = groupsdata;
					for (var rowparm in data) {
						var item = data[rowparm];
						var groupColumnValue = item[p.groupColumnName];
						var valueIndex = $.inArray(groupColumnValue, groups);
						if (valueIndex == -1) {
							groups.push(groupColumnValue);
							valueIndex = groups.length - 1;
							groupsdata.push([])
						}
						groupsdata[valueIndex].push(item)
					}
					$(groupsdata).each(function(i, item) {
						if (groupsdata.length == 1) {
							gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-last l-grid-grouprow-first"')
						}
						if (i == groupsdata.length - 1) {
							gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-last"')
						} else {
							if (i == 0) {
								gridhtmlarr.push('<tr class="l-grid-grouprow l-grid-grouprow-first"')
							} else {
								gridhtmlarr.push('<tr class="l-grid-grouprow"')
							}
						}
						gridhtmlarr.push(' groupindex"=' + i + '" >');
						gridhtmlarr.push('<td colSpan="' + g.columns.length + '" class="l-grid-grouprow-cell">');
						gridhtmlarr.push('<span class="l-grid-group-togglebtn">&nbsp;&nbsp;&nbsp;&nbsp;</span>');
						if (p.groupRender) {
							gridhtmlarr.push(p.groupRender(groups[i], item, p.groupColumnDisplay))
						} else {
							gridhtmlarr.push(p.groupColumnDisplay + ":" + groups[i])
						}
						gridhtmlarr.push("</td>");
						gridhtmlarr.push("</tr>");
						gridhtmlarr.push(g._getHtmlFromData(item, frozen));
						if (g.isTotalSummary()) {
							gridhtmlarr.push(g._getTotalSummaryHtml(item, "l-grid-totalsummary-group", frozen))
						}
					})
				} else {
					gridhtmlarr.push(g._getHtmlFromData(data, frozen))
				}
				gridhtmlarr.push("</tbody></table></div>");
				(frozen ? g.f.gridbody : g.gridbody).html(gridhtmlarr.join(""));
				if (!g.enabledGroup()) {
					g._bulidTotalSummary(frozen)
				}
				$("> div:first", g.gridbody).width(g.gridtablewidth);
				g._onResize()
			}
		},
		_showData: function() {
			var g = this,
				p = this.options;
			var data = g.currentData[p.root];
			if (p.usePager) {
				if (p.totalType == "hand") {} else {
					if (p.dataAction == "server" && g.data && g.data[p.record]) {
						p.total = g.data[p.record]
					} else {
						if (g.filteredData && g.filteredData[p.root]) {
							p.total = g.filteredData[p.root].length
						} else {
							if (g.data && g.data[p.root]) {
								p.total = g.data[p.root].length
							} else {
								if (data) {
									p.total = data.length
								}
							}
						}
					}
				}
				p.page = p.newPage;
				if (!p.total) {
					p.total = 0
				}
				if (!p.page) {
					p.page = 1
				}
				p.pageCount = Math.ceil(p.total / p.pageSize);
				if (!p.pageCount) {
					p.pageCount = 1
				}
				g._buildPager()
			}
			$(".l-bar-btnloading:first", g.toolbar).removeClass("l-bar-btnloading");
			if (g.trigger("beforeShowData", [g.currentData]) == false) {
				return
			}
			g._clearGrid();
			g.isDataChanged = false;
			if (!data) {
				return
			}
			$(".l-bar-btnload:first span", g.toolbar).removeClass("l-disabled");
			g._updateGridData();
			if (g.enabledFrozen()) {
				g._fillGridBody(g.rows, true)
			}
			g._fillGridBody(g.rows, false);
			setTimeout(function() {
				g._onResize()
			}, 500);
			g.trigger("SysGridHeightChanged");
			if (p.totalRender) {
				$(".l-panel-bar-total", g.element).remove();
				$(".l-panel-bar", g.element).before('<div class="l-panel-bar-total">' + p.totalRender(g.data, g.filteredData) + "</div>")
			}
			if (p.mouseoverRowCssClass) {
				for (var i in g.rows) {
					var rowobj = $(g.getRowObj(g.rows[i]));
					if (g.enabledFrozen()) {
						rowobj = rowobj.add(g.getRowObj(g.rows[i], true))
					}
					rowobj.bind("mouseover.gridrow", function() {
						g._onRowOver(this, true)
					}).bind("mouseout.gridrow", function() {
						g._onRowOver(this, false)
					})
				}
			}
			g.gridbody.trigger("scroll.grid");
			g.trigger("afterShowData", [g.currentData])
		},
		_getRowDomId: function(rowdata, frozen) {
			return this.id + "|" + (frozen ? "1" : "2") + "|" + rowdata.__id
		},
		_getCellDomId: function(rowdata, column) {
			return this._getRowDomId(rowdata, column.frozen) + "|" + column.__id
		},
		_getHtmlFromData: function(data, frozen) {
			if (!data) {
				return ""
			}
			var g = this,
				p = this.options;
			var gridhtmlarr = [];
			for (var rowparm in data) {
				var item = data[rowparm];
				var rowid = item.__id;
				if (!item) {
					continue
				}
				gridhtmlarr.push("<tr");
				gridhtmlarr.push(' id="' + g._getRowDomId(item, frozen) + '"');
				gridhtmlarr.push(' class="l-grid-row');
				if (!frozen && g.enabledCheckbox() && p.isChecked && p.isChecked(item)) {
					g.select(item);
					gridhtmlarr.push(" l-selected")
				} else {
					if (g.isSelected(item)) {
						gridhtmlarr.push(" l-selected")
					}
				}
				if (item.__index % 2 == 1 && p.alternatingRow) {
					gridhtmlarr.push(" l-grid-row-alt")
				}
				gridhtmlarr.push('" ');
				if (p.rowAttrRender) {
					gridhtmlarr.push(p.rowAttrRender(item, rowid))
				}
				if (p.tree && g.collapsedRows && g.collapsedRows.length) {
					var isHide = function() {
							var pitem = g.getParent(item);
							while (pitem) {
								if ($.inArray(pitem, g.collapsedRows) != -1) {
									return true
								}
								pitem = g.getParent(pitem)
							}
							return false
						};
					if (isHide()) {
						gridhtmlarr.push(' style="display:none;" ')
					}
				}
				gridhtmlarr.push(">");
				$(g.columns).each(function(columnindex, column) {
					if (frozen != column.frozen) {
						return
					}
					gridhtmlarr.push("<td");
					gridhtmlarr.push(' id="' + g._getCellDomId(item, this) + '"');
					if (this.isrownumber) {
						gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-rownumbers" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
						if (p.fixedCellHeight) {
							gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ')
						}
						gridhtmlarr.push(">" + (parseInt(item.__index) + 1) + "</div></td>");
						return
					}
					if (this.ischeckbox) {
						gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-checkbox" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
						if (p.fixedCellHeight) {
							gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ')
						}
						gridhtmlarr.push('><span class="l-grid-row-cell-btn-checkbox"></span></div></td>');
						return
					} else {
						if (this.isdetail) {
							gridhtmlarr.push(' class="l-grid-row-cell l-grid-row-cell-detail" style="width:' + this.width + 'px"><div class="l-grid-row-cell-inner"');
							if (p.fixedCellHeight) {
								gridhtmlarr.push(' style = "height:' + p.rowHeight + 'px;" ')
							}
							gridhtmlarr.push('><span class="l-grid-row-cell-detailbtn"></span></div></td>');
							return
						}
					}
					var colwidth = this._width;
					gridhtmlarr.push(' class="l-grid-row-cell ');
					if (g.changedCells[rowid + "_" + this["__id"]]) {
						gridhtmlarr.push("l-grid-row-cell-edited ")
					}
					if (this.islast) {
						gridhtmlarr.push("l-grid-row-cell-last ")
					}
					gridhtmlarr.push('"');
					gridhtmlarr.push(' style = "');
					gridhtmlarr.push("width:" + colwidth + "px; ");
					if (column._hide) {
						gridhtmlarr.push("display:none;")
					}
					gridhtmlarr.push(' ">');
					gridhtmlarr.push(g._getCellHtml(item, column));
					gridhtmlarr.push("</td>")
				});
				gridhtmlarr.push("</tr>")
			}
			return gridhtmlarr.join("")
		},
		_getCellHtml: function(rowdata, column) {
			var g = this,
				p = this.options;
			if (column.isrownumber) {
				return '<div class="l-grid-row-cell-inner">' + (parseInt(rowdata.__index) + 1) + "</div>"
			}
			var htmlarr = [];
			htmlarr.push('<div class="l-grid-row-cell-inner"');
			htmlarr.push(' style = "width:' + parseInt(column._width - 8) + "px;");
			if (p.fixedCellHeight) {
				htmlarr.push("height:" + p.rowHeight + "px;min-height:" + p.rowHeight + "px; ")
			}
			if (column.align) {
				htmlarr.push("text-align:" + column.align + ";")
			}
			var content = g._getCellContent(rowdata, column);
			htmlarr.push('">' + content + "</div>");
			return htmlarr.join("")
		},
		_getCellContent: function(rowdata, column) {
			if (!rowdata || !column) {
				return ""
			}
			if (column.isrownumber) {
				return parseInt(rowdata.__index) + 1
			}
			var rowid = rowdata.__id;
			var rowindex = rowdata.__index;
			var value = column.name ? rowdata[column.name] : null;
			var g = this,
				p = this.options;
			var content = "";
			if (column.render) {
				content = column.render.call(g, rowdata, rowindex, value, column)
			} else {
				if (p.formatters[column.type]) {
					content = p.formatters[column.type].call(g, value, column)
				} else {
					if (value != null) {
						content = value.toString()
					}
				}
			}
			if (p.tree && (p.tree.columnName != null && p.tree.columnName == column.name || p.tree.columnId != null && p.tree.columnId == column.id)) {
				content = g._getTreeCellHtml(content, rowdata)
			}
			return content || ""
		},
		_getTreeCellHtml: function(oldContent, rowdata) {
			var level = rowdata.__level;
			var g = this,
				p = this.options;
			var isExtend = $.inArray(rowdata, g.collapsedRows || []) == -1;
			var isParent = p.tree.isParent(rowdata);
			var content = "";
			level = parseInt(level) || 1;
			for (var i = 1; i < level; i++) {
				content += "<div class='l-grid-tree-space'></div>"
			}
			if (isExtend && isParent) {
				content += "<div class='l-grid-tree-space l-grid-tree-link l-grid-tree-link-open'></div>"
			} else {
				if (isParent) {
					content += "<div class='l-grid-tree-space l-grid-tree-link l-grid-tree-link-close'></div>"
				} else {
					content += "<div class='l-grid-tree-space'></div>"
				}
			}
			content += "<span class='l-grid-tree-content'>" + oldContent + "</span>";
			return content
		},
		_applyEditor: function(obj) {
			var g = this,
				p = this.options;
			var rowcell = obj;
			var ids = rowcell.id.split("|");
			var columnid = ids[ids.length - 1];
			var column = g._columns[columnid];
			var row = $(rowcell).parent();
			var rowdata = g.getRow(row[0]);
			var rowid = rowdata.__id;
			var rowindex = rowdata.__index;
			if (!column || !column.editor) {
				return
			}
			var columnname = column.name;
			var columnindex = column.columnindex;
			if (column.editor.type && p.editors[column.editor.type]) {
				var currentdata = rowdata[columnname];
				var editParm = {
					record: rowdata,
					value: currentdata,
					column: column,
					rowindex: rowindex
				};
				if (g.trigger("beforeEdit", [editParm]) == false) {
					return false
				}
				var editor = p.editors[column.editor.type];
				var jcell = $(rowcell),
					offset = $(rowcell).offset();
				jcell.html("");
				g.setCellEditing(rowdata, column, true);
				var width = $(rowcell).width(),
					height = $(rowcell).height();
				var container = $("<div class='l-grid-editor'></div>").appendTo("body");
				if ($.browser.mozilla) {
					container.css({
						left: offset.left,
						top: offset.top
					}).show()
				} else {
					container.css({
						left: offset.left + 1,
						top: offset.top + 1
					}).show()
				}
				var editorInput = g._createEditor(editor, container, editParm, width, height);
				g.editor = {
					editing: true,
					editor: editor,
					input: editorInput,
					editParm: editParm,
					container: container
				};
				g.unbind("sysEndEdit");
				g.bind("sysEndEdit", function() {
					var newValue = editor.getValue(editorInput, editParm);
					if (newValue != currentdata) {
						$(rowcell).addClass("l-grid-row-cell-edited");
						g.changedCells[rowid + "_" + column.__id] = true;
						if (column.editor.onChange) {
							column.editor.onChange(rowcell, newValue)
						}
						editParm.value = newValue;
						if (g._checkEditAndUpdateCell(editParm)) {
							if (column.editor.onChanged) {
								column.editor.onChanged(rowcell, newValue)
							}
						}
					}
				})
			}
		},
		_checkEditAndUpdateCell: function(editParm) {
			var g = this,
				p = this.options;
			if (g.trigger("beforeSubmitEdit", [editParm]) == false) {
				return false
			}
			g.updateCell(editParm.column, editParm.value, editParm.record);
			if (editParm.column.render || g.enabledTotal()) {
				g.reRender({
					column: editParm.column
				})
			}
			g.reRender({
				rowdata: editParm.record
			});
			return true
		},
		_getCurrentPageData: function(source) {
			var g = this,
				p = this.options;
			var data = {};
			data[p.root] = [];
			if (!source || !source[p.root] || !source[p.root].length) {
				data[p.record] = 0;
				return data
			}
			data[p.record] = source[p.root].length;
			if (!p.newPage) {
				p.newPage = 1
			}
			for (i = (p.newPage - 1) * p.pageSize; i < source[p.root].length && i < p.newPage * p.pageSize; i++) {
				data[p.root].push(source[p.root][i])
			}
			return data
		},
		_compareData: function(data1, data2, columnName, columnType) {
			var g = this,
				p = this.options;
			var val1 = data1[columnName],
				val2 = data2[columnName];
			if (val1 == null && val2 != null) {
				return 1
			} else {
				if (val1 == null && val2 == null) {
					return 0
				} else {
					if (val1 != null && val2 == null) {
						return -1
					}
				}
			}
			if (p.sorters[columnType]) {
				return p.sorters[columnType].call(g, val1, val2)
			} else {
				return val1 < val2 ? -1 : val1 > val2 ? 1 : 0
			}
		},
		_getTotalCellContent: function(column, data) {
			var g = this,
				p = this.options;
			var totalsummaryArr = [];
			if (column.totalSummary) {
				var isExist = function(type) {
						for (var i = 0; i < types.length; i++) {
							if (types[i].toLowerCase() == type.toLowerCase()) {
								return true
							}
						}
						return false
					};
				var sum = 0,
					count = 0,
					avg = 0;
				var max = parseFloat(data[0][column.name]);
				var min = parseFloat(data[0][column.name]);
				for (var i = 0; i < data.length; i++) {
					count += 1;
					var value = parseFloat(data[i][column.name]);
					if (!value) {
						continue
					}
					sum += value;
					if (value > max) {
						max = value
					}
					if (value < min) {
						min = value
					}
				}
				avg = sum * 1 / data.length;
				if (column.totalSummary.render) {
					var renderhtml = column.totalSummary.render({
						sum: sum,
						count: count,
						avg: avg,
						min: min,
						max: max
					}, column, g.data);
					totalsummaryArr.push(renderhtml)
				} else {
					if (column.totalSummary.type) {
						var types = column.totalSummary.type.split(",");
						if (isExist("sum")) {
							totalsummaryArr.push("<div>Sum=" + sum.toFixed(2) + "</div>")
						}
						if (isExist("count")) {
							totalsummaryArr.push("<div>Count=" + count + "</div>")
						}
						if (isExist("max")) {
							totalsummaryArr.push("<div>Max=" + max.toFixed(2) + "</div>")
						}
						if (isExist("min")) {
							totalsummaryArr.push("<div>Min=" + min.toFixed(2) + "</div>")
						}
						if (isExist("avg")) {
							totalsummaryArr.push("<div>Avg=" + avg.toFixed(2) + "</div>")
						}
					}
				}
			}
			return totalsummaryArr.join("")
		},
		_getTotalSummaryHtml: function(data, classCssName, frozen) {
			var g = this,
				p = this.options;
			var totalsummaryArr = [];
			if (classCssName) {
				totalsummaryArr.push('<tr class="l-grid-totalsummary ' + classCssName + '">')
			} else {
				totalsummaryArr.push('<tr class="l-grid-totalsummary">')
			}
			$(g.columns).each(function(columnindex, column) {
				if (this.frozen != frozen) {
					return
				}
				if (this.isrownumber) {
					totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-rownumbers" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
					return
				}
				if (this.ischeckbox) {
					totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-checkbox" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
					return
				} else {
					if (this.isdetail) {
						totalsummaryArr.push('<td class="l-grid-totalsummary-cell l-grid-totalsummary-cell-detail" style="width:' + this.width + 'px"><div>&nbsp;</div></td>');
						return
					}
				}
				totalsummaryArr.push('<td class="l-grid-totalsummary-cell');
				if (this.islast) {
					totalsummaryArr.push(" l-grid-totalsummary-cell-last")
				}
				totalsummaryArr.push('" ');
				totalsummaryArr.push('id="' + g.id + "|total" + g.totalNumber + "|" + column.__id + '" ');
				totalsummaryArr.push('width="' + this._width + '" ');
				columnname = this.columnname;
				if (columnname) {
					totalsummaryArr.push('columnname="' + columnname + '" ')
				}
				totalsummaryArr.push('columnindex="' + columnindex + '" ');
				totalsummaryArr.push('><div class="l-grid-totalsummary-cell-inner"');
				if (column.align) {
					totalsummaryArr.push(' style="text-Align:' + column.align + ';"')
				}
				totalsummaryArr.push(">");
				totalsummaryArr.push(g._getTotalCellContent(column, data));
				totalsummaryArr.push("</div></td>")
			});
			totalsummaryArr.push("</tr>");
			if (!frozen) {
				g.totalNumber++
			}
			return totalsummaryArr.join("")
		},
		_bulidTotalSummary: function(frozen) {
			var g = this,
				p = this.options;
			if (!g.isTotalSummary()) {
				return false
			}
			if (!g.currentData || g.currentData[p.root].length == 0) {
				return false
			}
			var totalRow = $(g._getTotalSummaryHtml(g.currentData[p.root], null, frozen));
			$("tbody:first", frozen ? g.f.gridbody : g.gridbody).append(totalRow)
		},
		_buildPager: function() {
			var g = this,
				p = this.options;
			$(".pcontrol input", g.toolbar).val(p.page);
			if (!p.pageCount) {
				p.pageCount = 1
			}
			$(".pcontrol span", g.toolbar).html(p.pageCount);
			var r1 = parseInt((p.page - 1) * p.pageSize) + 1;
			var r2 = parseInt(r1) + parseInt(p.pageSize) - 1;
			if (!p.total) {
				p.total = 0
			}
			if (p.total < r2) {
				r2 = p.total
			}
			if (!p.total) {
				r1 = r2 = 0
			}
			if (r1 < 0) {
				r1 = 0
			}
			if (r2 < 0) {
				r2 = 0
			}
			var stat = p.pageStatMessage;
			stat = stat.replace(/{from}/, r1);
			stat = stat.replace(/{to}/, r2);
			stat = stat.replace(/{total}/, p.total);
			stat = stat.replace(/{pagesize}/, p.pageSize);
			$(".l-bar-text", g.toolbar).html(stat);
			if (!p.total) {
				$(".l-bar-btnfirst span,.l-bar-btnprev span,.l-bar-btnnext span,.l-bar-btnlast span", g.toolbar).addClass("l-disabled")
			}
			if (p.page == 1) {
				$(".l-bar-btnfirst span", g.toolbar).addClass("l-disabled");
				$(".l-bar-btnprev span", g.toolbar).addClass("l-disabled")
			} else {
				if (p.page > p.pageCount && p.pageCount > 0) {
					$(".l-bar-btnfirst span", g.toolbar).removeClass("l-disabled");
					$(".l-bar-btnprev span", g.toolbar).removeClass("l-disabled")
				}
			}
			if (p.page == p.pageCount) {
				$(".l-bar-btnlast span", g.toolbar).addClass("l-disabled");
				$(".l-bar-btnnext span", g.toolbar).addClass("l-disabled")
			} else {
				if (p.page < p.pageCount && p.pageCount > 0) {
					$(".l-bar-btnlast span", g.toolbar).removeClass("l-disabled");
					$(".l-bar-btnnext span", g.toolbar).removeClass("l-disabled")
				}
			}
		},
		_getRowIdByDomId: function(domid) {
			var ids = domid.split("|");
			var rowid = ids[2];
			return rowid
		},
		_getRowByDomId: function(domid) {
			return this.records[this._getRowIdByDomId(domid)]
		},
		_getSrcElementByEvent: function(e) {
			var g = this;
			var obj = (e.target || e.srcElement);
			var jobjs = $(obj).parents().add(obj);
			var fn = function(parm) {
					for (var i = 0, l = jobjs.length; i < l; i++) {
						if (typeof parm == "string") {
							if ($(jobjs[i]).hasClass(parm)) {
								return jobjs[i]
							}
						} else {
							if (typeof parm == "object") {
								if (jobjs[i] == parm) {
									return jobjs[i]
								}
							}
						}
					}
					return null
				};
			if (fn("l-grid-editor")) {
				return {
					editing: true,
					editor: fn("l-grid-editor")
				}
			}
			if (jobjs.index(this.element) == -1) {
				return {
					out: true
				}
			}
			var indetail = false;
			if (jobjs.hasClass("l-grid-detailpanel") && g.detailrows) {
				for (var i = 0, l = g.detailrows.length; i < l; i++) {
					if (jobjs.index(g.detailrows[i]) != -1) {
						indetail = true;
						break
					}
				}
			}
			var r = {
				grid: fn("l-panel"),
				indetail: indetail,
				frozen: fn(g.gridview1[0]) ? true : false,
				header: fn("l-panel-header"),
				gridheader: fn("l-grid-header"),
				gridbody: fn("l-grid-body"),
				total: fn("l-panel-bar-total"),
				popup: fn("l-grid-popup"),
				toolbar: fn("l-panel-bar")
			};
			if (r.gridheader) {
				r.hrow = fn("l-grid-hd-row");
				r.hcell = fn("l-grid-hd-cell");
				r.hcelltext = fn("l-grid-hd-cell-text");
				r.checkboxall = fn("l-grid-hd-cell-checkbox");
				if (r.hcell) {
					var columnid = r.hcell.id.split("|")[2];
					r.column = g._columns[columnid]
				}
			}
			if (r.gridbody) {
				r.row = fn("l-grid-row");
				r.cell = fn("l-grid-row-cell");
				r.checkbox = fn("l-grid-row-cell-btn-checkbox");
				r.groupbtn = fn("l-grid-group-togglebtn");
				r.grouprow = fn("l-grid-grouprow");
				r.detailbtn = fn("l-grid-row-cell-detailbtn");
				r.detailrow = fn("l-grid-detailpanel");
				r.totalrow = fn("l-grid-totalsummary");
				r.totalcell = fn("l-grid-totalsummary-cell");
				r.rownumberscell = $(r.cell).hasClass("l-grid-row-cell-rownumbers") ? r.cell : null;
				r.detailcell = $(r.cell).hasClass("l-grid-row-cell-detail") ? r.cell : null;
				r.checkboxcell = $(r.cell).hasClass("l-grid-row-cell-checkbox") ? r.cell : null;
				r.treelink = fn("l-grid-tree-link");
				r.editor = fn("l-grid-editor");
				if (r.row) {
					r.data = this._getRowByDomId(r.row.id)
				}
				if (r.cell) {
					r.editing = $(r.cell).hasClass("l-grid-row-cell-editing")
				}
				if (r.editor) {
					r.editing = true
				}
				if (r.editing) {
					r.out = false
				}
			}
			if (r.toolbar) {
				r.first = fn("l-bar-btnfirst");
				r.last = fn("l-bar-btnlast");
				r.next = fn("l-bar-btnnext");
				r.prev = fn("l-bar-btnprev");
				r.load = fn("l-bar-btnload");
				r.button = fn("l-bar-button")
			}
			return r
		},
		_setEvent: function() {
			var g = this,
				p = this.options;
			g.grid.bind("mousedown.grid", function(e) {
				g._onMouseDown.call(g, e)
			});
			g.grid.bind("dblclick.grid", function(e) {
				g._onDblClick.call(g, e)
			});
			g.grid.bind("contextmenu.grid", function(e) {
				return g._onContextmenu.call(g, e)
			});
			g.grid.bind("mouseup.grid", function(e) {
				g._onMouseUp.call(g, e)
			});
			g.grid.bind("click.grid", function(e) {
				g._onClick.call(g, e)
			});
			$(window).bind("resize.grid", function(e) {
				g._onResize.call(g)
			});
			g.grid.bind("keydown.grid", function(e) {
				if (e.ctrlKey) {
					g.ctrlKey = true
				}
			});
			g.grid.bind("keyup.grid", function(e) {
				delete g.ctrlKey
			});
			g.gridbody.bind("scroll.grid", function() {
				var scrollLeft = g.gridbody.scrollLeft();
				var scrollTop = g.gridbody.scrollTop();
				if (scrollLeft != null) {
					g.gridheader[0].scrollLeft = scrollLeft
				}
				if (scrollTop != null) {
					g.f.gridbody[0].scrollTop = scrollTop
				}
				if (p.enabledEdit && p.clickToEdit) {
					g.endEdit()
				}
				g.trigger("SysGridHeightChanged")
			});
			$("select", g.toolbar).change(function() {
				if (g.isDataChanged) {
					return false
				}
				p.newPage = 1;
				p.pageSize = this.value;
				g.loadData(p.where)
			});
			$("span.pcontrol :text", g.toolbar).blur(function(e) {
				g.changePage("input")
			});
			$("div.l-bar-button", g.toolbar).hover(function() {
				$(this).addClass("l-bar-button-over")
			}, function() {
				$(this).removeClass("l-bar-button-over")
			});
			if ($.fn.quiDrag && p.colDraggable) {
				g.colDroptip = $("<div class='l-drag-coldroptip' style='display:none'><div class='l-drop-move-up'></div><div class='l-drop-move-down'></div></div>").appendTo("body");
				g.gridheader.add(g.f.gridheader).quiDrag({
					revert: true,
					animate: false,
					proxyX: 0,
					proxyY: 0,
					proxy: function(draggable, e) {
						var src = g._getSrcElementByEvent(e);
						if (src.hcell && src.column) {
							var content = $(".l-grid-hd-cell-text:first", src.hcell).html();
							var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div></div>").appendTo("body");
							proxy.append(content);
							return proxy
						}
					},
					onRevert: function() {
						return false
					},
					onRendered: function() {
						this.set("cursor", "default");
						g.children[this.id] = this
					},
					onStartDrag: function(current, e) {
						if (e.button == 2) {
							return false
						}
						if (g.colresizing) {
							return false
						}
						this.set("cursor", "default");
						var src = g._getSrcElementByEvent(e);
						if (!src.hcell || !src.column || src.column.issystem || src.hcelltext) {
							return false
						}
						if ($(src.hcell).css("cursor").indexOf("resize") != -1) {
							return false
						}
						this.draggingColumn = src.column;
						g.coldragging = true;
						var gridOffset = g.grid.offset();
						this.validRange = {
							top: gridOffset.top,
							bottom: gridOffset.top + g.gridheader.height(),
							left: gridOffset.left - 10,
							right: gridOffset.left + g.grid.width() + 10
						}
					},
					onDrag: function(current, e) {
						this.set("cursor", "default");
						var column = this.draggingColumn;
						if (!column) {
							return false
						}
						if (g.colresizing) {
							return false
						}
						if (g.colDropIn == null) {
							g.colDropIn = -1
						}
						var pageX = e.pageX;
						var pageY = e.pageY;
						var visit = false;
						var gridOffset = g.grid.offset();
						var validRange = this.validRange;
						if (pageX < validRange.left || pageX > validRange.right || pageY > validRange.bottom || pageY < validRange.top) {
							g.colDropIn = -1;
							g.colDroptip.hide();
							this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes").addClass("l-drop-no");
							return
						}
						for (var colid in g._columns) {
							var col = g._columns[colid];
							if (column == col) {
								visit = true;
								continue
							}
							if (col.issystem) {
								continue
							}
							var sameLevel = col.__level == column.__level;
							var isAfter = !sameLevel ? false : visit ? true : false;
							if (column.frozen != col.frozen) {
								isAfter = col.frozen ? false : true
							}
							if (g.colDropIn != -1 && g.colDropIn != colid) {
								continue
							}
							var cell = document.getElementById(col.__domid);
							var offset = $(cell).offset();
							var range = {
								top: offset.top,
								bottom: offset.top + $(cell).height(),
								left: offset.left - 10,
								right: offset.left + 10
							};
							if (isAfter) {
								var cellwidth = $(cell).width();
								range.left += cellwidth;
								range.right += cellwidth
							}
							if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom) {
								var height = p.headerRowHeight;
								if (col.__rowSpan) {
									height *= col.__rowSpan
								}
								g.colDroptip.css({
									left: range.left + 5,
									top: range.top - 9,
									height: height + 9 * 2
								}).show();
								g.colDropIn = colid;
								g.colDropDir = isAfter ? "right" : "left";
								this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no").addClass("l-drop-yes");
								break
							} else {
								if (g.colDropIn != -1) {
									g.colDropIn = -1;
									g.colDroptip.hide();
									this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes").addClass("l-drop-no")
								}
							}
						}
					},
					onStopDrag: function(current, e) {
						var column = this.draggingColumn;
						g.coldragging = false;
						if (g.colDropIn != -1) {
							g.changeCol.quiDefer(g, 0, [column, g.colDropIn, g.colDropDir == "right"]);
							g.colDropIn = -1
						}
						g.colDroptip.hide();
						this.set("cursor", "default")
					}
				})
			}
			if ($.fn.quiDrag && p.rowDraggable) {
				g.rowDroptip = $("<div class='l-drag-rowdroptip' style='display:none'></div>").appendTo("body");
				g.gridbody.add(g.f.gridbody).quiDrag({
					revert: true,
					animate: false,
					proxyX: 0,
					proxyY: 0,
					proxy: function(draggable, e) {
						var src = g._getSrcElementByEvent(e);
						if (src.row) {
							var content = p.draggingMessage.replace(/{count}/, draggable.draggingRows ? draggable.draggingRows.length : 1);
							if (p.rowDraggingRender) {
								content = p.rowDraggingRender(draggable.draggingRows, draggable, g)
							}
							var proxy = $("<div class='l-drag-proxy' style='display:none'><div class='l-drop-icon l-drop-no'></div>" + content + "</div>").appendTo("body");
							return proxy
						}
					},
					onRevert: function() {
						return false
					},
					onRendered: function() {
						this.set("cursor", "default");
						g.children[this.id] = this
					},
					onStartDrag: function(current, e) {
						if (e.button == 2) {
							return false
						}
						if (g.colresizing) {
							return false
						}
						if (!g.columns.length) {
							return false
						}
						this.set("cursor", "default");
						var src = g._getSrcElementByEvent(e);
						if (!src.cell || !src.data || src.checkbox) {
							return false
						}
						var ids = src.cell.id.split("|");
						var column = g._columns[ids[ids.length - 1]];
						if (src.rownumberscell || src.detailcell || src.checkboxcell || column == g.columns[0]) {
							if (g.enabledCheckbox()) {
								this.draggingRows = g.getSelecteds();
								if (!this.draggingRows || !this.draggingRows.length) {
									return false
								}
							} else {
								this.draggingRows = [src.data]
							}
							this.draggingRow = src.data;
							this.set("cursor", "move");
							g.rowdragging = true;
							this.validRange = {
								top: g.gridbody.offset().top,
								bottom: g.gridbody.offset().top + g.gridbody.height(),
								left: g.grid.offset().left - 10,
								right: g.grid.offset().left + g.grid.width() + 10
							}
						} else {
							return false
						}
					},
					onDrag: function(current, e) {
						var rowdata = this.draggingRow;
						if (!rowdata) {
							return false
						}
						var rows = this.draggingRows ? this.draggingRows : [rowdata];
						if (g.colresizing) {
							return false
						}
						if (g.rowDropIn == null) {
							g.rowDropIn = -1
						}
						var pageX = e.pageX;
						var pageY = e.pageY;
						var visit = false;
						var validRange = this.validRange;
						if (pageX < validRange.left || pageX > validRange.right || pageY > validRange.bottom || pageY < validRange.top) {
							g.rowDropIn = -1;
							g.rowDroptip.hide();
							this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes l-drop-add").addClass("l-drop-no");
							return
						}
						for (var i in g.rows) {
							var rd = g.rows[i];
							var rowid = rd.__id;
							if (rowdata == rd) {
								visit = true
							}
							if ($.inArray(rd, rows) != -1) {
								continue
							}
							var isAfter = visit ? true : false;
							if (g.rowDropIn != -1 && g.rowDropIn != rowid) {
								continue
							}
							var rowobj = g.getRowObj(rowid);
							var offset = $(rowobj).offset();
							var range = {
								top: offset.top - 4,
								bottom: offset.top + $(rowobj).height() + 4,
								left: g.grid.offset().left,
								right: g.grid.offset().left + g.grid.width()
							};
							if (pageX > range.left && pageX < range.right && pageY > range.top && pageY < range.bottom) {
								var lineTop = offset.top;
								if (isAfter) {
									lineTop += $(rowobj).height()
								}
								g.rowDroptip.css({
									left: range.left,
									top: lineTop,
									width: range.right - range.left
								}).show();
								g.rowDropIn = rowid;
								g.rowDropDir = isAfter ? "bottom" : "top";
								if (p.tree && pageY > range.top + 5 && pageY < range.bottom - 5) {
									this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-yes").addClass("l-drop-add");
									g.rowDroptip.hide();
									g.rowDropInParent = true
								} else {
									this.proxy.find(".l-drop-icon:first").removeClass("l-drop-no l-drop-add").addClass("l-drop-yes");
									g.rowDroptip.show();
									g.rowDropInParent = false
								}
								break
							} else {
								if (g.rowDropIn != -1) {
									g.rowDropIn = -1;
									g.rowDropInParent = false;
									g.rowDroptip.hide();
									this.proxy.find(".l-drop-icon:first").removeClass("l-drop-yes  l-drop-add").addClass("l-drop-no")
								}
							}
						}
					},
					onStopDrag: function(current, e) {
						var rows = this.draggingRows;
						g.rowdragging = false;
						for (var i = 0; i < rows.length; i++) {
							var children = rows[i].children;
							if (children) {
								rows = $.grep(rows, function(node, i) {
									var isIn = $.inArray(node, children) == -1;
									return isIn
								})
							}
						}
						if (g.rowDropIn != -1) {
							if (p.tree) {
								var neardata, prow;
								if (g.rowDropInParent) {
									prow = g.getRow(g.rowDropIn)
								} else {
									neardata = g.getRow(g.rowDropIn);
									prow = g.getParent(neardata)
								}
								g.appendRange(rows, prow, neardata, g.rowDropDir != "bottom");
								g.trigger("rowDragDrop", {
									rows: rows,
									parent: prow,
									near: neardata,
									after: g.rowDropDir == "bottom"
								})
							} else {
								g.moveRange(rows, g.rowDropIn, g.rowDropDir == "bottom");
								g.trigger("rowDragDrop", {
									rows: rows,
									parent: prow,
									near: g.getRow(g.rowDropIn),
									after: g.rowDropDir == "bottom"
								})
							}
							g.rowDropIn = -1
						}
						g.rowDroptip.hide();
						this.set("cursor", "default")
					}
				})
			}
		},
		_onRowOver: function(rowParm, over) {
			if (l.draggable.dragging) {
				return
			}
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var methodName = over ? "addClass" : "removeClass";
			if (g.enabledFrozen()) {
				$(g.getRowObj(rowdata, true))[methodName](p.mouseoverRowCssClass)
			}
			$(g.getRowObj(rowdata, false))[methodName](p.mouseoverRowCssClass)
		},
		_onMouseUp: function(e) {
			var g = this,
				p = this.options;
			if (l.draggable.dragging) {
				var src = g._getSrcElementByEvent(e);
				if (src.hcell && src.column) {
					g.trigger("dragdrop", [{
						type: "header",
						column: src.column,
						cell: src.hcell
					},
					e])
				} else {
					if (src.row) {
						g.trigger("dragdrop", [{
							type: "row",
							record: src.data,
							row: src.row
						},
						e])
					}
				}
			}
		},
		_onMouseDown: function(e) {
			var g = this,
				p = this.options
		},
		_onContextmenu: function(e) {
			var g = this,
				p = this.options;
			var src = g._getSrcElementByEvent(e);
			if (src.row) {
				if (p.whenRClickToSelect) {
					g.select(src.data)
				}
				if (g.hasBind("contextmenu")) {
					return g.trigger("contextmenu", [{
						data: src.data,
						rowindex: src.data.__index,
						row: src.row
					},
					e])
				}
			} else {
				if (src.hcell) {
					if (!p.allowHideColumn) {
						return true
					}
					var columnindex = $(src.hcell).attr("columnindex");
					if (columnindex == undefined) {
						return true
					}
					var left = (e.pageX - g.body.offset().left + parseInt(g.body[0].scrollLeft));
					if (columnindex == g.columns.length - 1) {
						left -= 50
					}
					g.popup.css({
						left: left,
						top: g.gridheader.height() + 1
					});
					g.popup.toggle();
					return false
				}
			}
		},
		_onDblClick: function(e) {
			var g = this,
				p = this.options;
			var src = g._getSrcElementByEvent(e);
			if (src.row) {
				g.trigger("dblClickRow", [src.data, src.data.__id, src.row])
			}
		},
		_onClick: function(e) {
			var obj = (e.target || e.srcElement);
			var g = this,
				p = this.options;
			var src = g._getSrcElementByEvent(e);
			if (src.out) {
				if (g.editor.editing && !$.quiui.win.masking) {
					g.endEdit()
				}
				if (p.allowHideColumn) {
					g.popup.hide()
				}
				return
			}
			if (src.indetail || src.editing) {
				return
			}
			if (g.editor.editing) {
				g.endEdit()
			}
			if (p.allowHideColumn) {
				if (!src.popup) {
					g.popup.hide()
				}
			}
			if (src.checkboxall) {
				var row = $(src.hrow);
				var uncheck = row.hasClass("l-checked");
				if (g.trigger("beforeCheckAllRow", [!uncheck, g.element]) == false) {
					return false
				}
				if (uncheck) {
					row.removeClass("l-checked")
				} else {
					row.addClass("l-checked")
				}
				g.selected = [];
				for (var rowid in g.records) {
					if (uncheck) {
						g.unselect(g.records[rowid])
					} else {
						g.select(g.records[rowid])
					}
				}
				g.trigger("checkAllRow", [!uncheck, g.element])
			} else {
				if (src.hcelltext) {
					var hcell = $(src.hcelltext).parent().parent();
					if (!p.enabledSort || !src.column) {
						return
					}
					if (src.column.isSort == false) {
						return
					}
					if (p.url && g.isDataChanged) {
						return
					}
					var sort = $(".l-grid-hd-cell-sort:first", hcell);
					var columnName = src.column.name;
					if (!columnName) {
						return
					}
					if (sort.length > 0) {
						if (sort.hasClass("l-grid-hd-cell-sort-asc")) {
							sort.removeClass("l-grid-hd-cell-sort-asc").addClass("l-grid-hd-cell-sort-desc");
							hcell.removeClass("l-grid-hd-cell-asc").addClass("l-grid-hd-cell-desc");
							g.changeSort(columnName, "desc")
						} else {
							if (sort.hasClass("l-grid-hd-cell-sort-desc")) {
								sort.removeClass("l-grid-hd-cell-sort-desc").addClass("l-grid-hd-cell-sort-asc");
								hcell.removeClass("l-grid-hd-cell-desc").addClass("l-grid-hd-cell-asc");
								g.changeSort(columnName, "asc")
							}
						}
					} else {
						hcell.removeClass("l-grid-hd-cell-desc").addClass("l-grid-hd-cell-asc");
						$(src.hcelltext).after("<span class='l-grid-hd-cell-sort l-grid-hd-cell-sort-asc'>&nbsp;&nbsp;</span>");
						g.changeSort(columnName, "asc")
					}
					$(".l-grid-hd-cell-sort", g.gridheader).add($(".l-grid-hd-cell-sort", g.f.gridheader)).not($(".l-grid-hd-cell-sort:first", hcell)).remove()
				} else {
					if (src.detailbtn && p.detail) {
						var item = src.data;
						var row = $([g.getRowObj(item, false)]);
						if (g.enabledFrozen()) {
							row = row.add(g.getRowObj(item, true))
						}
						var rowid = item.__id;
						if ($(src.detailbtn).hasClass("l-open")) {
							if (p.detail.onCollapse) {
								p.detail.onCollapse(item, $(".l-grid-detailpanel-inner:first", nextrow)[0])
							}
							row.next("tr.l-grid-detailpanel").hide();
							$(src.detailbtn).removeClass("l-open")
						} else {
							var nextrow = row.next("tr.l-grid-detailpanel");
							if (nextrow.length > 0) {
								nextrow.show();
								if (p.detail.onExtend) {
									p.detail.onExtend(item, $(".l-grid-detailpanel-inner:first", nextrow)[0])
								}
								$(src.detailbtn).addClass("l-open");
								g.trigger("SysGridHeightChanged");
								return
							}
							$(src.detailbtn).addClass("l-open");
							var frozenColNum = 0;
							for (var i = 0; i < g.columns.length; i++) {
								if (g.columns[i].frozen) {
									frozenColNum++
								}
							}
							var detailRow = $("<tr class='l-grid-detailpanel'><td><div class='l-grid-detailpanel-inner' style='display:none'></div></td></tr>");
							var detailFrozenRow = $("<tr class='l-grid-detailpanel'><td><div class='l-grid-detailpanel-inner' style='display:none'></div></td></tr>");
							detailRow.attr("id", g.id + "|detail|" + rowid);
							g.detailrows = g.detailrows || [];
							g.detailrows.push(detailRow[0]);
							g.detailrows.push(detailFrozenRow[0]);
							var detailRowInner = $("div:first", detailRow);
							detailRowInner.parent().attr("colSpan", g.columns.length - frozenColNum);
							row.eq(0).after(detailRow);
							if (frozenColNum > 0) {
								detailFrozenRow.find("td:first").attr("colSpan", frozenColNum);
								row.eq(1).after(detailFrozenRow)
							}
							if (p.detail.onShowDetail) {
								p.detail.onShowDetail(item, detailRowInner[0], function() {
									g.trigger("SysGridHeightChanged")
								});
								$("div:first", detailFrozenRow).add(detailRowInner).show().height(p.detail.height || p.detailHeight)
							} else {
								if (p.detail.render) {
									detailRowInner.append(p.detail.render());
									detailRowInner.show()
								}
							}
							g.trigger("SysGridHeightChanged")
						}
					} else {
						if (src.groupbtn) {
							var grouprow = $(src.grouprow);
							var opening = true;
							if ($(src.groupbtn).hasClass("l-grid-group-togglebtn-close")) {
								$(src.groupbtn).removeClass("l-grid-group-togglebtn-close");
								if (grouprow.hasClass("l-grid-grouprow-last")) {
									$("td:first", grouprow).width("auto")
								}
							} else {
								opening = false;
								$(src.groupbtn).addClass("l-grid-group-togglebtn-close");
								if (grouprow.hasClass("l-grid-grouprow-last")) {
									$("td:first", grouprow).width(g.gridtablewidth)
								}
							}
							var currentRow = grouprow.next(".l-grid-row,.l-grid-totalsummary-group,.l-grid-detailpanel");
							while (true) {
								if (currentRow.length == 0) {
									break
								}
								if (opening) {
									currentRow.show();
									if (currentRow.hasClass("l-grid-detailpanel") && !currentRow.prev().find("td.l-grid-row-cell-detail:first span.l-grid-row-cell-detailbtn:first").hasClass("l-open")) {
										currentRow.hide()
									}
								} else {
									currentRow.hide()
								}
								currentRow = currentRow.next(".l-grid-row,.l-grid-totalsummary-group,.l-grid-detailpanel")
							}
							g.trigger("SysGridHeightChanged")
						} else {
							if (src.treelink) {
								g.toggle(src.data)
							} else {
								if (src.row && g.enabledCheckbox()) {
									var selectRowButtonOnly = p.selectRowButtonOnly ? true : false;
									if (p.enabledEdit) {
										selectRowButtonOnly = true
									}
									if (src.checkbox || !selectRowButtonOnly) {
										var row = $(src.row);
										var uncheck = row.hasClass("l-selected");
										if (g.trigger("beforeCheckRow", [!uncheck, src.data, src.data.__id, src.row]) == false) {
											return false
										}
										var met = uncheck ? "unselect" : "select";
										g[met](src.data);
										if (p.tree && p.autoCheckChildren) {
											var children = g.getChildren(src.data, true);
											for (var i = 0, l = children.length; i < l; i++) {
												g[met](children[i])
											}
										}
										g.trigger("checkRow", [!uncheck, src.data, src.data.__id, src.row])
									}
									if (!src.checkbox && src.cell && p.enabledEdit && p.clickToEdit) {
										g._applyEditor(src.cell)
									}
								} else {
									if (src.row && !g.enabledCheckbox()) {
										if (src.cell && p.enabledEdit && p.clickToEdit) {
											g._applyEditor(src.cell)
										}
										if ($(src.row).hasClass("l-selected")) {
											if (!p.allowUnSelectRow) {
												$(src.row).addClass("l-selected-again");
												return
											}
											g.unselect(src.data)
										} else {
											g.select(src.data)
										}
									} else {
										if (src.toolbar) {
											if (src.first) {
												if (g.trigger("toFirst", [g.element]) == false) {
													return false
												}
												g.changePage("first")
											} else {
												if (src.prev) {
													if (g.trigger("toPrev", [g.element]) == false) {
														return false
													}
													g.changePage("prev")
												} else {
													if (src.next) {
														if (g.trigger("toNext", [g.element]) == false) {
															return false
														}
														g.changePage("next")
													} else {
														if (src.last) {
															if (g.trigger("toLast", [g.element]) == false) {
																return false
															}
															g.changePage("last")
														} else {
															if (src.load) {
																if ($("span", src.load).hasClass("l-disabled")) {
																	return false
																}
																if (g.trigger("reload", [g.element]) == false) {
																	return false
																}
																if (p.url && g.isDataChanged) {
																	return false
																}
																g.loadData(p.where)
															}
														}
													}
												}
											}
											if (p.dataAction == "local") {
												$(".l-grid-hd-row").removeClass("l-checked")
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		select: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var rowid = rowdata.__id;
			var rowobj = g.getRowObj(rowid);
			var rowobj1 = g.getRowObj(rowid, true);
			if (!g.enabledCheckbox() && !g.ctrlKey) {
				for (var i in g.selected) {
					var o = g.selected[i];
					if (o.__id in g.records) {
						$(g.getRowObj(o)).removeClass("l-selected l-selected-again");
						if (g.enabledFrozen()) {
							$(g.getRowObj(o, true)).removeClass("l-selected l-selected-again")
						}
					}
				}
				g.selected = []
			}
			if (rowobj) {
				$(rowobj).addClass("l-selected")
			}
			if (rowobj1) {
				$(rowobj1).addClass("l-selected")
			}
			g.selected[g.selected.length] = rowdata;
			g.trigger("selectRow", [rowdata, rowid, rowobj])
		},
		unselect: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			var rowid = rowdata.__id;
			var rowobj = g.getRowObj(rowid);
			var rowobj1 = g.getRowObj(rowid, true);
			$(rowobj).removeClass("l-selected l-selected-again");
			if (g.enabledFrozen()) {
				$(rowobj1).removeClass("l-selected l-selected-again")
			}
			g._removeSelected(rowdata);
			g.trigger("unSelectRow", [rowdata, rowid, rowobj])
		},
		isSelected: function(rowParm) {
			var g = this,
				p = this.options;
			var rowdata = g.getRow(rowParm);
			for (var i in g.selected) {
				if (g.selected[i] == rowdata) {
					return true
				}
			}
			return false
		},
		_onResize: function() {
			var g = this,
				p = this.options;
			g.resetHeight();
			g.resetWidth();
			g.trigger("SysGridHeightChanged")
		}
	});
	$.quiui.controls.Grid.prototype.enabledTotal = $.quiui.controls.Grid.prototype.isTotalSummary;
	$.quiui.controls.Grid.prototype.add = $.quiui.controls.Grid.prototype.addRow;
	$.quiui.controls.Grid.prototype.update = $.quiui.controls.Grid.prototype.updateRow;
	$.quiui.controls.Grid.prototype.append = $.quiui.controls.Grid.prototype.appendRow;
	$.quiui.controls.Grid.prototype.getSelected = $.quiui.controls.Grid.prototype.getSelectedRow;
	$.quiui.controls.Grid.prototype.getSelecteds = $.quiui.controls.Grid.prototype.getSelectedRows;
	$.quiui.controls.Grid.prototype.getCheckedRows = $.quiui.controls.Grid.prototype.getSelectedRows;
	$.quiui.controls.Grid.prototype.getCheckedRowObjs = $.quiui.controls.Grid.prototype.getSelectedRowObjs;
	$.quiui.controls.Grid.prototype.setOptions = $.quiui.controls.Grid.prototype.set
})(jQuery);
(function(a) {
	a.fn.quiResizable = function(b) {
		return a.quiui.run.call(this, "quiResizable", arguments, {
			idAttrName: "quiuiresizableid",
			hasElement: false,
			propertyToElemnt: "target"
		})
	};
	a.fn.quiGetResizableManager = function() {
		return a.quiui.run.call(this, "quiGetResizableManager", arguments, {
			idAttrName: "quiuiresizableid",
			hasElement: false,
			propertyToElemnt: "target"
		})
	};
	a.quiDefaults.Resizable = {
		handles: "n, e, s, w, ne, se, sw, nw",
		maxWidth: 2000,
		maxHeight: 2000,
		minWidth: 20,
		minHeight: 20,
		scope: 3,
		animate: false,
		onStartResize: function(b) {},
		onResize: function(b) {},
		onStopResize: function(b) {},
		onEndResize: null
	};
	a.quiui.controls.Resizable = function(b) {
		a.quiui.controls.Resizable.base.constructor.call(this, null, b)
	};
	a.quiui.controls.Resizable.quiExtend(a.quiui.core.UIComponent, {
		__getType: function() {
			return "Resizable"
		},
		__idPrev: function() {
			return "Resizable"
		},
		_render: function() {
			var b = this,
				c = this.options;
			b.target = a(c.target);
			b.set(c);
			b.target.mousemove(function(f) {
				if (c.disabled) {
					return
				}
				b.dir = b._getDir(f);
				if (b.dir) {
					b.target.css("cursor", b.dir + "-resize")
				} else {
					if (b.target.css("cursor").indexOf("-resize") > 0) {
						b.target.css("cursor", "default")
					}
				}
				if (c.target.quiuidragid) {
					var d = a.quiui.get(c.target.quiuidragid);
					if (d && b.dir) {
						d.set("disabled", true)
					} else {
						if (d) {
							d.set("disabled", false)
						}
					}
				}
			}).mousedown(function(d) {
				if (c.disabled) {
					return
				}
				if (b.dir) {
					b._start(d)
				}
			})
		},
		_rendered: function() {
			this.options.target.quiuiresizableid = this.id
		},
		_getDir: function(k) {
			var j = this,
				b = this.options;
			var d = "";
			var n = j.target.offset();
			var c = j.target.width();
			var l = j.target.height();
			var m = b.scope;
			var h = k.pageX || k.screenX;
			var f = k.pageY || k.screenY;
			if (f >= n.top && f < n.top + m) {
				d += "n"
			} else {
				if (f <= n.top + l && f > n.top + l - m) {
					d += "s"
				}
			}
			if (h >= n.left && h < n.left + m) {
				d += "w"
			} else {
				if (h <= n.left + c && h > n.left + c - m) {
					d += "e"
				}
			}
			if (b.handles == "all" || d == "") {
				return d
			}
			if (a.inArray(d, j.handles) != -1) {
				return d
			}
			return ""
		},
		_setHandles: function(b) {
			if (!b) {
				return
			}
			this.handles = b.replace(/(\s*)/g, "").split(",")
		},
		_createProxy: function() {
			var b = this;
			b.proxy = a('<div class="l-resizable"></div>');
			b.proxy.width(b.target.width()).height(b.target.height());
			b.proxy.attr("resizableid", b.id).appendTo("body")
		},
		_removeProxy: function() {
			var b = this;
			if (b.proxy) {
				b.proxy.remove();
				b.proxy = null
			}
		},
		_start: function(d) {
			var b = this,
				c = this.options;
			b._createProxy();
			b.proxy.css({
				left: b.target.offset().left,
				top: b.target.offset().top,
				position: "absolute"
			});
			b.current = {
				dir: b.dir,
				left: b.target.offset().left,
				top: b.target.offset().top,
				startX: d.pageX || d.screenX,
				startY: d.pageY || d.clientY,
				width: b.target.width(),
				height: b.target.height()
			};
			a(document).bind("selectstart.resizable", function() {
				return false
			});
			a(document).bind("mouseup.resizable", function() {
				b._stop.apply(b, arguments)
			});
			a(document).bind("mousemove.resizable", function() {
				b._drag.apply(b, arguments)
			});
			b.proxy.show();
			b.trigger("startResize", [b.current, d])
		},
		changeBy: {
			t: ["n", "ne", "nw"],
			l: ["w", "sw", "nw"],
			w: ["w", "sw", "nw", "e", "ne", "se"],
			h: ["n", "ne", "nw", "s", "se", "sw"]
		},
		_drag: function(h) {
			var d = this,
				f = this.options;
			if (!d.current) {
				return
			}
			if (!d.proxy) {
				return
			}
			d.proxy.css("cursor", d.current.dir == "" ? "default" : d.current.dir + "-resize");
			var c = h.pageX || h.screenX;
			var b = h.pageY || h.screenY;
			d.current.diffX = c - d.current.startX;
			d.current.diffY = b - d.current.startY;
			d._applyResize(d.proxy);
			d.trigger("resize", [d.current, h])
		},
		_stop: function(d) {
			var b = this,
				c = this.options;
			if (b.hasBind("stopResize")) {
				if (b.trigger("stopResize", [b.current, d]) != false) {
					b._applyResize()
				}
			} else {
				b._applyResize()
			}
			b._removeProxy();
			b.trigger("endResize", [b.current, d]);
			a(document).unbind("selectstart.resizable");
			a(document).unbind("mousemove.resizable");
			a(document).unbind("mouseup.resizable")
		},
		_applyResize: function(b) {
			var c = this,
				d = this.options;
			var e = {
				left: c.current.left,
				top: c.current.top,
				width: c.current.width,
				height: c.current.height
			};
			var f = false;
			if (!b) {
				b = c.target;
				f = true;
				if (!isNaN(parseInt(c.target.css("top")))) {
					e.top = parseInt(c.target.css("top"))
				} else {
					e.top = 0
				}
				if (!isNaN(parseInt(c.target.css("left")))) {
					e.left = parseInt(c.target.css("left"))
				} else {
					e.left = 0
				}
			}
			if (a.inArray(c.current.dir, c.changeBy.l) > -1) {
				e.left += c.current.diffX;
				c.current.diffLeft = c.current.diffX
			} else {
				if (f) {
					delete e.left
				}
			}
			if (a.inArray(c.current.dir, c.changeBy.t) > -1) {
				e.top += c.current.diffY;
				c.current.diffTop = c.current.diffY
			} else {
				if (f) {
					delete e.top
				}
			}
			if (a.inArray(c.current.dir, c.changeBy.w) > -1) {
				e.width += (c.current.dir.indexOf("w") == -1 ? 1 : -1) * c.current.diffX;
				c.current.newWidth = e.width
			} else {
				if (f) {
					delete e.width
				}
			}
			if (a.inArray(c.current.dir, c.changeBy.h) > -1) {
				e.height += (c.current.dir.indexOf("n") == -1 ? 1 : -1) * c.current.diffY;
				c.current.newHeight = e.height
			} else {
				if (f) {
					delete e.height
				}
			}
			if (f && d.animate) {
				b.animate(e)
			} else {
				b.css(e)
			}
		}
	})
})(jQuery);
(function(a) {
	a.fn.quiToolBar = function(b) {
		return a.quiui.run.call(this, "quiToolBar", arguments)
	};
	a.fn.quiGetToolBarManager = function() {
		return a.quiui.run.call(this, "quiGetToolBarManager", arguments)
	};
	a.quiDefaults.ToolBar = {};
	a.quiMethos.ToolBar = {};
	a.quiui.controls.ToolBar = function(c, b) {
		a.quiui.controls.ToolBar.base.constructor.call(this, c, b)
	};
	a.quiui.controls.ToolBar.quiExtend(a.quiui.core.UIComponent, {
		__getType: function() {
			return "ToolBar"
		},
		__idPrev: function() {
			return "ToolBar"
		},
		_extendMethods: function() {
			return a.quiMethos.ToolBar
		},
		_render: function() {
			var b = this,
				c = this.options;
			b.toolBar = a(this.element);
			b.toolBar.addClass("l-toolbar");
			b.set(c)
		},
		_setItems: function(b) {
			var c = this;
			a(b).each(function(d, e) {
				c.addItem(e)
			})
		},
		addItem: function(e) {
			var d = this,
				f = this.options;
			if (e.visible != null && e.visible == false) {
				return
			}
			if (e.line) {
				d.toolBar.append('<div class="l-bar-separator"></div>');
				return
			}
			var b = a('<div class="l-toolbar-item l-panel-btn"><div class="l-panel-btn-l"></div><div class="l-panel-btn-r"></div></div>');
			d.toolBar.append(b);
			e.id && b.attr("toolbarid", e.id);
			var c;
			if (e.iconClass) {
				c = a("<div class='l-icon " + e.iconClass + "'></div>");
				c.css("float", "left");
				b.append(c);
				b.addClass("l-toolbar-item-hasicon")
			}
			if (e.text) {
				c.html(e.text)
			}
			if (e.disabled) {
				b.css({
					color: "#999999",
					cursor: "default"
				});
				return
			}
			e.click && b.click(function() {
				e.click(e)
			});
			b.hover(function() {
				a(this).addClass("l-panel-btn-over")
			}, function() {
				a(this).removeClass("l-panel-btn-over")
			})
		}
	})
})(jQuery);
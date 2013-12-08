var TabOption = function() {};
TabOption.prototype = {
	containerId: "",
	pageid: "",
	cid: "",
	position: top,
	action: function(b, a) {}
};
var TabItemOption = function() {};
TabItemOption.prototype = {
	id: "tab_",
	title: "",
	url: "",
	iframeAddtion: "",
	isClosed: true
};
var pos = 2;
var timer;
var tabTotalWidth = 0;
var $trueContainer;
var $btnLeft;
var $btnRight;
var containerWidth = 0;

function TabView(f) {
	var a = {
		current: null,
		current_index: 0,
		current_page: null
	};
	var g = new TabOption();
	$.extend(g, f);
	var b = g.position == "bottom" ? "_bottom" : "";
	this.id = g.cid;
	this.pid = g.pageid;
	this.tabs = null;
	this.tabContainer = null;
	this.iframeScroller = g.iframeScroller;
	var c = '<table class="tab_item"  id="{0}" border="0" cellpadding="0" cellspacing="0"><tr><td class="tab_item1"></td><td class="tab_item2 tab_title">{1}</td><td class="tab_item2"><div class="tab_close"></div></td><td class="tab_item3"></td></tr></table>';
	var h = '<div class="benma_ui_tab" id="{0}"><div class="tab_hr"></div></div>';
	var i;
	i = '<iframe id="{0}" name="{3}" {2} allowTransparency="true" frameborder="0" width="100%" height="100%" src="{1}"></iframe>';
	if (g.position == "bottom") {
		c = '<table class="tab_item_bottom"  id="{0}" border="0" cellpadding="0" cellspacing="0"><tr><td class="tab_item1_bottom"></td><td class="tab_item2_bottom tab_title">{1}</td><td class="tab_item2_bottom"><div class="tab_close tab_close_bottom"></div></td><td class="tab_item3_bottom"></td></tr></table>';
		h = '<div class="benma_ui_tab benma_ui_tab_bottom" id="{0}"><div class="tab_hr tab_hr_bottom"></div></div>'
	}
	$("#" + g.containerId).append(h.replace("{0}", this.id));
	$trueContainer = $('<div class="tabContainer"></div>');
	$btnLeft = $('<div class="tabButtonLeft" style="display:none;"></div>');
	$btnRight = $('<div class="tabButtonRight" style="display:none;"></div>');
	$("#" + g.containerId).find(".benma_ui_tab").append($trueContainer);
	$("#" + g.containerId).find(".benma_ui_tab").append($btnLeft);
	$("#" + g.containerId).find(".benma_ui_tab").append($btnRight);
	containerWidth = $("#" + g.containerId).width();
	$btnLeft.bind("mousedown", function() {
		containerWidth = $("#" + g.containerId).width();
		timer = setInterval(function() {
			if (pos > 16) {
				pos = 16;
				clearInterval(timer);
				return
			}
			pos = pos + 8;
			$trueContainer.css("left", pos)
		}, 30)
	});
	$btnLeft.bind("mouseup", function() {
		clearInterval(timer)
	});
	$btnRight.bind("mousedown", function() {
		containerWidth = $("#" + g.containerId).width();
		timer = setInterval(function() {
			if (pos > 16) {
				pos = 16;
				clearInterval(timer);
				return
			} else {
				if (pos < containerWidth - tabTotalWidth - 34) {
					pos = containerWidth - tabTotalWidth - 34;
					clearInterval(timer);
					return
				}
			}
			pos = pos - 8;
			$trueContainer.css("left", pos)
		}, 30)
	});
	$btnRight.bind("mouseup", function() {
		clearInterval(timer)
	});

	function e(n) {
		var p = $(n);
		tabTotalWidth = tabTotalWidth + $(p).width() + 5;
		containerWidth = $("#" + g.containerId).width();
		if (tabTotalWidth + 34 > containerWidth) {
			pos = containerWidth - tabTotalWidth - 34;
			$trueContainer.css("left", pos);
			$btnLeft.fadeIn(200);
			$btnRight.fadeIn(200)
		}
		var m = $(p).find(".tab_item1" + b);
		var l = $(p).find(".tab_item2" + b);
		var k = $(p).find(".tab_item3" + b);
		if (a.current == null || a.current != this) {
			$(p).mouseover(function() {
				m.addClass("tab_item1_mouseover" + b);
				l.addClass("tab_item2_mouseover" + b);
				k.addClass("tab_item3_mouseover" + b)
			}).mouseout(function() {
				m.removeClass("tab_item1_mouseover" + b);
				l.removeClass("tab_item2_mouseover" + b);
				k.removeClass("tab_item3_mouseover" + b)
			}).click(function() {
				if (a.current != null) {
					$(a.current).find(".tab_item1" + b).removeClass("tab_item1_selected" + b);
					$(a.current).find(".tab_item2" + b).removeClass("tab_item2_selected" + b);
					$(a.current).find(".tab_item3" + b).removeClass("tab_item3_selected" + b);
					$(a.current).find(".tab_close").addClass("tab_close_noselected")
				}
				m.addClass("tab_item1_selected" + b);
				l.addClass("tab_item2_selected" + b);
				k.addClass("tab_item3_selected" + b);
				a.current = this;
				$(a.current).find(".tab_close").removeClass("tab_close_noselected");
				d($(this).attr("id"), false)
			});
			var o = $(p).find(".tab_close").mouseover(function() {
				$(this).addClass("tab_close_mouseover")
			}).mouseout(function() {
				$(this).removeClass("tab_close_mouseover")
			}).click(function() {
				j(p.attr("id"))
			})
		}
	}
	function d(l, k) {
		if (k) {}
		if (a.current_page) {
			a.current_page.hide()
		}
		a.current_page = $("#page_" + l);
		a.current_page.show();
		g.action($("#" + l), a.current_page);
		$("body").trigger("dynamicTabActived", l)
	}
	function j(o) {
		var n = $("#page_" + o);
		var k = $("#" + o);
		tabTotalWidth = tabTotalWidth - k.width() - 5;
		if ($(a.current).attr("id") == k.attr("id")) {
			var l = k.next();
			if (l.attr("id")) {
				$("#" + l.attr("id")).trigger("click")
			} else {
				var m = k.prev();
				if (m.attr("id")) {
					$("#" + m.attr("id")).trigger("click")
				}
			}
		} else {}
		n.remove();
		k.remove();
		if (tabTotalWidth + 62 < containerWidth) {
			pos = 2;
			$trueContainer.css("left", pos);
			$btnLeft.fadeOut(200);
			$btnRight.fadeOut(200)
		}
	}
	this.init = function() {
		this.tabContainer = $("#" + this.id);
		this.tabs = this.tabContainer.find(".tab_item" + b);
		this.tabs.each(function() {
			e(this)
		})
	};
	this.add = function(n) {
		var m = new TabItemOption();
		$.extend(m, n);
		if ($("#" + m.id).length > 0) {
			$("#" + m.id).trigger("click");
			try {
				closeProgress()
			} catch (o) {}
		} else {
			if (m.title.length > 10) {
				m.title = m.title.substring(0, 10)
			}
			if (m.title.length < 4) {
				m.title = "&nbsp;&nbsp;" + m.title + "&nbsp;"
			}
			var k;
			if (m.iframeAddtion == "") {
				k = i.replace("{0}", "page_" + m.id).replace("{3}", "page_" + m.id).replace("{1}", m.url).replace("{2}", "")
			} else {
				k = i.replace("{0}", "page_" + m.id).replace("{3}", "page_" + m.id).replace("{1}", m.url).replace("{2}", m.iframeAddtion)
			}
			$("#" + this.pid).append(k);
			var l = c.replace("{0}", m.id).replace("{1}", m.title);
			this.tabContainer.find(".tabContainer").append(l);
			e($("#" + m.id));
			if (!m.isClosed) {
				$($("#" + m.id)).find(".tab_close").hide()
			}
			$("#" + m.id).trigger("click")
		}
	};
	this.update = function(k) {
		var l = k.id;
		$("#" + l).find(".tab_title").html(k.title);
		$("#" + l).trigger("click");
		$("#page_" + l).attr("src", k.url)
	};
	this.activate = function(k) {};
	this.close = function(k) {
		j(k)
	};
	this.init()
};
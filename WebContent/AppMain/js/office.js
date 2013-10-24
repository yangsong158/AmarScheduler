var listData;
var iconContainerHide = 0;
var iconContainerHideTemp = 0;
var homeUrl = "open.html";

function iframeClickHandler() {
	var a = $("#bs_navcenter");
	if (iconContainerHide == 1) {
		a.hide();
	}
	$(".officeMenu").officeMenuClose();
}
function backHome() {
	jQuery.jCookie("hiconIndex", "false");
	jQuery.jCookie("menuItemUrl", "false");
	$(".nav_icon_h_item >a").removeClass("current");
	$(".officeMenu").officeMenuClose();
	top.frmright.window.location = homeUrl;
}
function createOfficeTab(d) {
	var k = new String(document.location);
	var j = 0;
	var c = jQuery.jCookie("htabIndex");
	if (c == "false") {} else {
		j = parseInt(c);
		if (isNaN(j)) {
			j = 0;
		}
	}
	k = k.substr(0, 32);
	var b = -1;
	var f = jQuery.jCookie("hiconIndex");
	if (f == "false" || f == false) {
		b = -1;
	} else {
		b = f;
	}
	var g = null;
	var h = jQuery.jCookie("menuItemUrl");
	if (h == "false" || h == false) {
		g = null;
	} else {
		g = h;
	}
	var i;
	if (broswerFlag == "IE6") {
		i = $('<div class="htab_ie6"></div>');
	} else {
		i = $('<div class="htab"></div>');
	}
	$("#bs_bannerright").append(i);
	var e = $("#bs_navright");
	var a = $("#bs_navcenter");
	$.each(d.list, function(l, q) {
		var n = $('<a href="javascript:;"><b></b></a>');
		var p = n.find("b");
		if (q.name) {
			p.text(q.name);
		}
		if (q.id) {
			n.attr("id", q.id);
		}
		i.append(n);
		if (q.group) {
			var o = $('<table style="display:none;"></table>');
			if (q.id) {
				o.attr("id", q.id);
			}
			var m = $("<tr></tr>");
			$.each(q.group, function(t, r) {
				var u = $('<td><div class="group"><div class="group_center"><div class="group_left"><div class="group_right"></div></div></div></div></td>');
				if (r.children) {
					var s = $('<div class="nav_icon_h"><table><tr><td><td></tr></table></div>');
					u.find(".group_right").append(s);
					$.each(r.children, function(w, v) {
						var y = $('<td><div class="nav_icon_h_item"><a href="javascript:;"><div class="nav_icon_h_item_img"><img/></div><div class="nav_icon_h_item_text"></div></a></div></td>');
						var x = y.find("a");
						if (v.id) {
							x.attr("id", v.id);
						}
						if (v.link) {
							x.attr("href", v.link);
						}
						if (v.target) {
							x.attr("target", v.target);
						}
						if (v.name) {
							y.find(".nav_icon_h_item_text").text(v.name);
						}
						if (v.icon) {
							y.find("img").attr("src", v.icon);
						}
						s.find("tr").append(y);
					});
				}
				m.append(u);
				o.append(m);
			});
			e.append(o);
		}
	});
	i.find(">a").each(function(m) {
		var l = $(this).attr("id");
		$(this).click(function() {
			i.find(">a").removeClass("current");
			$(this).addClass("current");
			jQuery.jCookie("htabIndex", m.toString());
			e.find(">table").each(function() {
				$(this).hide();
				if ($(this).attr("id") == l) {
					$(this).fadeIn(500);
				}
			});
			if (iconContainerHide == 1) {
				a.show();
			}
		});
		$(this).bind("dblclick", function() {
			if (iconContainerHide == 0) {
				iconContainerHide = 1;
				iconContainerHideTemp = 1;
				a.addClass("nav_icon_h_position");
				a.hide();
				autoReset();
			} else {
				iconContainerHide = 0;
				iconContainerHideTemp = 0;
				a.removeClass("nav_icon_h_position");
				a.show();
				autoReset();
			}
		});
		if (m == j) {
			$(this).addClass("current");
			e.find(">table").each(function() {
				$(this).hide();
				if ($(this).attr("id") == l) {
					$(this).fadeIn(500);
				}
			});
		}
	});
	e.find(".nav_icon_h_item >a").each(function(m) {
		var l = $(this).attr("id");
		$(this).click(function() {
			e.find(".nav_icon_h_item >a").removeClass("current");
			$(this).addClass("current");
			if (l) {
				jQuery.jCookie("hiconIndex", l);
				jQuery.jCookie("menuItemUrl", "false");
			}
			if ($(this).attr("target") != null) {
				var n = "正在加载中...";
				progressFlag = 2;
				showSimpleProgress(n, 0, true, "#ffffff");
			}
		});
		if (b != -1) {
			if (l == b) {
				$(this).addClass("current");
				document.getElementById("frmright").contentWindow.location = $(this).attr("href");
			}
		}
	});
	if (b == -1 && g == null) {
		document.getElementById("frmright").contentWindow.location = homeUrl;
	} else {
		if (g != null) {
			document.getElementById("frmright").contentWindow.location = g;
		}
	}
}
function changeLeftMenu(a) {
	listData = getListData(a);
	if (listData != null) {
		document.getElementById("frmleft").contentWindow.initTreeMenu(listData);
	}
}
$.fn.officeMenuClose = function() {
	var a = $(this);
	var c = a.find(".top_menuBtn");
	var b = a.find(".top_menu");
	if (b[0].style.display != "none") {
		b.hide(200);
		c.removeClass("top_menuBtnCurrent");
		b.find(".menubox_listCon_up").hide();
	}
};
$.fn.officeMenuRender = function(g) {
	var e = $(this);
	var k = $('<a class="top_menuBtn" href="javascript:;">button</a>');
	e.append(k);
};
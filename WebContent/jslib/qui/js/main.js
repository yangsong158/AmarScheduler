var leftOverHeight = 0;
var rightOverHeight = 0;
var middleOverHeight = 0;
var exitMenu = 0;
var hexitMenu = 0;
var progressFlag = 0;
var oldBannerHeight = 0;
var oldFootHeight = 0;
var broswerFlag = "";
var maskDiv;
var positionType = "none";
var positionContent = "";
var codePageMenu;
var _autoFormat = true;
var pResizeTimer = null;
$(function() {
	maskDiv = $('<div class="loadmask"></div>');
	$("#bs_right").append(maskDiv);
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		var h = window.navigator.userAgent.substring(30, 33);
		if (h == "6.0") {
			broswerFlag = "IE6"
		} else {
			if (h == "7.0") {
				broswerFlag = "IE7"
			}
		}
	}
	var a = $("#theme").attr("ie6detect");
	if (a != null && a != "") {
		if (broswerFlag == "IE6") {
			top.Dialog.open({
				URL: a,
				Title: "提示",
				Width: 360,
				Height: 210,
				ShowCloseButton: false,
				CloseHideScroller: true
			})
		}
	}
	var d = $("#theme").attr("ie7detect");
	if (d != null && d != "") {
		if (broswerFlag == "IE7") {
			top.Dialog.open({
				URL: d,
				Title: "提示",
				Width: 360,
				Height: 210,
				ShowCloseButton: false,
				CloseHideScroller: true
			})
		}
	}
	if ($("#theme").attr("autoFormat") == "false" || $("#theme").attr("autoFormat") == false) {
		_autoFormat = false
	}
	oldBannerHeight = $("#bs_bannercenter").outerHeight();
	oldFootHeight = $("#fbox").outerHeight();
	if (_autoFormat == true) {
		var c = document.getElementsByTagName("html")[0];
		c.style.overflow = "hidden";
		firstReset();
		window.onresize = function() {
			if (pResizeTimer) {
				clearTimeout(pResizeTimer)
			}
			pResizeTimer = setTimeout("autoReset()", 100)
		}
	}
	$(".spliter").each(function() {
		$(this).spliterRender()
	});
	var b = 12;
	try {
		var f = jQuery.jCookie("fontSize");
		if (f != false) {
			b = parseInt(f)
		}
	} catch (g) {}
	if (b == 12) {
		$(".fontChange").eq(2).find("a").addClass("fontChange_cur")
	} else {
		if (b == 14) {
			$(".fontChange").eq(1).find("a").addClass("fontChange_cur")
		} else {
			if (b == 16) {
				$(".fontChange").eq(0).find("a").addClass("fontChange_cur")
			}
		}
	}
	$(".fontChange a").each(function() {
		$(this).click(function() {
			$(".fontChange a").removeClass("fontChange_cur");
			$(this).addClass("fontChange_cur");
			var i = parseInt($(this).attr("setFont"));
			jQuery.jCookie("fontSize", i);
			try {
				document.getElementById("frmright").contentWindow.changeFont(i)
			} catch (j) {}
			try {
				document.getElementById("frmleft").contentWindow.changeFont(i)
			} catch (j) {}
			try {
				document.getElementById("frmmiddle").contentWindow.changeFont(i)
			} catch (j) {}
		})
	});
	if ($(".popupMenu").length > 0) {
		$(".popupMenu").popupMenuRender()
	}
	$("#fullSrceen").fullSrceenRender()
});
$.fn.popupMenuRender = function() {
	$(this).hover(function() {
		$(this).find(".popupMenu_con").show()
	}, function() {
		$(this).find(".popupMenu_con").hide()
	})
};
jQuery.fn.extend({
	fullSrceenRender: function() {
		var b = $(this);
		var e = false;
		if (b.attr("hideNav") == "true" || $(this).attr("hideNav") == true) {
			e = true
		}
		var d = b.text();
		var f = "退出全屏";
		if (b.attr("afterClickText")) {
			f = b.attr("afterClickText")
		}
		var a = b.attr("class");
		var c = "icon_actualscreen hand";
		if (b.attr("afterClickStyle")) {
			c = b.attr("afterClickStyle")
		}
		b.toggle(function() {
			$("#bs_bannercenter").hide();
			$("#bs_bannercenter").height(0);
			if (broswerFlag != "IE6") {
				$("#fbox").hide();
				$("#fbox").height(0)
			} else {} if (e) {
				$(".spliter").spliterClose()
			}
			autoReset();
			$(this).text(f);
			$(this).removeClass(a);
			$(this).addClass(c)
		}, function() {
			$("#bs_bannercenter").show();
			$("#fbox").show();
			$("#bs_bannercenter").height(oldBannerHeight);
			$("#fbox").height(oldFootHeight);
			if (e) {
				$(".spliter").spliterOpen()
			}
			autoReset();
			$(this).text(d);
			$(this).removeClass(c);
			$(this).addClass(a)
		})
	},
	buttonInputRender: function() {
		if (!$(this).attr("class")) {
			$(this).addClass("button")
		}
		var b = _getStrLength($(this).val());
		if ($(this).attr("useMinWidth") == "false" || $(this).attr("useMinWidth") == false) {} else {
			if (b < 5) {
				$(this).width(60)
			}
		}
		$(this).hover(function() {
			$(this).addClass("button_hover")
		}, function() {
			$(this).removeClass("button_hover")
		});
		if ($(this).attr("toggle") == "true" || $(this).attr("toggle") == true) {
			var c = $("<input type='hidden'/>");
			if ($(this).attr("name") != null) {
				c.attr("name", $(this).attr("name"))
			}
			$(this).after(c);
			var a = 0;
			if ($(this).attr("relValue") == "1") {
				a = 1
			}
			$(this).attr("relValue", a);
			c.attr("relValue", a);
			if (a == 0) {
				$(this).toggle(function() {
					$(this).addClass("toggle");
					$(this).attr("relValue", 1);
					c.attr("relValue", 1)
				}, function() {
					$(this).removeClass("toggle");
					$(this).attr("relValue", 0);
					c.attr("relValue", 0)
				})
			} else {
				$(this).addClass("toggle");
				$(this).toggle(function() {
					$(this).removeClass("toggle");
					$(this).attr("relValue", 0);
					c.attr("relValue", 0)
				}, function() {
					$(this).addClass("toggle");
					$(this).attr("relValue", 1);
					c.attr("relValue", 1)
				})
			}
		}
	},
	buttonRender: function() {
		$(this).addClass("button");
		var b = _getStrLength($(this).text());
		var a = 0;
		var c = 50;
		a = _getStrLength($(this).filter(":has(span)").find("span").text());
		if (a != 0) {
			c = 20 + 7 * a + 10
		}
		if (broswerFlag == "Firefox" || broswerFlag == "Opera" || broswerFlag == "Safari") {
			$(this).filter(":has(span)").css({
				paddingLeft: "5px",
				width: c + 8 + "px"
			})
		} else {
			$(this).filter(":has(span)").css({
				paddingLeft: "5px",
				width: c + "px"
			})
		}
		if (b < 5) {
			$(this).width(66)
		}
		$(this).filter(":has(span)").find("span").css({
			cursor: "default"
		});
		$(this).hover(function() {
			$(this).addClass("button_hover")
		}, function() {
			$(this).removeClass("button_hover")
		})
	}
});

function fullScrennHander(a, b) {
	if (a == true) {
		$("#bs_bannercenter").hide();
		$("#bs_bannercenter").height(0);
		if (broswerFlag != "IE6") {
			$("#fbox").hide();
			$("#fbox").height(0)
		} else {
			$(".fontChange").hide();
			$(".fontTitle").hide();
			$("#fbox").hide();
			$("#fbox").height(0)
		}
		if (b != null) {
			if (b == true) {
				$(".spliter").spliterClose()
			}
		}
	} else {
		if (a == false) {
			$("#bs_bannercenter").show();
			$("#fbox").show();
			$("#bs_bannercenter").height(oldBannerHeight);
			$("#fbox").height(oldFootHeight);
			if (b != null) {
				if (b == true) {
					$(".spliter").spliterOpen()
				}
			}
		}
	}
	autoReset()
}
function iframeHeight(b) {
	var a = document.getElementById(b);
	a.style.height = a.contentWindow.document.body.scrollHeight + "px"
}
function createPosition(a, c) {
	var b = $("#" + a);
	b.html(c)
}
function firstReset() {
	leftOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#lbox_topcenter").outerHeight() + $("#lbox_bottomcenter").outerHeight();
	rightOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#rbox_topcenter").outerHeight() + $("#rbox_bottomcenter").outerHeight();
	middleOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#mbox_topcenter").outerHeight() + $("#mbox_bottomcenter").outerHeight();
	var a = document.documentElement.clientHeight;
	var c = document.documentElement.clientWidth;
	try {
		var f = a - leftOverHeight - parseInt($("#lbox").css("paddingTop")) - parseInt($("#lbox").css("paddingBottom"));
		$("#bs_left").height(f)
	} catch (b) {}
	try {
		var g = a - rightOverHeight - parseInt($("#rbox").css("paddingTop")) - parseInt($("#rbox").css("paddingBottom"));
		$("#bs_right").height(g)
	} catch (b) {}
	try {
		var d = a - middleOverHeight - parseInt($("#mbox").css("paddingTop")) - parseInt($("#mbox").css("paddingBottom"));
		$("#bs_middle").height(d)
	} catch (b) {}
	try {
		mainResizeHandler(a, c)
	} catch (b) {}
}
function autoReset() {
	leftOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#lbox_topcenter").outerHeight() + $("#lbox_bottomcenter").outerHeight();
	rightOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#rbox_topcenter").outerHeight() + $("#rbox_bottomcenter").outerHeight();
	middleOverHeight = $("#hbox").outerHeight() + $("#fbox").outerHeight() + $("#mbox_topcenter").outerHeight() + $("#mbox_bottomcenter").outerHeight();
	var a = document.documentElement.clientHeight;
	var c = document.documentElement.clientWidth;
	try {
		var f = a - leftOverHeight - parseInt($("#lbox").css("paddingTop")) - parseInt($("#lbox").css("paddingBottom"));
		$("#bs_left").height(f);
		document.getElementById("frmleft").contentWindow._customHeightSet(f)
	} catch (b) {}
	try {
		var g = a - rightOverHeight - parseInt($("#rbox").css("paddingTop")) - parseInt($("#rbox").css("paddingBottom"));
		$("#bs_right").height(g);
		document.getElementById("frmright").contentWindow._customHeightSet(g)
	} catch (b) {}
	try {
		var d = a - middleOverHeight - parseInt($("#mbox").css("paddingTop")) - parseInt($("#mbox").css("paddingBottom"));
		$("#bs_middle").height(d);
		document.getElementById("frmmiddle").contentWindow._customHeightSet(d)
	} catch (b) {}
	try {
		mainResizeHandler(a, c)
	} catch (b) {}
}
jQuery.jCookie = function(i, b, l, j) {
	if (!navigator.cookieEnabled) {
		return false
	}
	var j = j || {};
	if (typeof(arguments[0]) !== "string" && arguments.length === 1) {
		j = arguments[0];
		i = j.name;
		b = j.value;
		l = j.expires
	}
	i = encodeURI(i);
	if (b && (typeof(b) !== "number" && typeof(b) !== "string" && b !== null)) {
		return false
	}
	var e = j.path ? "; path=" + j.path : "";
	var f = j.domain ? "; domain=" + j.domain : "";
	var d = j.secure ? "; secure" : "";
	var g = "";
	if (b || (b === null && arguments.length == 2)) {
		l = (l === null || (b === null && arguments.length == 2)) ? -1 : l;
		if (typeof(l) === "number" && l != "session" && l !== undefined) {
			var k = new Date();
			k.setTime(k.getTime() + (l * 24 * 60 * 60 * 1000));
			g = ["; expires=", k.toGMTString()].join("")
		}
		document.cookie = [i, "=", encodeURI(b), g, f, e, d].join("");
		return true
	}
	if (!b && typeof(arguments[0]) === "string" && arguments.length == 1 && document.cookie && document.cookie.length) {
		var a = document.cookie.split(";");
		var h = a.length;
		while (h--) {
			var c = a[h].split("=");
			if (jQuery.trim(c[0]) === i) {
				return decodeURI(c[1])
			}
		}
	}
	return false
};

function showProgressBar(e, b) {
	var c = "正在加载中...";
	if (e) {
		c = e
	}
	var a = "simple";
	if (b) {
		if (b == "normal") {
			a = b
		}
	}
	if (a == "simple") {
		top.progressFlag = 2;
		top.showSimpleProgress(c, 0, true, "#ffffff")
	} else {
		top.progressFlag = 1;
		var d = new top.Dialog();
		d.Width = 360;
		d.Height = 70;
		d.Title = c;
		d.InvokeElementId = "progress";
		d.show()
	}
}
function showSimpleProgress(c, b, d, a) {
	$("#bs_right").mask(c, b, d, a)
}
function hideSimpleProgress() {
	$("#bs_right").unmask()
}(function(a) {
	a.fn.mask = function(d, c, e, b) {
		a(this).each(function() {
			if (e == null) {
				e = true
			}
			var f = "#cccccc";
			if (b) {
				f = b
			}
			if (c !== undefined && c > 0 && c != null) {
				var g = a(this);
				g.data("_mask_timeout", setTimeout(function() {
					a.maskElement(g, d, e, f)
				}, c))
			} else {
				a.maskElement(a(this), d, e, f)
			}
		})
	};
	a.fn.unmask = function() {
		a(this).each(function() {
			a.unmaskElement(a(this))
		})
	};
	a.fn.isMasked = function() {
		return this.hasClass("masked")
	};
	a.maskElement = function(f, e, h, c) {
		maskDiv.show();
		var g = Math.round(f.height() / 2 - 30);
		var d = Math.round(f.width() / 2 - 100);
		if (f.data("_mask_timeout") !== undefined) {
			clearTimeout(f.data("_mask_timeout"));
			f.removeData("_mask_timeout")
		}
		if (f.isMasked()) {
			a.unmaskElement(f)
		}
		if (f.css("position") == "static") {
			f.addClass("masked-relative")
		}
		f.addClass("masked");
		maskDiv.css({
			backgroundColor: c
		});
		if (navigator.userAgent.toLowerCase().indexOf("msie") > -1) {
			maskDiv.height(f.height() + parseInt(f.css("padding-top")) + parseInt(f.css("padding-bottom")));
			maskDiv.width(f.width() + parseInt(f.css("padding-left")) + parseInt(f.css("padding-right")))
		}
		if (navigator.userAgent.toLowerCase().indexOf("msie 6") > -1) {
			f.find("select").addClass("masked-hidden")
		}
		if (e !== undefined && e != null) {
			var b = a('<div class="loadmask-msg" style="display:none;"></div>');
			if (h) {
				b.append('<div class="mask_lading">' + e + "</div>")
			} else {
				b.append('<div  class="normal">' + e + "</div>")
			}
			f.append(b);
			b[0].style.top = g + "px";
			b[0].style.left = d + "px";
			b[0].style.display = ""
		}
	};
	a.unmaskElement = function(b) {
		if (b.data("_mask_timeout") !== undefined) {
			clearTimeout(b.data("_mask_timeout"));
			b.removeData("_mask_timeout")
		}
		b.find(".loadmask-msg").remove();
		b.removeClass("masked");
		b.removeClass("masked-relative");
		b.find("select").removeClass("masked-hidden");
		maskDiv.hide()
	}
})(jQuery);
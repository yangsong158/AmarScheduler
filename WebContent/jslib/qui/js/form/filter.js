jQuery.fn.extend({
	filterRender: function() {
		return this.each(function() {
			$(this).empty();
			new jQuery.Filter(this)
		})
	}
});
jQuery.Filter = function(j) {
	var r = $(j);
	var c = 100;
	var m = 22;
	if (r.attr("itemWidth")) {
		c = Number(r.attr("itemWidth"))
	}
	if (r.attr("itemHeight")) {
		m = Number(r.attr("itemHeight"))
	}
	var t = 0;
	if (r.attr("filterWidth")) {
		t = Number(r.attr("filterWidth"));
		r.width(t)
	}
	var w = a();
	var d = "list";
	if (r.attr("dataRoot")) {
		d = r.attr("dataRoot")
	}
	var l = false;
	if (r.attr("multiMode") == "true" || r.attr("multiMode") == true) {
		l = true
	}
	var h = false;
	if (r.attr("showInfo") == "true" || r.attr("showInfo") == true) {
		h = true
	}
	var u = false;
	if (r.attr("showTip") == "true" || r.attr("showTip") == true) {
		u = true
	}
	var i = true;
	if ($(j).attr("disabled")) {
		if ($(j).attr("disabled") == "false" || $(j).attr("disabled") == false) {
			i = true
		} else {
			i = false
		}
	}
	var k = "-1";
	if (r.attr("selectedValue") != null) {
		k = r.attr("selectedValue")
	}
	var b = r.attr("params");
	var x;
	if (b) {
		try {
			x = JSON.parse(b)
		} catch (s) {
			x = [];
			alert("条件过滤器参数格式有误！（提示：json数据的属性和名称必须以双引号包围）")
		}
	} else {
		x = []
	}
	var n = "";
	var q = r.attr("url");
	var v = r.attr("data");
	var g = r.data("data");
	if (g) {
		if (r.attr("groupMode") == true || r.attr("groupMode") == "true") {
			p(r, g)
		} else {
			o(r, g[d])
		}
	} else {
		if (v) {
			try {
				n = JSON.parse(v)
			} catch (s) {
				n = "";
				alert("条件过滤器数据格式有误！（提示：放在标签中的json数据的属性和名称必须以双引号包围）")
			}
			r.data("data", n);
			if (r.attr("groupMode") == true || r.attr("groupMode") == "true") {
				p(r, n)
			} else {
				o(r, n[d])
			}
		} else {
			if (q) {
				$.ajax({
					url: r.attr("url"),
					dataType: "json",
					data: x,
					error: function() {
						alert("条件过滤器数据源出错，请检查url路径")
					},
					success: function(e) {
						r.data("data", e);
						n = e;
						if (r.attr("groupMode") == true || r.attr("groupMode") == "true") {
							p(r, n)
						} else {
							o(r, n[d])
						}
					}
				})
			}
		}
	}
	function a() {
		var e = document.createElement("input");
		var y = $(e);
		y.attr("type", "hidden");
		if (r.attr("name") != null) {
			y.attr("name", r.attr("name"))
		}
		return y
	}
	function p(e, y) {
		l = true;
		var A = 100;
		if (r.attr("groupTitleWidth")) {
			A = Number(r.attr("groupTitleWidth"))
		}
		var z = $('<table class="filterTable"></table>');
		$.each(y[d], function(B, E) {
			var D = $("<tr></tr>");
			var F = $('<td class="left"></td>');
			F.text(E.name);
			F.width(A);
			var C = $('<td class="right"></td>');
			o(C, E[d]);
			D.append(F);
			D.append(C);
			z.append(D)
		});
		e.append(z)
	}
	function o(e, y) {
		var A = $("<ul></ul>");
		e.append(A);
		r.append(w);
		if (!y) {
			return
		}
		$.each(y, function(E, F) {
			var G = $('<li><a class="textSlice"></a></li>');
			G.find("a").each(function() {
				var H;
				if (F.iconClass) {
					H = $("<span></span>");
					H.addClass(F.iconClass);
					H.html(F.key);
					$(this).append(H)
				} else {
					if (F.iconSrc) {
						H = $("<span></span>");
						H.css({
							backgroundImage: "url(" + F.iconSrc + ")",
							backgroundRepeat: "no-repeat",
							backgroundPosition: "0 50%",
							display: "block",
							paddingLeft: "18px"
						});
						H.html(F.key);
						$(this).append(H)
					} else {
						$(this).html(F.key)
					}
				}
				if (u == true) {
					$(this).attr("title", F.key);
					$(this).attr("keepDefaultStyle", "true")
				} else {
					if (h == true) {
						$(this).attr("title", F.key)
					}
				}
				$(this).css({
					backgroundPositionY: "40%",
					backgroundPositionX: c - 15 + "px"
				})
			});
			G.attr("id", F.value);
			G.css({
				width: c,
				height: m,
				lineHeight: m + "px"
			});
			A.append(G);
			G.click(function(H) {
				if (!l) {
					if ($(this).attr("class") == "current") {
						$(this).removeClass("current")
					} else {
						r.find("li:[class=current]").each(function() {
							$(this).removeClass("current")
						});
						$(this).addClass("current")
					}
				} else {
					if ($(this).attr("class") == "current") {
						$(this).removeClass("current")
					} else {
						$(this).addClass("current")
					}
				}
				f()
			})
		});
		A.append('<div class="clear"></div>');
		if (i == false) {
			r.mask("组件被禁用", 0, false, "#ffffff")
		}
		if (k != "-1") {
			var B = k.split(",");
			var D = "";
			var C = "";
			for (var z = 0; z < B.length; z++) {
				r.find("li").each(function() {
					if ($(this).attr("id") == B[z]) {
						$(this).addClass("current");
						D = D + $(this).attr("id") + ",";
						C = C + $(this).text() + ","
					}
				})
			}
			if (D.length > 0) {
				D = D.substring(0, D.length - 1)
			}
			if (C.length > 0) {
				C = C.substring(0, C.length - 1)
			}
			r.attr("relText", C);
			r.attr("relValue", D);
			w.val(D)
		} else {
			r.attr("relText", "");
			r.attr("relValue", "");
			w.val("")
		}
		r.attr("finished", "true")
	}
	function f() {
		var y = "";
		var e = "";
		r.find("li:[class=current]").each(function() {
			y = y + $(this).attr("id") + ",";
			e = e + $(this).text() + ","
		});
		if (y.length > 0) {
			y = y.substring(0, y.length - 1)
		}
		if (e.length > 0) {
			e = e.substring(0, e.length - 1)
		}
		r.attr("relText", e);
		r.attr("relValue", y);
		w.val(y)
	}
};
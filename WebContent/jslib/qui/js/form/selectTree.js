var parentTopHeight;
var broswerFlag;
var sigleSelectionSetting = {
	view: {
		dblClickExpand: false,
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: zTreeSelectItemClick
	}
};
var multiNoGroupSelectionSetting = {
	view: {
		selectedMulti: true,
		showIcon: false,
		showLine: false
	},
	check: {
		enable: true,
		chkboxType: {
			Y: "",
			N: ""
		}
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: zTreeSelectItemClick
	}
};
var multiTreeSelectionSetting = {
	view: {
		selectedMulti: false
	},
	check: {
		enable: true,
		chkboxType: {
			Y: "",
			N: ""
		}
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: zTreeSelectItemClick
	}
};
var multiTreeSelectionSetting2 = {
	view: {
		selectedMulti: false
	},
	check: {
		enable: true,
		chkboxType: {
			Y: "ps",
			N: "ps"
		}
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onClick: zTreeSelectItemClick
	}
};
var asyncSetting;
jQuery.fn.extend({
	selectTreeRender: function(a) {
		return this.each(function() {
			$(this).html("");
			new jQuery.SelectTreeBox(this, a)
		})
	},
	selectTreeAddItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			var c = "treeNodes";
			if ($(this).attr("dataRoot")) {
				c = $(this).attr("dataRoot")
			}
			b[c].push(a);
			$(this).data("data", b);
			$(this).html("");
			new jQuery.SelectTreeBox(this)
		})
	},
	selectTreeRemoveItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			var c = -1;
			var d = "treeNodes";
			if ($(this).attr("dataRoot")) {
				d = $(this).attr("dataRoot")
			}
			$.each(b[d], function(e, f) {
				if (f.id.toString() == a) {
					c = e
				}
			});
			if (c != -1) {
				b[d].splice(c, 1)
			}
			$(this).data("data", b);
			$(this).html("");
			new jQuery.SelectTreeBox(this)
		})
	}
});
var selectTree_id = 1;
jQuery.SelectTreeBox = function(K, M) {
	var q = {};
	q.inputClass = q.inputClass || "selectbox";
	q.containerClass = q.containerClass || "selectbox-tree";
	q.hoverClass = q.hoverClass || "current";
	q.currentClass = q.selectedClass || "selected";
	q.debug = q.debug || false;
	var i = 24;
	var j = 24;
	if (!splitMode) {
		var H = $(window.top.document.getElementById("theme"));
		if (H.attr("selInputHeight") != null) {
			i = Number(H.attr("selInputHeight"))
		}
		if (H.attr("selButtonWidth") != null) {
			j = Number(H.attr("selButtonWidth"))
		}
	}
	selectTree_id++;
	var g = "请选择";
	var m = "0_input";
	var A = "0_button";
	var x = false;
	var N = $(K);
	N.addClass("mainCon");
	if (N.attr("prompt") != null) {
		g = N.attr("prompt")
	}
	var f = w(q);
	var c = $('<ul class="ztree"></ul>');
	c.attr("id", "selectTree" + selectTree_id + "_tree");
	var z = L(q);
	var s = I(q);
	var v;
	v = $("<input type='button' value=' ' class='selBtn'/>");
	var a = false;
	if (N.attr("multiMode") != null) {
		if (N.attr("multiMode") == "true" || N.attr("multiMode") == true) {
			a = true;
			v.addClass("selBtnMuiti");
			if (N.attr("noGroup") == "true" || N.attr("noGroup") == true) {
				c.addClass("noGroupZtree")
			} else {
				c.addClass("multiSelectZtree")
			}
		} else {
			a = false
		}
	}
	if (N.attr("disabled") == "disabled" || N.attr("disabled") == "true" || N.attr("disabled") == true) {
		v.attr("disabled", true);
		if (a == true) {
			v.addClass("selBtn_disabledMuiti")
		} else {
			v.addClass("selBtn_disabled")
		}
		z.addClass("selectbox_disabled")
	}
	v.attr("id", "selectTree" + selectTree_id + "_button");
	var o = 99;
	if (N.attr("selWidth") != null) {
		o = Number(N.attr("selWidth")) - 22
	}
	z.width(o);
	var R = $('<table cellspacing="0" cellpadding="0" style="border-style:none;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"></td><td class="ali01" style="border-style:none;;padding:0;margin:0;"></td></tr></table>');
	R.find("td").eq(0).append(z);
	R.find("td").eq(1).append(v);
	N.append(R);
	N.append(f);
	N.append(s);
	f.append(c);
	var G = "";
	if (N.attr("selectedValue")) {
		G = N.attr("selectedValue")
	}
	var t = false;
	if (N.attr("editable") != null) {
		if (N.attr("editable") == "true") {
			t = true
		} else {
			t = false
		}
	}
	f.hide();
	var D = "treeNodes";
	if (N.attr("dataRoot")) {
		D = N.attr("dataRoot")
	}
	var p = N.attr("params");
	var E;
	if (p) {
		try {
			E = JSON.parse(p)
		} catch (P) {
			E = [];
			alert("树形下拉框参数格式有误！（提示：json数据的属性和名称必须以双引号包围）")
		}
	} else {
		E = []
	}
	var d = "";
	var J = N.attr("url");
	var B = N.attr("data");
	var n = N.data("data");
	if (N.attr("asyncMode") == "true" || N.attr("asyncMode") == true) {
		var y = N.attr("autoParam");
		var Q;
		if (y) {
			try {
				Q = JSON.parse(y)
			} catch (P) {
				Q = [];
				alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
			}
		} else {
			Q = ["id", "name"]
		}
		r(J, Q, E)
	} else {
		if (n) {
			F(n)
		} else {
			if (B) {
				try {
					d = JSON.parse(B)
				} catch (P) {
					d = "";
					alert("树形下拉框data属性设置的数据格式有误！（提示：放在标签中的json数据的属性和名称必须以双引号包围）")
				}
				N.data("data", d);
				F(d)
			} else {
				if (J) {
					$.ajax({
						url: N.attr("url"),
						dataType: "json",
						data: E,
						error: function() {
							alert("树形下拉框数据源出错，请检查url路径")
						},
						success: function(e) {
							N.data("data", e);
							d = e;
							F(e)
						}
					})
				}
			}
		}
	}
	if (!t) {
		z.css({
			cursor: "pointer"
		});
		z.click(function(e) {
			m = $(e.target).attr("id");
			C();
			depth++;
			N.css({
				zIndex: depth
			});
			if (f.attr("hasfocus") == 0) {
				u()
			} else {
				b()
			}
		})
	} else {
		z.css({
			cursor: "text"
		});
		z.change(function() {
			N.attr("editValue", $(this).val());
			s.val($(this).val())
		})
	}
	v.click(function(e) {
		A = $(e.target).attr("id");
		C();
		depth++;
		N.css({
			zIndex: depth
		});
		if (f.attr("hasfocus") == 0) {
			u()
		} else {
			b()
		}
	});

	function C() {
		f.css({
			overflowY: "visible",
			overflowX: "visible"
		});
		f.width("");
		f.height("");
		var e = 200;
		e = window.document.documentElement.clientHeight - (N.offset().top - $(window).scrollTop()) - 30;
		var U;
		if (!N.attr("boxWidth")) {
			U = f.width()
		}
		f.css({
			overflowY: "auto",
			overflowX: "hidden"
		});
		if (!N.attr("boxWidth")) {
			f.width(U)
		} else {
			f.width(Number(N.attr("boxWidth")))
		}
		var T = 0;
		if (N.attr("boxHeight")) {
			T = Number(N.attr("boxHeight"))
		}
		if (T != 0) {
			f.height(T);
			if (N.attr("openDirection") == "top") {
				f.css({
					top: -T
				})
			} else {
				if (N.attr("openDirection") == "bottom") {
					f.css({
						top: i
					})
				} else {
					if (e < T) {
						if (N.offset().top > T) {
							f.css({
								top: -T
							})
						} else {
							if (e < 100 && N.offset().top > e && N.offset().top > 100) {
								f.css({
									top: -T
								})
							} else {
								f.css({
									top: i
								})
							}
						}
					} else {
						f.css({
							top: i
						})
					}
				}
			}
		} else {
			if (N.attr("openDirection") == "top") {
				if (N.offset().top > f.height()) {
					f.css({
						top: -f.height()
					})
				} else {
					f.height($mainCon.offset().top);
					f.css({
						top: -$mainCon.offset().top
					})
				}
			} else {
				if (N.attr("openDirection") == "bottom") {
					if (e < f.height()) {
						f.css({
							top: i
						});
						f.height(e)
					} else {
						f.css({
							top: i
						})
					}
				} else {
					if (e < f.height()) {
						if (N.offset().top > f.height()) {
							f.css({
								top: -f.height()
							})
						} else {
							if (e < 100 && N.offset().top > e && N.offset().top > 100) {
								f.height(N.offset().top);
								f.css({
									top: -N.offset().top
								})
							} else {
								f.css({
									top: i
								});
								f.height(e)
							}
						}
					} else {
						f.css({
							top: i
						})
					}
				}
			}
		}
		if (!N.attr("boxWidth")) {
			if (f.width() < o + j) {
				f.width(o + j)
			}
		}
	}
	function k() {
		var e = $("<div></div>");
		e.addClass("mainCon");
		return e
	}
	function w(e) {
		var T = $("<div></div>");
		T.attr("id", "selectTree" + selectTree_id + "_container");
		T.addClass(e.containerClass);
		T.attr("hasfocus", 0);
		return T
	}
	function L(T) {
		var e = document.createElement("input");
		var V = $(e);
		V.attr("id", "selectTree" + selectTree_id + "_input");
		V.attr("type", "text");
		V.addClass(T.inputClass);
		V.attr("autocomplete", "off");
		var U = false;
		if (N.attr("editable") != null) {
			if (N.attr("editable") == "true") {
				U = true
			} else {
				U = false
			}
		}
		if (!U) {
			V.attr("readonly", "readonly")
		} else {
			V.attr("readonly", false)
		}
		if (N.attr("disabled") == "disabled" || N.attr("disabled") == "true" || N.attr("disabled") == true) {
			V.attr("disabled", true);
			V.addClass("inputDisabled")
		}
		return V
	}
	function I(T) {
		var e = document.createElement("input");
		var U = $(e);
		U.attr("type", "hidden");
		if (N.attr("name") != null) {
			U.attr("name", N.attr("name"))
		}
		return U
	}
	function l(T, e) {
		N.attr("relText", T);
		N.attr("relValue", e);
		s.val(e);
		z.val(T);
		if (t == "true" || t == true) {
			N.attr("editValue", z.val());
			s.val(z.val())
		}
		N.focus();
		return true
	}
	function F(U) {
		if (!U) {
			return
		}
		if (a == true) {
			for (var X = 0; X < U[D].length; X++) {
				U[D][X].checked = false
			}
			if (G == "") {
				z.val(g);
				N.attr("relText", g);
				N.attr("relValue", "");
				N.data("selectedNodes", null);
				s.val("")
			} else {
				var ae = G.split(",");
				var W = "";
				for (var Z = 0; Z < ae.length; Z++) {
					for (var Y = 0; Y < U[D].length; Y++) {
						if (U[D][Y].id.toString() == ae[Z]) {
							U[D][Y].checked = true;
							W = W + U[D][Y].name + ",";
							continue
						}
					}
				}
				if (W.length > 0) {
					W = W.substring(0, W.length - 1)
				}
				l(W, G);
				if (N.attr("showInfo") == "false" || N.attr("showInfo") == false) {} else {
					z.attr("title", W);
					try {
						addTooltip(z[0])
					} catch (ab) {}
				}
			}
			if (N.attr("noGroup") == "true" || N.attr("noGroup") == true) {
				if (M) {
					$.fn.zTree.init(c, M, U[D])
				} else {
					$.fn.zTree.init(c, multiNoGroupSelectionSetting, U[D])
				}
			} else {
				if (N.attr("allSelectable") == "true" || N.attr("allSelectable") == true) {
					if (M) {
						$.fn.zTree.init(c, M, U[D])
					} else {
						$.fn.zTree.init(c, multiTreeSelectionSetting2, U[D])
					}
				} else {
					if (M) {
						$.fn.zTree.init(c, M, U[D])
					} else {
						$.fn.zTree.init(c, multiTreeSelectionSetting, U[D])
					}
				}
			}
			var ac = $.fn.zTree.getZTreeObj(c.attr("id"));
			if (ac) {
				var ad = ac.getCheckedNodes(true);
				N.data("selectedNodes", ad)
			}
		} else {
			if (M) {
				$.fn.zTree.init(c, M, U[D])
			} else {
				$.fn.zTree.init(c, sigleSelectionSetting, U[D])
			}
			if (G == "") {
				z.val(g);
				N.attr("relText", g);
				N.attr("relValue", "");
				N.data("selectedNode", null);
				s.val("")
			} else {
				N.attr("relValue", G);
				s.val(G);
				var T = $.fn.zTree.getZTreeObj(c.attr("id"));
				var V = T.transformToArray(T.getNodes());
				for (var aa = 0; aa < V.length; aa++) {
					if (V[aa].id.toString() == G) {
						T.selectNode(V[aa]);
						N.attr("relText", V[aa].name);
						N.data("selectedNode", V[aa]);
						z.val(V[aa].name)
					}
				}
			}
		}
		if (t == true) {
			if (G == "") {
				N.attr("editValue", g)
			} else {
				N.attr("editValue", N.attr("relText"))
			}
		}
	}
	function r(Z, V, Y) {
		if (a == true) {
			if (G == "") {
				z.val(g);
				N.attr("relText", g);
				N.attr("relValue", "");
				N.data("selectedNodes", null);
				s.val("")
			} else {
				alert("异步加载设置selectedValue无效，需手动设置组件的relText和relValue属性。")
			}
			asyncSetting = {
				async: {
					enable: true,
					dataType: "JSON",
					dataName: D,
					url: Z,
					autoParam: V,
					otherParam: Y
				},
				view: {
					selectedMulti: false
				},
				check: {
					enable: true,
					chkboxType: {
						Y: "",
						N: ""
					}
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: zTreeSelectItemClick
				}
			};
			if (M) {
				$.fn.zTree.init(c, M)
			} else {
				$.fn.zTree.init(c, asyncSetting)
			}
			var W = $.fn.zTree.getZTreeObj(c.attr("id"));
			if (W) {
				var e = W.getCheckedNodes(true);
				N.data("selectedNodes", e)
			}
		} else {
			asyncSetting = {
				async: {
					enable: true,
					dataType: "JSON",
					dataName: D,
					url: Z,
					autoParam: V,
					otherParam: Y
				},
				view: {
					dblClickExpand: false,
					selectedMulti: false
				},
				data: {
					simpleData: {
						enable: true
					}
				},
				callback: {
					onClick: zTreeSelectItemClick
				}
			};
			if (M) {
				$.fn.zTree.init(c, M)
			} else {
				$.fn.zTree.init(c, asyncSetting)
			}
			if (G == "") {
				z.val(g);
				N.attr("relText", g);
				N.attr("relValue", "");
				N.data("selectedNode", null);
				s.val("")
			} else {
				N.attr("relValue", G);
				s.val(G);
				var U = $.fn.zTree.getZTreeObj(c.attr("id"));
				var T = U.transformToArray(U.getNodes());
				for (var X = 0; X < T.length; X++) {
					if (T[X].id.toString() == G) {
						U.selectNode(T[X]);
						N.attr("relText", T[X].name);
						N.data("selectedNode", T[X]);
						z.val(T[X].name)
					}
				}
			}
		}
		if (t == true) {
			if (G == "") {
				N.attr("editValue", g)
			} else {
				N.attr("editValue", N.attr("relText"))
			}
		}
	}
	function b() {
		f.attr("hasfocus", 0);
		f.hide();
		$("body").unbind("mousedown", O);
		if (a == true) {
			var V = $.fn.zTree.getZTreeObj(c.attr("id"));
			if (V) {
				var U = V.getCheckedNodes(true);
				var T = [];
				var Y = "";
				var X = "";
				for (var W = 0; W < U.length; W++) {
					if (N.attr("exceptParent") == "true" || N.attr("exceptParent") == true) {
						if (U[W].isParent) {
							continue
						}
					}
					T.push(U[W]);
					Y = Y + U[W].name + ",";
					X = X + U[W].id + ","
				}
				N.data("selectedNodes", T);
				if (Y.length > 0) {
					Y = Y.substring(0, Y.length - 1)
				}
				if (X.length > 0) {
					X = X.substring(0, X.length - 1)
				}
				if (Y == "") {
					Y = g
				}
				l(Y, X);
				if (Y == g) {
					z.attr("title", " ")
				} else {
					z.attr("title", Y)
				}
				try {
					addTooltip(z[0])
				} catch (Z) {}
			}
		}
		try {
			N.trigger("change")
		} catch (Z) {}
	}
	function u() {
		f.attr("hasfocus", 1);
		depth++;
		N.css({
			zIndex: depth
		});
		f.show();
		$("body").bind("mousedown", O)
	}
	function O(e) {
		if (f.attr("hasfocus") == 0) {} else {
			if ($(e.target).attr("id") == m || $(e.target).attr("id") == A || $(e.target).parent().attr("class") == "ztree" || $(e.target).attr("class") == "ztree" || $(e.target).parents(".ztree").length > 0 || $(e.target).attr("class") == "selectbox-tree") {
				if ($(e.target).parents(".ztree").length > 0) {
					setTimeout(function() {
						C()
					}, 500)
				}
			} else {
				b()
			}
		}
	}
	function h() {
		return N.val()
	}
	function S() {
		return z.val()
	}
};

function getPosition(b, c) {
	for (var a = 0; a < c.length; a++) {
		if (b == c[a]) {
			return a;
			break
		}
	}
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};

function zTreeSelectItemClick(b, d, i) {
	var c = $("#" + d).parents(".selectTree");
	var a = $("#" + d).parents(".mainCon").find('input[type="hidden"]');
	var h = $.fn.zTree.getZTreeObj(d);
	if (c.attr("multiMode") == "true" || c.attr("multiMode") == true) {
		if (i.clickExpand == true || i.clickExpand == "true") {
			if (c.attr("allSelectable") == "true" || c.attr("allSelectable") == true) {
				h.checkNode(i, "", true);
				h.expandNode(i, true)
			} else {
				h.expandNode(i)
			}
		} else {
			h.checkNode(i)
		}
	} else {
		if (i.clickExpand == true || i.clickExpand == "true") {
			h.expandNode(i)
		} else {
			var g;
			g = $("#" + d).parents(".mainCon").find("input[class*=selectbox]");
			g.val(i.name);
			c.attr("relText", i.name);
			c.attr("relValue", i.id);
			c.data("selectedNode", i);
			a.val(i.id);
			if (c.attr("editable") == "true" || c.attr("editable") == true) {
				c.attr("editValue", g.val());
				a.val(g.val())
			}
			c.focus();
			var j = $("#" + d).parents(".mainCon").find("div[class=selectbox-tree]");
			j.hide();
			j.attr("hasfocus", 0);
			try {
				c.trigger("change")
			} catch (f) {}
		}
	}
}
function zTreeSelectAddItem(e, c, g, d) {
	var b = $.fn.zTree.getZTreeObj(e.find("ul").eq(0).attr("id"));
	var a = b.transformToArray(b.getNodes());
	for (var f = 0; f < a.length; f++) {
		if (a[f].id == c) {
			b.addNodes(a[f], {
				id: g,
				pId: a[f].id,
				name: d
			})
		}
	}
}
function zTreeSelectRemoveItem(c, e) {
	var b = $.fn.zTree.getZTreeObj(c.find("ul").eq(0).attr("id"));
	var a = b.transformToArray(b.getNodes());
	for (var d = 0; d < a.length; d++) {
		if (a[d].id == e) {
			b.removeNode(a[d])
		}
	}
};
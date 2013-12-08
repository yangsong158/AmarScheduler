jQuery.fn.extend({
	listerTreeRender: function() {
		this.each(function() {
			$(this).html(" ");
			new jQuery.ListerTree(this)
		})
	},
	listerTreeSelectValue: function(e) {
		var b = $(this).data("data");
		var a = e.split(",");
		if (b.fromList) {
			for (var d = 0; d < a.length; d++) {
				var c = -1;
				$.each(b.fromList, function(f, g) {
					if (g.id == a[d]) {
						if (b.toList) {
							b.toList.push(b.fromList[f]);
							c = f
						}
					}
				});
				if (c != -1) {
					b.fromList.splice(c, 1)
				}
			}
		}
		$(this).data("data", b);
		$(this).data("selectedNodes", b.toList);
		$(this).html("");
		new jQuery.ListerTree(this)
	},
	listerTreeUnSelectValue: function(e) {
		var b = $(this).data("data");
		var a = e.split(",");
		if (b.toList) {
			for (var d = 0; d < a.length; d++) {
				var c = -1;
				$.each(b.toList, function(f, g) {
					if (g.id == a[d]) {
						if (b.fromList) {
							b.fromList.push(b.toList[f]);
							c = f
						}
					}
				});
				if (c != -1) {
					b.toList.splice(c, 1)
				}
			}
		}
		$(this).data("data", b);
		$(this).data("selectedNodes", b.toList);
		$(this).html("");
		new jQuery.ListerTree(this)
	},
	listerTreeSetValue: function(f) {
		var b = $(this).data("data");
		var a = f.split(",");
		if (b.toList) {
			var e = b.toList.length;
			for (var d = 0; d < e; d++) {
				$.each(b.toList, function(g, h) {
					if (g == d) {
						if (b.fromList) {
							b.fromList.push(b.toList[g])
						}
					}
				})
			}
			b.toList.splice(0, e)
		}
		if (b.fromList) {
			for (var d = 0; d < a.length; d++) {
				var c = -1;
				$.each(b.fromList, function(g, h) {
					if (h.id == a[d]) {
						if (b.toList) {
							b.toList.push(b.fromList[g]);
							c = g
						}
					}
				});
				if (c != -1) {
					b.fromList.splice(c, 1)
				}
			}
		}
		$(this).data("data", b);
		$(this).data("selectedNodes", b.toList);
		$(this).html("");
		new jQuery.ListerTree(this)
	},
	listerTreeAddItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			b.fromList.push(a);
			$(this).data("data", b);
			$(this).data("selectedNodes", b.toList);
			$(this).html("");
			new jQuery.ListerTree(this)
		})
	},
	listerTreeRemoveItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			var c = -1;
			$.each(b.fromList, function(d, e) {
				if (e.id.toString() == a) {
					c = d
				}
			});
			if (c != -1) {
				b.fromList.splice(c, 1)
			}
			$(this).data("data", b);
			$(this).data("selectedNodes", b.toList);
			$(this).html("");
			new jQuery.ListerTree(this)
		})
	}
});
var listerTree_id = 1;
jQuery.ListerTree = function(a) {
	listerTree_id++;
	var m = G();
	var g = true;
	if ($(a).attr("disabled") != null) {
		if ($(a).attr("disabled") == "false" || $(a).attr("disabled") == false) {
			g = true
		} else {
			g = false
		}
	}
	var v = $(a);
	var P = $('<ul class="ztree dbSelectionMode"></ul>');
	var k = $('<ul class="ztree dbSelectionMode"></ul>');
	P.attr("id", "listerTree" + listerTree_id + "_from");
	k.attr("id", "listerTree" + listerTree_id + "_to");
	if ($(a).attr("listerHeight")) {
		P.height(Number($(a).attr("listerHeight")));
		k.height(Number($(a).attr("listerHeight")))
	} else {
		P.height(200);
		k.height(200)
	}
	var A = $("<div></div>");
	var B = $("<div></div>");
	if ($(a).attr("fromTitle") != null) {
		A.html($(a).attr("fromTitle"))
	} else {
		A.html("未选列表")
	}
	if ($(a).attr("toTitle") != null) {
		B.html($(a).attr("toTitle"))
	} else {
		B.html("已选列表")
	}
	var K = $("<div></div>").append(A).append(P);
	var J = $("<div></div>").append(B).append(k);
	if ($(a).attr("listerWidth")) {
		K.width(Number($(a).attr("listerWidth")));
		J.width(Number($(a).attr("listerWidth")))
	} else {
		K.width(200);
		J.width(200)
	}
	var I = $('<div class="listBtn"></div>');
	var o = $('<input type="button" value="全选&gt;&gt;" class="button"/>');
	o.bind("click", function() {
		L()
	});
	I.append(o);
	I.append("<br/><br/>");
	var l = $('<input type="button" value="&lt;&lt;还原" class="button">');
	l.bind("click", function() {
		M()
	});
	I.append(l);
	if ($(a).attr("asyncMode") == true || $(a).attr("asyncMode") == "true") {
		o.attr("disabled", true);
		l.attr("disabled", true)
	}
	var R = $('<table cellspacing="0" cellpadding="0" style="border-style:none;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"></td><td class="ali02" style="border-style:none;padding-left:5px;padding-right:5px;margin:0;"></td><td class="ali01" style="border-style:none;padding:0;margin:0;"></td></tr></table>');
	R.find("td").eq(0).append(K);
	R.find("td").eq(1).append(I);
	R.find("td").eq(2).append(J);
	$(v).append(R);
	$(v).width(R.width());
	if (g == false) {
		o.attr("disabled", "true");
		l.attr("disabled", "true");
		$(v).mask("组件被禁用", 0, false, "#ffffff")
	}
	o.buttonInputRender();
	l.buttonInputRender();
	$(v).append(m);
	var z = "treeNodes";
	if ($(a).attr("dataRoot")) {
		z = $(a).attr("dataRoot")
	}
	var E = "-1";
	if ($(a).attr("selectedValue") != null) {
		E = $(a).attr("selectedValue")
	}
	var j = $(a).attr("params");
	var C;
	if (j) {
		try {
			C = JSON.parse(j)
		} catch (N) {
			C = [];
			alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
		}
	} else {
		C = []
	}
	var c = "";
	var H = $(a).attr("url");
	var y = $(a).attr("data");
	var i = $(a).data("data");
	if ($(a).attr("asyncMode") == "true" || $(a).attr("asyncMode") == true) {
		var u = $(a).attr("autoParam");
		var Q;
		if (u) {
			try {
				Q = JSON.parse(u)
			} catch (N) {
				Q = [];
				alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
			}
		} else {
			Q = ["id", "name"]
		}
		n(H, Q, C)
	} else {
		if (i) {
			c = i;
			if (E == "-1") {
				D(i)
			} else {
				D(w(i, E))
			}
		} else {
			if (y) {
				try {
					c = JSON.parse(y)
				} catch (N) {
					c = "";
					alert("树形双选器参数格式有误！（提示：json数据key与value必须以双引号包围）")
				}
				if (E == "-1") {
					D(c)
				} else {
					D(w(c, E))
				}
				$(a).data("data", c)
			} else {
				if (H) {
					$.ajax({
						url: $(a).attr("url"),
						dataType: "json",
						data: C,
						error: function() {
							alert("树形双选器数据源出错，请检查url路径")
						},
						success: function(e) {
							c = e;
							$(a).data("data", e);
							$(a).data("selectedNodes", e.toList);
							if (E == "-1") {
								D(e)
							} else {
								D(w(e, E))
							}
						}
					})
				}
			}
		}
	}
	function w(S, W) {
		if (!S) {
			return
		}
		var e = W.split(",");
		if (S.toList) {
			var V = S.toList.length;
			for (var U = 0; U < V; U++) {
				$.each(S.toList, function(X, Y) {
					if (X == U) {
						if (S.fromList) {
							S.fromList.push(S.toList[X])
						}
					}
				})
			}
			S.toList.splice(0, V)
		}
		if (S.fromList) {
			for (var U = 0; U < e.length; U++) {
				var T = -1;
				$.each(S.fromList, function(X, Y) {
					if (Y.id == e[U]) {
						if (S.toList) {
							S.toList.push(S.fromList[X]);
							T = X
						}
					}
				});
				if (T != -1) {
					S.fromList.splice(T, 1)
				}
			}
		}
		return S
	}
	var b;
	var f;
	var h;

	function t() {
		b = {
			view: {
				addHoverDom: r,
				removeHoverDom: p,
				selectedMulti: false
			},
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false,
				drag: {
					isCopy: false,
					prev: false,
					inner: false,
					next: false
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: F,
				beforeDrop: d,
				onDrop: q
			}
		};
		f = {
			edit: {
				enable: true,
				showRenameBtn: false,
				removeTitle: "反选",
				drag: {
					isCopy: false,
					prev: false,
					next: false
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: F,
				beforeDrop: d,
				beforeRemove: s
			}
		}
	}
	function O(e) {
		if (!e) {
			return
		}
		if (e.fromList) {
			$.fn.zTree.init(P, b, e.fromList)
		}
		if (e.toList) {
			$.fn.zTree.init(k, f, e.toList)
		}
		$(a).attr("relValue", x());
		m.val(x())
	}
	function D(e) {
		if (!e) {
			return
		}
		t();
		O(e)
	}
	function n(T, e, S) {
		h = {
			async: {
				enable: true,
				dataType: "JSON",
				dataName: z,
				url: T,
				autoParam: e,
				otherParam: S
			},
			view: {
				addHoverDom: r,
				removeHoverDom: p,
				selectedMulti: false
			},
			edit: {
				enable: true,
				showRemoveBtn: false,
				showRenameBtn: false,
				drag: {
					isCopy: false,
					prev: false,
					inner: false,
					next: false
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: F,
				beforeDrop: d,
				onDrop: q
			}
		};
		f = {
			edit: {
				enable: true,
				showRenameBtn: false,
				drag: {
					isCopy: false,
					prev: false,
					next: false
				}
			},
			data: {
				simpleData: {
					enable: true
				}
			},
			callback: {
				beforeDrag: F,
				beforeDrop: d,
				beforeRemove: s
			}
		};
		$.fn.zTree.init(P, h);
		$.fn.zTree.init(k, f, "");
		$(a).attr("relValue", x());
		m.val(x())
	}
	function G() {
		var e = $('<input type="hidden">');
		if ($(a).attr("name") != null) {
			e.attr("name", $(a).attr("name"))
		}
		return e
	}
	function F(U, T) {
		for (var S = 0, e = T.length; S < e; S++) {
			if (T[S].drag == false || T[S].drag == "false") {
				return false
			}
		}
		return true
	}
	function d(T, S, U, e) {
		return U ? U.drop !== false : true
	}
	function q(S, U, T, V, e) {
		$(a).attr("relValue", x());
		m.val(x());
		$(a).trigger("itemClick")
	}
	function r(V, U) {
		var X = $.fn.zTree.getZTreeObj(P.attr("id"));
		var W = $.fn.zTree.getZTreeObj(k.attr("id"));
		var e = $("#" + U.tId + "_span");
		if (U.oldParentId == null || U.oldParentId == "null" || U.drag == "false" || U.drag == false || U.editNameFlag || $("#addBtn_" + U.id).length > 0) {
			return
		}
		var S = "<span class='zbutton add' id='addBtn_" + U.id + "' title='选中' onfocus='this.blur();'></span>";
		e.append(S);
		var T = $("#addBtn_" + U.id);
		if (T) {
			T.bind("click", function() {
				X.removeNode(U);
				W.addNodes(null, {
					id: U.id,
					parentId: U.parentId,
					name: U.name,
					drop: false,
					icon: U.icon,
					oldParentId: U.oldParentId
				});
				$(a).attr("relValue", x());
				m.val(x());
				$(a).trigger("itemClick");
				return false
			})
		}
	}
	function p(S, e) {
		$("#addBtn_" + e.id).unbind().remove()
	}
	function s(S, e) {
		var T = $.fn.zTree.getZTreeObj(k.attr("id"));
		T.selectNode(e);
		setTimeout(function() {
			T.removeNode(e);
			var V = $.fn.zTree.getZTreeObj(P.attr("id"));
			var U = V.getNodeByParam("id", e.oldParentId);
			if (U) {
				if (!U.isParent) {
					V.addNodes(U, {
						id: 9999,
						parentId: U.id,
						name: "无效数据",
						drop: false,
						icon: e.icon,
						oldParentId: e.oldParentId
					})
				}
				V.addNodes(U, {
					id: e.id,
					parentId: U.id,
					name: e.name,
					drop: false,
					icon: e.icon,
					oldParentId: e.oldParentId
				})
			} else {
				V.addNodes(null, {
					id: e.id,
					parentId: e.oldParentId,
					name: e.name,
					drop: false,
					icon: e.icon,
					oldParentId: e.oldParentId
				})
			}
			$(a).attr("relValue", x());
			m.val(x());
			$(a).trigger("itemClick")
		}, 100);
		return false
	}
	function L() {
		if (!c) {
			return
		}
		$.fn.zTree.init(P, b, c.fromList);
		$.fn.zTree.init(k, f, c.toList);
		var U = $.fn.zTree.getZTreeObj(P.attr("id"));
		var T = $.fn.zTree.getZTreeObj(k.attr("id"));
		for (var e = 0; e < c.fromList.length; e++) {
			if (c.fromList[e].oldParentId) {
				if (c.fromList[e].drag != false && c.fromList[e].drag != "false") {
					var S = U.getNodeByParam("id", c.fromList[e].id);
					U.removeNode(S);
					T.addNodes(null, c.fromList[e])
				}
			}
		}
		$(a).attr("relValue", x());
		m.val(x());
		$(a).trigger("itemClick")
	}
	function M() {
		if (!c) {
			return
		}
		O(w(c, ""));
		$(a).trigger("itemClick")
	}
	function x() {
		var V = $.fn.zTree.getZTreeObj(k.attr("id"));
		if (!V) {
			return
		}
		var e = V.getNodes();
		$(a).data("selectedNodes", e);
		var T = "";
		var U = "";
		for (var S = 0; S < e.length; S++) {
			T += "," + e[S].id;
			U += "," + e[S].name
		}
		if (T.length > 0) {
			T = T.substring(1)
		}
		if (U.length > 0) {
			U = U.substring(1)
		}
		$(a).attr("relText", U);
		return T
	}
	return this
};
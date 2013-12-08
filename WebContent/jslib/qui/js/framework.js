var parentTopHeight;
var parentBottomHeight;
var parentTopHeight_left;
var parentBottomHeight_left;
var parentTopHeight_middle;
var parentBottomHeight_middle;
var fixHeight;
var skinName;
var themeColor = "blue";
var broswerFlag;
var fontSize = 12;
var prePath = "../../";
var exitVtab = 0;
var vtabIdx = 0;
var hasIframe = 0;
var parentScrollHeight;
var boxWhiteBg = false;
var splitMode = false;
var positionTarget = "";
var box4Custom = false;
var scrollerX = false;
var autoGetSkin = true;
var autoFormat = true;
var autoRender = true;
var boxIe6Flag = 0;
var boxIe7Flag = 0;
var isHeadFixMode = 0;
var headFixExcude = 0;
var headFixExcude2 = 0;
var cResizeTimer = null;
var depth = 500;
$(function() {
	$.ajaxSetup({
		cache: false
	});
	$("body").bind("click", function() {
		try {
			top.iframeClickHandler()
		} catch (i) {}
	});
	if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
		var g = window.navigator.userAgent.substring(30, 33);
		if (g == "6.0") {
			broswerFlag = "IE6"
		} else {
			if (g == "7.0") {
				broswerFlag = "IE7"
			} else {
				if (g == "8.0") {
					broswerFlag = "IE8"
				} else {
					if (g == "9.0") {
						broswerFlag = "IE9"
					} else {
						if (g == "10.") {
							broswerFlag = "IE10"
						}
					}
				}
			}
		}
	} else {
		if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
			broswerFlag = "Firefox"
		} else {
			if (window.navigator.userAgent.indexOf("Opera") >= 0) {
				broswerFlag = "Opera"
			} else {
				if (window.navigator.userAgent.indexOf("Safari") >= 1) {
					broswerFlag = "Safari"
				} else {
					broswerFlag = "Other"
				}
			}
		}
	}
	var a;
	if ($("#skin").attr("prePath") != null) {
		prePath = $("#skin").attr("prePath")
	}
	if ($("#skin").attr("splitMode") == true || $("#skin").attr("splitMode") == "true") {
		splitMode = true
	} else {
		try {
			var f = top.document.getElementById("theme")
		} catch (d) {
			if ($("body").attr("leftFrame") != "true") {
				alert("非IE浏览器本地打开时会产生跨域问题，要把此框架发布到web服务目录下访问。如果要跨域访问，请使用框架的分离模式。")
			}
			return
		}
		var b = $(window.top.document.getElementById("theme"));
		var h = $(window.top.document.getElementById("skin"));
		if (b.attr("autoGetSkin") == false || b.attr("autoGetSkin") == "false") {
			autoGetSkin = false
		}
		if (b.attr("autoFormat") == false || b.attr("autoFormat") == "false") {
			autoFormat = false
		}
		if (b.attr("autoRender") == false || b.attr("autoRender") == "false") {
			autoRender = false
		}
		if ($("#skin").attr("autoRender") == false || $("#skin").attr("autoRender") == "false") {
			autoRender = false
		}
		if (b.attr("box1WhiteBg") == true || b.attr("box1WhiteBg") == "true") {
			boxWhiteBg = true
		}
		if (b.attr("box4Custom") == true || b.attr("box4Custom") == "true") {
			box4Custom = true
		}
		if (b.attr("scrollerX") == true || b.attr("scrollerX") == "true") {
			scrollerX = true
		}
		if (b.attr("positionTarget") != null) {
			positionTarget = b.attr("positionTarget")
		}
		if (b.attr("href") == null) {
			skinName = "system/layout/skin/";
			themeColor = "blue"
		} else {
			skinName = h.attr("skinPath");
			themeColor = b.attr("themeColor")
		}
	}
	if (autoGetSkin == true && splitMode == false) {
		if (b.attr("debug") == "true" || b.attr("debug") == true) {
			if (broswerFlag == "IE6" || broswerFlag == "IE7") {
				if (b.attr("href") == "") {} else {
					$.ajax({
						url: prePath + "libs/skins/" + themeColor + "/style.css",
						error: function() {
							if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
								alert("导航页面无法通过路径：" + prePath + "libs/skins/" + themeColor + "/style.css加载CSS，请检查prePath和主页的themeColor设置的是否正确。FireFox浏览器请把此框架发布到web服务目录下访问。")
							} else {
								alert("内容页面无法通过路径：" + prePath + "libs/skins/" + themeColor + "/style.css加载CSS，请检查prePath和主页的themeColor设置的是否正确。FireFox浏览器请把此框架发布到web服务目录下访问。")
							}
						},
						success: function() {
							if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
								alert("导航页面的prePath配置成功，组件主题风格已成功加载！")
							} else {
								alert("内容页面的prePath配置成功，组件主题风格已成功加载！")
							}
							$.ajax({
								url: prePath + skinName + "style.css",
								error: function() {
									if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
										alert("导航页面无法通过路径：" + prePath + skinName + "style.css加载CSS，请检查主页的skinPath设置的是否正确。")
									} else {
										alert("内容页面无法通过路径：" + prePath + skinName + "style.css加载CSS，请检查主页的skinPath设置的是否正确。")
									}
								},
								success: function() {
									if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
										alert("主页的skinPath配置成功！")
									} else {
										alert("主页的skinPath配置成功！")
									}
								}
							})
						}
					})
				}
			} else {
				if (b.attr("href") == null) {} else {
					$.ajax({
						url: prePath + "libs/skins/" + themeColor + "/style.css",
						error: function() {
							if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
								alert("导航页面无法通过路径：" + prePath + "libs/skins/" + themeColor + "/style.css加载CSS，请检查prePath和主页的themeColor设置的是否正确。FireFox浏览器请把此框架发布到web服务目录下访问。")
							} else {
								alert("内容页面无法通过路径：" + prePath + "libs/skins/" + themeColor + "/style.css加载CSS，请检查prePath和主页的themeColor设置的是否正确。FireFox浏览器请把此框架发布到web服务目录下访问。")
							}
						},
						success: function() {
							if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
								alert("导航页面的prePath配置成功，组件主题风格已成功加载！")
							} else {
								alert("内容页面的prePath配置成功，组件主题风格已成功加载！")
							}
							$.ajax({
								url: prePath + skinName + "style.css",
								error: function() {
									if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
										alert("导航页面无法通过路径：" + prePath + skinName + "style.css加载CSS，请检查主页的skinPath设置的是否正确。")
									} else {
										alert("内容页面无法通过路径：" + prePath + skinName + "style.css加载CSS，请检查主页的skinPath设置的是否正确。")
									}
								},
								success: function() {
									if ($("body").attr("leftFrame") == "true" || $("body").attr("leftFrame") == true) {
										alert("主页的skinPath配置成功！")
									} else {
										alert("主页的skinPath配置成功！")
									}
								}
							})
						}
					})
				}
			}
		}
		$("#skin").attr("href", prePath + "libs/skins/" + themeColor + "/style.css");
		$("#customSkin").attr("href", prePath + skinName + "style.css")
	}
	enableTooltips();
	try {
		var c = jQuery.jCookie("fontSize");
		if (c != false) {
			fontSize = parseInt(c)
		}
	} catch (d) {}
	if (fontSize != 12) {
		$("body").css({
			fontSize: fontSize + "px"
		});
		if ($("table:[class=tableStyle]").length > 0) {
			$("table:[class=tableStyle]").css({
				fontSize: fontSize + "px"
			})
		}
		if ($("pre").length > 0) {
			$("pre").css({
				fontSize: fontSize + "px"
			})
		}
	}
	if (autoRender == true) {
		$("div").each(function() {
			if ($(this).hasClass("box1") || $(this).attr("boxType") == "box1") {
				$(this).box1Render()
			} else {
				if ($(this).hasClass("box2") || $(this).attr("boxType") == "box2") {
					$(this).box2Render()
				} else {
					if ($(this).hasClass("box4")) {
						$(this).box4Render()
					}
				}
			}
		})
	}
	if ($("body").attr("leftFrame") == "true") {
		$("body").addClass("contentStyleLeft")
	} else {
		$("body").addClass("contentStyle")
	}
	if (scrollerX == true) {
		if ($("#skin").attr("scrollerX") == "false" || $("#skin").attr("scrollerX") == false) {
			scrollerX = false
		}
	} else {
		if ($("#skin").attr("scrollerX") == "true" || $("#skin").attr("scrollerX") == true) {
			scrollerX = true
		}
	}
	if (broswerFlag == "IE6") {
		$("html").css({
			width: "100%"
		})
	}
	if (scrollerX == false) {
		if (broswerFlag != "IE7") {
			$("html").css({
				overflowX: "hidden"
			})
		} else {
			$("body").css({
				overflowX: "hidden"
			})
		}
	}
	if ($("#skin").attr("scrollerY") == "false" || $("#skin").attr("scrollerY") == false) {
		$("html").css({
			overflowY: "hidden"
		})
	}
	triggerCustomHeightSet();
	if (cResizeTimer) {
		clearTimeout(cResizeTimer)
	}
	cResizeTimer = setTimeout("triggerCustomHeightSet()", 500);
	window.onresize = function() {
		if (cResizeTimer) {
			clearTimeout(cResizeTimer)
		}
		cResizeTimer = setTimeout("triggerCustomHeightSet()", 100)
	};
	if (autoRender == true) {
		$("div,input,textarea,button,select,form,table,a,img,span").each(function() {
			if ($(this).hasClass("box1") || $(this).hasClass("box2") || $(this).hasClass("box3") || $(this).hasClass("box4") || $(this).attr("boxType") == "box1" || $(this).attr("boxType") == "box2" || $(this).attr("keepDefaultStyle") == "true" || $(this).attr("keepDefaultStyle") == true || $(this).attr("fillType")) {
				if ($(this).hasClass("imgPreview")) {
					$(this).render()
				}
			} else {
				$(this).render();
				if ($(this).attr("title")) {
					if ($(this).parents(".selectbox-tree").length > 0 || $(this).parents(".dbSelectionMode").length > 0) {} else {
						addTooltip($(this)[0])
					}
				}
			}
		});
		$(".spliter").each(function() {
			try {
				if ($(this).is("td")) {
					$(this).spliterRender()
				}
			} catch (i) {
				alert("分隔条出错，注意脚本的引入：spliter.js")
			}
		})
	}
	closeProgress();
	if (!splitMode) {
		if (parent.positionType) {
			if (parent.positionType != "none" && parent.positionContent != "") {
				if (positionTarget == "") {
					if (parent.positionType == "normal") {
						createPosition(parent.positionContent, "normal")
					} else {
						createPosition(parent.positionContent, "simple")
					}
				} else {
					top.createPosition(positionTarget, parent.positionContent)
				}
			}
		}
	}
	_initComplete()
});

function cusTreeTableLoadLater(b, a) {
	$.ajax({
		url: a,
		error: function() {
			try {
				top.Dialog.alert("数据加载失败，请检查dataPath是否正确")
			} catch (c) {
				alert("数据加载失败，请检查dataPath是否正确")
			}
		},
		success: function(d) {
			var c = b.parents("tr").next().find("table").parents("td");
			c.html("");
			var e = $(d);
			e.appendTo(c);
			e.tableRender();
			b.removeClass("img_loading");
			b.addClass("img_remove2");
			b.attr("title", "点击收缩");
			b.parents("tr").next().show()
		}
	})
}
function triggerCustomHeightSet() {
	var a = document.documentElement.clientHeight;
	_customHeightSet(a)
}
function _customHeightSet(b) {
	try {
		customHeightSet(b)
	} catch (a) {}
}
function changeFont(a) {
	$("body").css({
		fontSize: a + "px"
	});
	if ($("table:[class=tableStyle]").length > 0) {
		$("table:[class=tableStyle]").css({
			fontSize: a + "px"
		})
	}
	if ($("pre").length > 0) {
		$("pre").css({
			fontSize: a + "px"
		})
	}
	if ($("iframe").length > 0) {
		for (var b = 0; b < $("iframe").length; b++) {
			document.getElementsByTagName("iframe")[b].contentWindow.changeFont(a)
		}
	}
}(function(a) {
	a.fn.render = function() {
		if (a(this).hasClass("spliter")) {
			try {
				a(this).spliterRender()
			} catch (b) {
				alert("分隔条出错，注意脚本的引入：spliter.js")
			}
		}
		if (a(this).is("input")) {
			if (a(this).attr("type") == "text") {
				if (a(this).hasClass("autoComplete")) {
					a(this).textInputStyleRender();
					try {
						a(this).attr("trueType", "autoComplete");
						a(this).autoCompleteRender()
					} catch (b) {
						alert("自动完成框出错，注意脚本的引入：autoComplete.js")
					}
				}
				if (a(this).hasClass("autoCompleteIcon")) {
					a(this).attr("trueType", "autoComplete");
					a(this).textInputStyleRender()
				} else {
					if (a(this).hasClass("color")) {
						a(this).textInputStyleRender();
						try {
							a(this).attr("trueType", "color");
							a(this).colorRender()
						} catch (b) {
							alert("颜色选择器出错，注意脚本的引入：color.js")
						}
					} else {
						if (a(this).hasClass("date")) {
							a(this).attr("trueType", "date");
							a(this).dateRender()
						} else {
							if (a(this).hasClass("dateIcon")) {
								a(this).attr("trueType", "date");
								a(this).textInputStyleRender()
							} else {
								if (a(this).hasClass("keypad")) {
									a(this).textInputStyleRender();
									try {
										a(this).attr("trueType", "keypad");
										a(this).keypadRender()
									} catch (b) {
										alert("软键盘控件出错，注意脚本的引入：keypad.js")
									}
								} else {
									if (a(this).hasClass("stepper")) {
										a(this).textInputStyleRender();
										try {
											a(this).attr("trueType", "stepper");
											a(this).stepperRender()
										} catch (b) {
											alert("数字步进器出错，注意脚本的引入：stepper.js")
										}
									} else {
										a(this).attr("trueType", "textinput");
										a(this).textinputRender()
									}
								}
							}
						}
					}
				}
			} else {
				if (a(this).attr("type") == "button" || a(this).attr("type") == "submit" || a(this).attr("type") == "reset") {
					a(this).buttonInputRender()
				} else {
					if (a(this).attr("type") == "file") {
						a(this).attr("trueType", "file");
						a(this).fileRender()
					} else {
						if (a(this).attr("type") == "password") {
							a(this).attr("trueType", "password");
							a(this).passInputRender();
							if (a(this).hasClass("keypad")) {
								a(this).textInputStyleRender();
								try {
									a(this).attr("trueType", "keypad");
									a(this).keypadRender()
								} catch (b) {
									alert("软键盘控件出错，注意脚本的引入：keypad.js")
								}
							}
						} else {
							if (a(this).attr("type") == "radio") {
								a(this).attr("trueType", "radio")
							} else {
								if (a(this).attr("type") == "checkbox") {
									a(this).attr("trueType", "checkbox")
								} else {
									if (a(this).attr("type") == "hidden") {
										a(this).attr("trueType", "hidden")
									}
								}
							}
						}
					}
				}
			}
		} else {
			if (a(this).is("button")) {
				a(this).buttonRender()
			} else {
				if (a(this).is("textarea")) {
					a(this).attr("trueType", "textarea");
					a(this).textareaRender()
				} else {
					if (a(this).is("select")) {
						a(this).attr("trueType", "select");
						a(this).prev(".mainCon").attr("trueType", "q_select");
						a(this).selectRender()
					} else {
						if (a(this).is("table")) {
							if (a(this).hasClass("tableStyle")) {
								a(this).tableRender()
							} else {
								if (a(this).hasClass("treeTable")) {
									try {
										a(this).treeTableRender()
									} catch (b) {
										alert("table树形表格出错，注意脚本的引入：treeTable.js")
									}
								} else {
									if (a(this).hasClass("detailTable")) {
										try {
											a(this).addClass("tableStyle");
											a(this).tableRender();
											a(this).detailTableRender()
										} catch (b) {
											alert("table父子表格出错，注意脚本的引入：detailTable.js")
										}
									}
								}
							}
						} else {
							if (a(this).is("a")) {
								if (a(this).hasClass("imgPreview")) {
									try {
										a(this).imagePreviewRender()
									} catch (b) {
										alert("图片预览出错，注意脚本的引入：imgPreview.js")
									}
								} else {
									if (a(this).hasClass("imgZoom")) {
										try {
											a(this).imgZoomRender()
										} catch (b) {
											alert("图片区域放大出错，注意脚本的引入：imgZoom.js")
										}
									}
								}
							} else {
								if (a(this).is("img")) {
									if (a(this).hasClass("imgFrame")) {
										try {
											a(this).imgFrameRender()
										} catch (b) {
											alert("图片边框渲染出错，注意脚本的引入：imgFrame.js")
										}
									} else {
										if (a(this).hasClass("imgFade")) {
											try {
												a(this).imgFadeRender()
											} catch (b) {
												alert("图片渐显出错，注意脚本的引入：imgFade.js")
											}
										}
									}
								} else {
									if (a(this).is("div")) {
										if (a(this).hasClass("box1") || a(this).attr("boxType") == "box1") {
											a(this).box1Render()
										} else {
											if (a(this).hasClass("box2") || a(this).attr("boxType") == "box2") {
												a(this).box2Render()
											} else {
												if (a(this).hasClass("box4")) {
													a(this).box4Render()
												} else {
													if (a(this).hasClass("floatPanel")) {
														try {
															a(this).floatPanelRender()
														} catch (b) {
															alert("浮动面板出错，注意脚本的引入：floatPanel.js")
														}
													} else {
														if (a(this).hasClass("selectTree")) {
															a(this).attr("trueType", "selectTree");
															a(this).selectTreeRender()
														} else {
															if (a(this).hasClass("selectCustom")) {
																try {
																	a(this).attr("trueType", "selectCustom");
																	a(this).selectCustomRender()
																} catch (b) {
																	alert("自定义下拉框出错，注意脚本的引入：selectCustom.js")
																}
															} else {
																if (a(this).hasClass("suggestion")) {
																	try {
																		a(this).attr("trueType", "suggestion");
																		a(this).suggestionRender()
																	} catch (b) {
																		alert("自动提示框出错，注意脚本的引入：suggestion.js")
																	}
																} else {
																	if (a(this).hasClass("filter")) {
																		try {
																			a(this).attr("trueType", "filter");
																			a(this).filterRender()
																		} catch (b) {
																			alert("条件过滤器出错，注意脚本的引入：filter.js")
																		}
																	} else {
																		if (a(this).hasClass("lister")) {
																			try {
																				a(this).attr("trueType", "lister");
																				a(this).listerRender()
																			} catch (b) {
																				alert("双向选择器出错，注意脚本的引入：lister.js")
																			}
																		} else {
																			if (a(this).hasClass("listerTree")) {
																				try {
																					a(this).attr("trueType", "listerTree");
																					a(this).listerTreeRender()
																				} catch (b) {
																					alert("树形双选器出错，注意脚本的引入：listerTree.js")
																				}
																			} else {
																				if (a(this).hasClass("rating")) {
																					try {
																						a(this).attr("trueType", "rating");
																						a(this).ratingRender()
																					} catch (b) {
																						alert("评星级控件出错，注意脚本的引入：rating.js")
																					}
																				} else {
																					if (a(this).hasClass("popupMenu")) {
																						a(this).popupMenuRender()
																					} else {
																						if (a(this).hasClass("basicTab")) {
																							try {
																								a(this).basicTabRender()
																							} catch (b) {
																								alert("基本选项卡出错，注意脚本的引入：basicTab.js")
																							}
																						} else {
																							if (a(this).hasClass("basicTabModern")) {
																								try {
																									a(this).basicTabModernRender()
																								} catch (b) {
																									alert("基本选项卡出错，注意脚本的引入：basicTabModern.js")
																								}
																							} else {
																								if (a(this).hasClass("verticalTab")) {
																									try {
																										a(this).verticalTabRender()
																									} catch (b) {
																										alert("纵向选项卡出错，注意脚本的引入：verticalTab.js")
																									}
																								} else {
																									if (a(this).hasClass("singleNav")) {
																										a(this).singleNavRender()
																									} else {
																										if (a(this).hasClass("singleNavMin")) {
																											a(this).singleNavMinRender()
																										} else {
																											if (a(this).hasClass("accordition")) {
																												try {
																													a(this).accorditionRender()
																												} catch (b) {
																													alert("抽屉容器出错，注意脚本的引入：accordion.js")
																												}
																											} else {
																												if (a(this).hasClass("navIcon")) {
																													a(this).hover(function() {
																														a(this).addClass("navIcon_hover")
																													}, function() {
																														a(this).removeClass("navIcon_hover")
																													})
																												} else {
																													if (a(this).hasClass("navIconSmall")) {
																														a(this).hover(function() {
																															a(this).addClass("navIconSmall_hover")
																														}, function() {
																															a(this).removeClass("navIconSmall_hover")
																														})
																													} else {
																														if (a(this).hasClass("pageNumber")) {
																															try {
																																a(this).pageNumberRender()
																															} catch (b) {
																																alert("数字分页组件出错，注意脚本的引入：pageNumber.js")
																															}
																														} else {
																															if (a(this).hasClass("pageArrow")) {
																																try {
																																	a(this).pageArrowRender()
																																} catch (b) {
																																	alert("箭头分页组件出错，注意脚本的引入：pageArrow.js")
																																}
																															}
																														}
																													}
																												}
																											}
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									} else {
										if (a(this).is("span")) {
											if (a(this).hasClass("img_light")) {
												a(this).addClass("hand");
												a(this).hover(function() {
													a(this).removeClass("img_light");
													a(this).addClass("img_lightOn")
												}, function() {
													a(this).addClass("img_light");
													a(this).removeClass("img_lightOn")
												})
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	a.fn.setValue = function(c, d) {
		var b = a(this);
		if (b.attr("trueType") == "select") {
			b.attr("selectedValue", c);
			b.render()
		} else {
			if (b.attr("trueType") == "selectTree") {
				b.attr("selectedValue", c);
				b.render()
			} else {
				if (b.attr("trueType") == "selectCustom") {
					b.selectCustomSetValue(c, d)
				} else {
					if (b.attr("trueType") == "suggestion") {
						b.suggestionSetValue(c, d)
					} else {
						if (b.attr("trueType") == "lister") {
							b.listerSetValue(c)
						} else {
							if (b.attr("trueType") == "listerTree") {
								b.listerTreeSetValue(c)
							} else {
								if (b.attr("trueType") == "filter") {
									b.attr("selectedValue", c);
									b.render()
								}
							}
						}
					}
				}
			}
		}
	};
	a.fn.resetValue = function() {
		var b = a(this);
		if (b.attr("trueType") == "select") {
			b.render()
		} else {
			if (b.attr("trueType") == "selectTree") {
				b.render()
			} else {
				if (b.attr("trueType") == "lister") {
					b.render()
				} else {
					if (b.attr("trueType") == "listerTree") {
						b.render()
					} else {
						if (b.attr("trueType") == "filter") {
							b.render()
						}
					}
				}
			}
		}
	};
	a.fn.addItem = function(c) {
		var b = a(this);
		if (b.attr("trueType") == "select") {
			b.selectAddItem(c)
		} else {
			if (b.attr("trueType") == "selectTree") {
				b.selectTreeAddItem(c)
			} else {
				if (b.attr("trueType") == "lister") {
					b.listerAddItem(c)
				} else {
					if (b.attr("trueType") == "listerTree") {
						b.listerTreeAddItem(c)
					}
				}
			}
		}
	};
	a.fn.removeItem = function(c) {
		var b = a(this);
		if (b.attr("trueType") == "select") {
			b.selectRemoveItem(c)
		} else {
			if (b.attr("trueType") == "selectTree") {
				b.selectTreeRemoveItem(c)
			} else {
				if (b.attr("trueType") == "lister") {
					b.listerRemoveItem(c)
				} else {
					if (b.attr("trueType") == "listerTree") {
						b.listerTreeRemoveItem(c)
					}
				}
			}
		}
	};
	a.fn.selectValue = function(c) {
		var b = a(this);
		if (b.attr("trueType") == "lister") {
			b.listerSelectValue(c)
		} else {
			if (b.attr("trueType") == "listerTree") {
				b.listerTreeSelectValue(c)
			}
		}
	};
	a.fn.unSelectValue = function(c) {
		var b = a(this);
		if (b.attr("trueType") == "lister") {
			b.listerUnSelectValue(c)
		} else {
			if (b.attr("trueType") == "listerTree") {
				b.listerTreeUnSelectValue(c)
			}
		}
	};
	a.fn.box1Render = function() {
		var b;
		if (a(this).find(".boxContent").length > 0) {} else {
			b = a(this).html();
			a(this).empty();
			if (a(this).attr("whiteBg") == "true" || a(this).attr("whiteBg") == true || boxWhiteBg == true) {
				if (a(this).hasClass("box1")) {
					a(this).addClass("box1_white")
				}
			}
			a("<div class='box_topcenter'><div class='box_topleft'><div class='box_topright'></div></div></div>").appendTo(a(this));
			a("<div class='box_middlecenter'><div class='box_middleleft'><div class='box_middleright'><div class='boxContent'></div></div></div></div>").appendTo(a(this));
			a("<div class='box_bottomcenter'><div class='box_bottomleft'><div class='box_bottomright'></div></div></div>").appendTo(a(this));
			a(this).find(".boxContent").html(b)
		}
		a(this).box1Build()
	};
	a.fn.box1Build = function() {
		if (a(this).attr("panelWidth") != null) {
			var d = a(this).attr("panelWidth");
			var c = d.substr(d.length - 1, 1);
			if (c == "%") {
				a(this).width(d)
			} else {
				var e = Number(a(this).attr("panelWidth"));
				a(this).width(e)
			}
		}
		if (a(this).attr("panelHeight") != null) {
			var b;
			if (a(this).attr("whiteBg") == "true" || a(this).attr("whiteBg") == true) {
				b = Number(a(this).attr("panelHeight")) - a(this).find(".box1_topcenter2").outerHeight() - a(this).find(".box1_bottomcenter2").outerHeight()
			} else {
				b = Number(a(this).attr("panelHeight")) - a(this).find(".box1_topcenter").outerHeight() - a(this).find(".box1_bottomcenter").outerHeight()
			}
			a(this).find(".boxContent").height(b)
		}
		if (a(this).attr("overflow") == "true" || a(this).attr("overflow") == true) {
			a(this).find(".boxContent").css({
				overflow: "auto"
			})
		} else {
			if (a(this).attr("overflow") == "false" || a(this).attr("overflow") == false) {
				a(this).find(".boxContent").css({
					overflow: "hidden"
				})
			} else {
				a(this).find(".boxContent").css({
					overflow: "visible"
				})
			}
		}
		if (a(this).attr("position") == "center") {
			a(this).addClass("center")
		} else {
			a(this).removeClass("center")
		}
	};
	a.fn.box2Close = function() {
		var b = a(this).box2GetState();
		if (!b) {
			return
		}
		a(this).find(".ss").click()
	};
	a.fn.box2Open = function() {
		var b = a(this).box2GetState();
		if (b) {
			return
		}
		a(this).find(".ss").click()
	};
	a.fn.box2ChangeState = function() {
		a(this).find(".ss").click()
	};
	a.fn.box2GetState = function() {
		var b;
		if (a(this).find(".boxContent")[0].style.display == "none") {
			b = false
		} else {
			b = true
		}
		return b
	};
	a.fn.box2Render = function() {
		var b;
		if (a(this).find(".boxContent").length > 0) {} else {
			b = a(this).html();
			a(this).empty();
			a("<div class='box_topcenter' id='box_topcenter'><div class='box_topleft'><div class='box_topright'><div class='title'><span></span></div><div class='boxSubTitle'></div><div class='status'><span class='ss'><a></a></span></div><div class='clear'></div></div></div></div>").appendTo(a(this));
			a("<div class='box_middlecenter'><div class='box_middleleft'><div class='box_middleright'><div class='boxContent'></div></div></div></div>").appendTo(a(this));
			a("<div class='box_bottomcenter' id='box_bottomcenter'><div class='box_bottomleft'><div class='box_bottomright'></div></div></div>").appendTo(a(this));
			a(this).find(".boxContent").html(b)
		}
		a(this).box2Build()
	};
	a.fn.box2Build = function() {
		var f = a(this);
		var r = f.find(".title");
		var o = r.find("span");
		if (f.attr("boxType") == null) {
			f.attr("boxType", "box2")
		}
		if (f.attr("panelTitle") != null) {
			o.text(f.attr("panelTitle"))
		}
		if (f.attr("iconClass") != null) {
			o.addClass(f.attr("iconClass"));
			o.css({
				backgroundPosition: "0 50%"
			})
		} else {
			if (f.attr("iconSrc") != null) {
				o.css({
					backgroundImage: "url(" + a(this).attr("iconSrc") + ")",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "0 50%",
					display: "block",
					paddingLeft: "18px"
				})
			}
		}
		if (f.attr("panelSubTitle") != null) {
			a(this).find(".boxSubTitle").text(f.attr("panelSubTitle"))
		}
		if (f.attr("panelSubTitleColor") != null) {
			a(this).find(".boxSubTitle").css({
				color: f.attr("panelSubTitleColor")
			})
		}
		if (a(this).attr("panelWidth") != null) {
			var c = a(this).attr("panelWidth");
			var n = c.substr(c.length - 1, 1);
			if (n == "%") {
				a(this).width(c)
			} else {
				var b = Number(a(this).attr("panelWidth"));
				a(this).width(b)
			}
		}
		if (a(this).attr("panelHeight") != null) {
			var p = Number(a(this).attr("panelHeight")) - a(this).find("#box2_topcenter").outerHeight() - a(this).find("#box2_bottomcenter").outerHeight();
			a(this).find(".boxContent").height(p)
		}
		if (a(this).attr("overflow") == "true" || a(this).attr("overflow") == true) {
			a(this).find(".boxContent").css({
				overflow: "auto"
			})
		} else {
			if (a(this).attr("overflow") == "false" || a(this).attr("overflow") == false) {
				a(this).find(".boxContent").css({
					overflow: "hidden"
				})
			} else {
				a(this).find(".boxContent").css({
					overflow: "visible"
				})
			}
		}
		var e = "true";
		if (a(this).attr("showStatus") != null) {
			e = a(this).attr("showStatus")
		}
		var m = "javascript:;";
		if (a(this).attr("panelUrl") != null) {
			m = a(this).attr("panelUrl")
		}
		var l = "_self";
		if (a(this).attr("panelTarget") != null) {
			l = a(this).attr("panelTarget")
		}
		var d = "收缩";
		if (a(this).attr("statusText") != null) {
			d = a(this).attr("statusText")
		}
		var s = "展开";
		if (a(this).attr("afterStatusText") != null) {
			s = a(this).attr("afterStatusText")
		}
		var h = a(this).find(".ss");
		h.unbind("click");
		var q;
		var t = "visibleChange";
		if (a(this).attr("statusType") != null) {
			t = a(this).attr("statusType")
		}
		var g = "open";
		if (a(this).attr("startState") != null) {
			g = a(this).attr("startState")
		}
		if (t == "visibleChange" && e == "true" && g == "open") {
			h.text(d);
			h.toggle(function() {
				var u = a(this).parents('div[boxType="box2"]').find(".boxContent");
				q = u.height();
				if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
					u.fadeOut(300, function() {
						f.trigger("stateChange", "hide")
					})
				} else {
					u.hide(300, function() {
						f.trigger("stateChange", "hide")
					})
				}
				a(this).text(s)
			}, function() {
				var u = a(this).parents('div[boxType="box2"]').find(".boxContent");
				u.height(q);
				if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
					u.fadeIn(300, function() {
						f.trigger("stateChange", "show")
					})
				} else {
					u.show(300, function() {
						f.trigger("stateChange", "show")
					})
				}
				if (a(this).parents('div[boxType="box2"]').attr("panelHeight") == null) {
					setTimeout(function() {
						u.css({
							height: "auto"
						})
					}, 500)
				}
				a(this).text(d)
			})
		} else {
			if (t == "visibleChange" && e == "true" && g == "close") {
				h.text(d);
				var i = a(this).find(".boxContent");
				q = i.height();
				i.hide();
				h.toggle(function() {
					var u = a(this).parents('div[boxType="box2"]').find(".boxContent");
					u.height(q);
					if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
						u.fadeIn(300, function() {
							f.trigger("stateChange", "show")
						})
					} else {
						u.show(300, function() {
							f.trigger("stateChange", "show")
						})
					}
					if (a(this).parents('div[boxType="box2"]').attr("panelHeight") == null) {
						setTimeout(function() {
							u.css({
								height: "auto"
							})
						}, 500)
					}
					a(this).text(s)
				}, function() {
					if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
						i.fadeOut(300, function() {
							f.trigger("stateChange", "hide")
						})
					} else {
						i.hide(300, function() {
							f.trigger("stateChange", "hide")
						})
					}
					a(this).text(d)
				})
			} else {
				if (t == "link" && e == "true" && a(this).attr("statusText") != null) {
					h.find("a").attr("href", m);
					h.find("a").attr("target", l);
					h.find("a").text(d)
				} else {
					if (e == "true" && a(this).attr("statusText") != null) {
						h.text(d);
						h.css({
							cursor: "auto"
						})
					} else {
						h.hide()
					}
				}
			}
		}
	};
	a.fn.box4Render = function() {
		var b;
		if (a(this).find(".boxContent").length > 0) {} else {
			b = a(this).html();
			a(this).empty();
			if (box4Custom) {
				a("<div class='box4_topcenter_notitle2' id='box4_notitle'><div class='box4_topleft_notitle2'><div class='box4_topright_notitle2'></div></div></div>").appendTo(a(this));
				a("<div class='box4_topcenter2' id='box4_hastitle'><div class='box4_topleft2'><div class='box4_topright2'><div class='title'></div></div></div></div>").appendTo(a(this));
				a("<div class='box4_middlecenter2'><div class='box4_middleleft2'><div class='box4_middleright2'><div class='boxContent'></div></div></div></div>").appendTo(a(this));
				a("<div class='box4_bottomcenter2' id='box4_bottomcenter'><div class='box4_bottomleft2'><div class='box4_bottomright2'></div></div></div>").appendTo(a(this))
			} else {
				a("<div class='box4_topcenter_notitle' id='box4_notitle'><div class='box4_topleft_notitle'><div class='box4_topright_notitle'></div></div></div>").appendTo(a(this));
				a("<div class='box4_topcenter' id='box4_hastitle'><div class='box4_topleft'><div class='box4_topright'><div class='title'></div></div></div></div>").appendTo(a(this));
				a("<div class='box4_middlecenter'><div class='box4_middleleft'><div class='box4_middleright'><div class='boxContent'></div></div></div></div>").appendTo(a(this));
				a("<div class='box4_bottomcenter' id='box4_bottomcenter'><div class='box4_bottomleft'><div class='box4_bottomright'></div></div></div>").appendTo(a(this))
			}
			a(this).find(".boxContent").html(b)
		}
		a(this).box4Build()
	};
	a.fn.box4Build = function() {
		if (a(this).attr("panelTitle") != null) {
			a(this).find(".title").text(a(this).attr("panelTitle"))
		}
		var f = a(this).find("#box4_notitle");
		var b = a(this).find("#box4_hastitle");
		f.hide();
		b.hide();
		if (a(this).attr("noTitle") == "true" || a(this).attr("noTitle") == true) {
			f.show()
		} else {
			b.show()
		}
		if (a(this).attr("panelWidth") != null) {
			var g = a(this).attr("panelWidth");
			var d = g.substr(g.length - 1, 1);
			if (d == "%") {
				a(this).width(g)
			} else {
				var h = Number(a(this).attr("panelWidth"));
				a(this).width(h)
			}
		}
		if (a(this).attr("panelHeight") != null) {
			a(this).find(".box4_topcenter").height(27);
			a(this).find(".box4_bottomcenter").height(5);
			var c;
			if (a(this).attr("noTitle") == "true" || a(this).attr("noTitle") == true) {
				c = Number(a(this).attr("panelHeight")) - a(this).find("#box4_notitle").outerHeight() - a(this).find("#box4_bottomcenter").outerHeight()
			} else {
				c = Number(a(this).attr("panelHeight")) - a(this).find("#box4_hastitle").outerHeight() - a(this).find("#box4_bottomcenter").outerHeight()
			}
			a(this).find(".boxContent").height(c)
		}
		if (a(this).attr("overflow") == "true" || a(this).attr("overflow") == true) {
			a(this).find(".boxContent").css({
				overflow: "auto"
			})
		} else {
			if (a(this).attr("overflow") == "false" || a(this).attr("overflow") == false) {
				a(this).find(".boxContent").css({
					overflow: "hidden"
				})
			} else {
				a(this).find(".boxContent").css({
					overflow: "visible"
				})
			}
		}
		var e = a(this);
		e.find("li a").unbind("click");
		e.find("li a").each(function(l) {
			a(this).click(function() {
				e.find("li a").removeClass("current");
				a(this).addClass("current")
			})
		})
	};
	a.fn.textinputRender = function() {
		if (a(this).attr("inputMode")) {
			var e = a(this).attr("inputMode");
			if (e == "numberOnly") {
				var d = a(this)[0];
				var c = function() {
						d.value = d.value.replace(/\D/g, "");
						if (!validateInput(d.value, "^(0|[1-9][0-9]*)$")) {
							d.value = d.value.substring(1)
						}
					};
				a(this)[0].onkeyup = function() {
					c()
				};
				a(this)[0].onafterpaste = function() {
					c()
				}
			} else {
				if (e == "positiveDecimal") {
					var d = a(this)[0];
					var c = function() {
							d.value = d.value.replace(/[^0-9\.]/g, "");
							if (!validateInput(d.value, "^(([1-9]+)|([1-9]+).{1}|([0-9]+.{1}[0-9]+))$")) {
								d.value = d.value.substring(0, d.value.length - 1)
							}
						};
					a(this)[0].onkeyup = function() {
						c()
					};
					a(this)[0].onafterpaste = function() {
						c()
					}
				}
			}
		}
		if (a(this).attr("class") == "keypad") {
			return
		}
		a(this).addClass("textinput");
		var b = null;
		a(this).hover(function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textinput");
				a(this).addClass("textinput_hover")
			}
		}, function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textinput_hover");
				a(this).addClass("textinput")
			}
		});
		a(this).focus(function() {
			b = a(this)[0];
			a(this).removeClass("textinput");
			a(this).removeClass("textinput_hover");
			a(this).addClass("textinput_click")
		});
		a(this).blur(function() {
			b = null;
			a(this).removeClass("textinput_click");
			a(this).addClass("textinput")
		});
		if (a(this).attr("clearable") == "true") {
			a(this).clearableTextField()
		}
		if (a(this).attr("maxNum") != null) {
			a(this).maxlength({
				maxCharacters: parseInt(a(this).attr("maxNum"))
			})
		}
		if (a(this).attr("watermark") != null) {
			a(this).watermark("watermark", a(this).attr("watermark"))
		}
	};
	a.fn.fileRender = function() {
		var d = 188;
		if (a(this).attr("fileWidth")) {
			d = Number(a(this).attr("fileWidth"))
		}
		a(this).addClass("fileComponent");
		a(this).wrap('<div class="file-container"></div>');
		var b = a('<table cellspacing="0" cellpadding="0" style="border-style:none;position:absolute;z-index:10;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"><input type="text" class="textinput"/></td><td class="ali01" style="border-style:none;;padding:0;margin:0;"><input type="button" class="fileBtn" value="" /></td></tr></table>');
		var f = a(this).parent();
		f.wrap('<div class="file-container-main"></div>');
		var e = f.parent();
		f.prepend(b);
		var c = b.find("input[type=text]");
		c.width(d - 60);
		if (a.browser.msie) {
			a(this).width(d)
		}
		f.width(d);
		e.width(d);
		a(this).css({
			position: "absolute",
			"z-index": 20,
			"font-size": "118px",
			opacity: "0",
			left: "0px",
			top: "0px"
		});
		a(this).change(function() {
			var g = "";
			if (a.browser.msie) {
				a(this)[0].select();
				g = document.selection.createRange().text
			} else {
				if (broswerFlag == "Firefox") {
					g = a(this).val()
				} else {
					var h = a(this).val().toString().split("\\");
					g = h[h.length - 1]
				}
			}
			a(this).parent().find("input[type=text]").val(g);
			if (a(this).attr("showInfo") != "false") {
				try {
					a(this).attr("title", g);
					addTooltip(a(this)[0])
				} catch (i) {}
			}
		})
	};
	a.fn.textInputStyleRender = function() {
		var b = null;
		if (a(this).attr("inputMode")) {
			var c = a(this).attr("inputMode");
			if (c == "numberOnly") {
				a(this)[0].onkeyup = function() {
					a(this)[0].value = a(this)[0].value.replace(/\D/g, "")
				};
				a(this)[0].onafterpaste = function() {
					a(this)[0].value = a(this)[0].value.replace(/\D/g, "")
				}
			}
		}
		a(this).hover(function() {
			if (b != a(this)[0]) {
				a(this).addClass("date_hover")
			}
		}, function() {
			if (b != a(this)[0]) {
				a(this).removeClass("date_hover")
			}
		});
		a(this).focus(function() {
			b = a(this)[0];
			a(this).removeClass("date_hover");
			a(this).addClass("date_click")
		});
		a(this).blur(function() {
			b = null;
			a(this).removeClass("date_click")
		})
	};
	a.fn.passInputRender = function() {
		var b = null;
		a(this).addClass("textinput");
		if (a(this).attr("inputMode")) {
			var c = a(this).attr("inputMode");
			if (c == "numberOnly") {
				a(this)[0].onkeyup = function() {
					a(this)[0].value = a(this)[0].value.replace(/\D/g, "")
				};
				a(this)[0].onafterpaste = function() {
					a(this)[0].value = a(this)[0].value.replace(/\D/g, "")
				}
			}
		}
		a(this).hover(function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textinput");
				a(this).addClass("textinput_hover")
			}
		}, function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textinput_hover");
				a(this).addClass("textinput")
			}
		});
		a(this).focus(function() {
			b = a(this)[0];
			a(this).removeClass("textinput");
			a(this).removeClass("textinput_hover");
			a(this).addClass("textinput_click")
		});
		a(this).blur(function() {
			b = null;
			a(this).removeClass("textinput_click");
			a(this).addClass("textinput")
		});
		if (a(this).attr("clearable") == "true") {
			a(this).clearableTextField()
		}
		if (a(this).attr("maxNum") != null) {
			a(this).maxlength({
				maxCharacters: parseInt(a(this).attr("maxNum"))
			})
		}
		if (a(this).attr("checkStrength") == "true") {
			a(this).password_strength()
		}
		a(this).caps(function(d) {
			if (jQuery.browser.safari) {
				return
			}
			if (d) {
				a.cursorMessage("注意：大写键开启了")
			} else {}
		})
	};
	a.fn.textareaRender = function() {
		var b = null;
		a(this).addClass("textarea");
		if (a(this).attr("maxNum") != null) {
			a(this).maxlength({
				maxCharacters: parseInt(a(this).attr("maxNum"))
			})
		}
		if (a(this).attr("resize") == "true") {
			a(this).TextAreaResizer()
		}
		if (a(this).attr("autoHeight") == "true") {
			a(this).css({
				height: "auto"
			});
			a(this).attr("rows", 5);
			a(this).autoGrow()
		}
		if (a(this).attr("watermark") != null) {
			a(this).watermark("watermark", a(this).attr("watermark"))
		}
		a(this).hover(function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textarea");
				a(this).addClass("textarea_hover")
			}
		}, function() {
			if (b != a(this)[0]) {
				a(this).removeClass("textarea_hover");
				a(this).addClass("textarea")
			}
		});
		a(this).focus(function() {
			b = a(this)[0];
			a(this).removeClass("textarea");
			a(this).removeClass("textarea_hover");
			a(this).addClass("textarea_click")
		});
		a(this).blur(function() {
			b = null;
			a(this).removeClass("textarea_click");
			a(this).addClass("textarea")
		})
	};
	a.fn.buttonInputRender = function() {
		if (!a(this).attr("class")) {
			a(this).addClass("button")
		}
		var c = _getStrLength(a(this).val());
		if (a(this).attr("useMinWidth") == "false" || a(this).attr("useMinWidth") == false) {} else {
			if (c < 5) {
				a(this).width(60)
			}
		}
		a(this).hover(function() {
			a(this).addClass("button_hover")
		}, function() {
			a(this).removeClass("button_hover")
		});
		if (a(this).attr("toggle") == "true" || a(this).attr("toggle") == true) {
			var d = a("<input type='hidden'/>");
			if (a(this).attr("name") != null) {
				d.attr("name", a(this).attr("name"))
			}
			a(this).after(d);
			var b = 0;
			if (a(this).attr("relValue") == "1") {
				b = 1
			}
			a(this).attr("relValue", b);
			d.attr("relValue", b);
			if (b == 0) {
				a(this).toggle(function() {
					a(this).addClass("toggle");
					a(this).attr("relValue", 1);
					d.attr("relValue", 1)
				}, function() {
					a(this).removeClass("toggle");
					a(this).attr("relValue", 0);
					d.attr("relValue", 0)
				})
			} else {
				a(this).addClass("toggle");
				a(this).toggle(function() {
					a(this).removeClass("toggle");
					a(this).attr("relValue", 0);
					d.attr("relValue", 0)
				}, function() {
					a(this).addClass("toggle");
					a(this).attr("relValue", 1);
					d.attr("relValue", 1)
				})
			}
		}
	};
	a.fn.buttonRender = function() {
		if (!a(this).attr("class")) {
			a(this).addClass("button")
		}
		var c = _getStrLength(a(this).text());
		var b = 0;
		var d = 50;
		b = _getStrLength(a(this).filter(":has(span)").find("span").text());
		if (b != 0) {
			d = 20 + 7 * b + 10
		}
		if (broswerFlag == "Firefox" || broswerFlag == "Opera" || broswerFlag == "Safari") {
			a(this).filter(":has(span)").css({
				paddingLeft: "5px",
				width: d + 8 + "px"
			})
		} else {
			a(this).filter(":has(span)").css({
				paddingLeft: "5px",
				width: d + "px"
			})
		}
		if (c < 5) {
			a(this).width(66)
		}
		a(this).filter(":has(span)").find("span").css({
			cursor: "default"
		});
		a(this).hover(function() {
			a(this).addClass("button_hover")
		}, function() {
			a(this).removeClass("button_hover")
		})
	};
	a.fn.dateRender = function() {
		var d = null;
		var c = "yyyy-MM-dd";
		if (a(this).attr("dateFmt") != null) {
			c = a(this).attr("dateFmt")
		}
		var b = false;
		if (a(this).attr("doubleCal") == true || a(this).attr("doubleCal") == "true") {
			b = true
		}
		a(this).hover(function() {
			if (d != a(this)[0]) {
				a(this).addClass("date_hover")
			}
		}, function() {
			if (d != a(this)[0]) {
				a(this).removeClass("date_hover")
			}
		});
		a(this).focus(function() {
			try {
				WdatePicker({
					skin: themeColor,
					isShowClear: true,
					dateFmt: c,
					doubleCalendar: b,
					onpicked: function(e) {
						a(this).blur()
					}
				})
			} catch (f) {
				alert("日期选择框出错，注意脚本的引入：WdatePicker.js")
			}
			d = a(this)[0];
			a(this).removeClass("date_hover");
			a(this).addClass("date_click")
		});
		a(this).blur(function() {
			d = null;
			a(this).removeClass("date_click")
		})
	};
	a.fn.popupMenuRender = function() {
		a(this).hover(function() {
			a(this).find(".popupMenu_con").show()
		}, function() {
			a(this).find(".popupMenu_con").hide()
		})
	};
	a.fn.singleNavRender = function() {
		var b = a(this);
		b.find(">div span").each(function() {
			a(this).click(function() {
				b.find(">div").removeClass("current");
				a(this).parent("div").addClass("current")
			});
			a(this).hover(function() {
				a(this).animate({
					paddingLeft: "40px"
				}, "fast")
			}, function() {
				a(this).animate({
					paddingLeft: "20px"
				})
			})
		})
	};
	a.fn.singleNavMinRender = function() {
		var b = a(this);
		b.find(">div span").each(function() {
			a(this).click(function() {
				b.find(">div").removeClass("current");
				a(this).parent("div").addClass("current")
			});
			a(this).hover(function() {
				a(this).animate({
					paddingLeft: "30px"
				}, "fast")
			}, function() {
				a(this).animate({
					paddingLeft: "10px"
				})
			})
		})
	};
	a.fn.tableRender = function() {
		return this.each(function() {
			if (a(this).attr("mode") == "list") {
				if (a(this).attr("thTrueWidth") == "true" || a(this).attr("thTrueWidth") == true) {
					a("#scrollContent").css({
						overflowX: "auto"
					});
					var b = 0;
					a(this).find("tr").eq(0).find("th").each(function() {
						var g = Number(a(this).attr("trueWidth"));
						b = b + g;
						a(this).width(g)
					});
					a(this).width(b)
				} else {
					if (a(this).attr("tdTrueWidth") == "true" || a(this).attr("tdTrueWidth") == true) {
						a("#scrollContent").css({
							overflowX: "auto"
						});
						var e = 0;
						a(this).find("tr").eq(0).find("td").each(function() {
							var g = Number(a(this).attr("trueWidth"));
							e = e + g;
							a(this).width(g)
						});
						a(this).width(e)
					}
				}
				if (a(this).attr("fixedCellHeight") == "true" || a(this).attr("fixedCellHeight") == true) {} else {
					a(this).addClass("tableStyleWordWrap")
				}
				if (a(this).find("tr").eq(1).find("td").eq(0).find('input[type="checkbox"]').length == 1) {
					if (a(this).attr("useCheckBox") != "false") {
						a(this).attr("useCheckBox", "true")
					}
					if (a(this).attr("useMultColor") != "false") {
						a(this).attr("useMultColor", "true")
					}
				}
				if (a(this).find("tr").eq(1).find("td").eq(0).find('input[type="radio"]').length == 1) {
					if (a(this).attr("useRadio") != "false") {
						a(this).attr("useRadio", "true")
					}
				}
				if (a(this).attr("useColor") != "false") {
					a(this).find("tr:even").addClass("odd")
				}
				if (a(this).attr("useHover") != "false") {
					a(this).find("tr").hover(function() {
						a(this).addClass("highlight")
					}, function() {
						a(this).removeClass("highlight")
					})
				}
				if (a(this).attr("sortMode") == "true") {
					a(this).find("th").filter(":has(span)").hover(function() {
						a(this).removeClass("th");
						a(this).addClass("th_over")
					}, function() {
						a(this).removeClass("th_over");
						a(this).addClass("th")
					});
					a(this).find("th span").addClass("sort_off");
					a(this).find("th").click(function() {})
				}
				if (a(this).attr("useClick") != "false") {
					a(this).attr("useClick", "true")
				}
				if (a(this).attr("useClick") == "true" && a(this).attr("useMultColor") == "true") {
					a(this).attr("useClick", "false")
				}
				if (a(this).attr("useRadio") != "true") {
					a(this).attr("useRadio", "false")
				}
				if (a(this).attr("useCheckBox") != "true") {
					a(this).attr("useCheckBox", "false")
				}
				if (a(this).attr("useClick") != "false") {
					if (a(this).attr("useRadio") == "false") {
						a(this).find("tr").click(function() {
							a(this).siblings().removeClass("selected");
							a(this).addClass("selected")
						})
					} else {
						a(this).find('input[type="radio"]:checked').parents("tr").addClass("selected");
						a(this).find("tr").click(function() {
							a(this).siblings().removeClass("selected");
							a(this).addClass("selected");
							a(this).find('input[type="radio"]').attr("checked", "checked")
						})
					}
				}
				if (a(this).attr("useMultColor") == "true") {
					if (a(this).attr("useCheckBox") == "false") {
						a(this).find("tr").click(function() {
							a(this).toggleClass("selected")
						})
					} else {
						a(this).find('input[type="checkbox"]:checked').parents("tr").addClass("selected");
						if (a(this).find("th").length > 0) {
							var c = a("<img src=" + prePath + 'libs/icons/checkAllOff.gif title="点击全选" class="hand"></span>');
							a(this).find("th").eq(0).addClass("ali02").html("").append(c);
							if (a(this).attr("headFixMode") == "true") {
								c.toggle(function() {
									a("table:[class=tableStyle]").find("tr").each(function() {
										a(this).addClass("selected");
										a(this).find('input[type="checkbox"]').attr("checked", "checked")
									});
									a(this).attr("src", prePath + "libs/icons/checkAllOn.gif");
									a(this).attr("title", "取消全选")
								}, function() {
									a("table:[class=tableStyle]").find("tr").each(function() {
										if (a(this).hasClass("selected")) {
											a(this).removeClass("selected");
											a(this).find('input[type="checkbox"]').removeAttr("checked")
										}
									});
									a(this).attr("src", prePath + "libs/icons/checkAllOff.gif");
									a(this).attr("title", "点击全选")
								})
							} else {
								c.toggle(function() {
									a(this).parents("table").find("tr").each(function() {
										a(this).addClass("selected");
										a(this).find('input[type="checkbox"]').attr("checked", "checked")
									});
									a(this).attr("src", prePath + "libs/icons/checkAllOn.gif");
									a(this).attr("title", "取消全选")
								}, function() {
									a(this).parents("table").find("tr").each(function() {
										if (a(this).hasClass("selected")) {
											a(this).removeClass("selected");
											a(this).find('input[type="checkbox"]').removeAttr("checked")
										}
									});
									a(this).attr("src", prePath + "libs/icons/checkAllOff.gif");
									a(this).attr("title", "点击全选")
								})
							}
						}
						if (a(this).attr("selectRowButtonOnly") == false || a(this).attr("selectRowButtonOnly") == "false") {
							a(this).find("tr:has(td)").each(function() {
								a(this).find("td").eq(0).addClass("ali02");
								a(this).unbind("click");
								a(this).bind("click", function() {
									if (a(this).hasClass("selected")) {
										a(this).removeClass("selected");
										a(this).find("td").eq(0).find('input[type="checkbox"]').attr("checked", false)
									} else {
										a(this).addClass("selected");
										a(this).find("td").eq(0).find('input[type="checkbox"]').attr("checked", true)
									}
								})
							})
						} else {
							a(this).find("tr:has(td)").find('input[type="checkbox"]').each(function() {
								a(this).parents("td").addClass("ali02");
								a(this).unbind("click");
								a(this).bind("click", function() {
									if (a(this).parents("tr").hasClass("selected")) {
										a(this).parents("tr").removeClass("selected")
									} else {
										a(this).parents("tr").addClass("selected")
									}
								})
							})
						}
					}
				}
			}
			if (a(this).attr("formMode") == "line") {
				a(this).attr("useColor", "false");
				a(this).attr("useHover", "false");
				a(this).attr("useClick", "false");
				a(this).find("th").css({
					fontWeight: "bold",
					"text-align": "center"
				});
				a(this).find("tr").find("td:even").css("text-align", "right");
				if (a(this).attr("footer") != null) {
					if (a(this).attr("footer") == "left") {
						a(this).find("tr:last").find("td").css("text-align", "left")
					} else {
						if (a(this).attr("footer") == "right") {
							a(this).find("tr:last").find("td").css("text-align", "right")
						} else {
							if (a(this).attr("footer") == "center") {
								a(this).find("tr:last").find("td").css("text-align", "center")
							} else {
								if (a(this).attr("footer") == "normal") {
									a(this).find("tr:last").find("td:even").css("text-align", "right")
								}
							}
						}
					}
				} else {
					var f = a(this).find("tr:last").find("td").eq(0).attr("colspan");
					if (f) {
						if (f.toString() != "1") {
							a(this).find("tr:last").find("td").css("text-align", "center")
						}
					}
				}
				a(this).find("td").css({
					paddingTop: "3px",
					paddingBottom: "3px"
				})
			} else {
				if (a(this).attr("formMode") == "transparent") {
					a(this).attr("useColor", "false");
					a(this).attr("useHover", "false");
					a(this).attr("useClick", "false");
					a(this).find("th").css({
						fontWeight: "bold",
						"text-align": "center"
					});
					a(this).css({
						border: "none",
						backgroundColor: "transparent"
					});
					a(this).find("tr").css({
						border: "none",
						backgroundColor: "transparent"
					});
					a(this).find("tr").find("td:even").css("text-align", "right");
					if (a(this).attr("footer") != null) {
						if (a(this).attr("footer") == "left") {
							a(this).find("tr:last").find("td").css("text-align", "left")
						} else {
							if (a(this).attr("footer") == "right") {
								a(this).find("tr:last").find("td").css("text-align", "right")
							} else {
								if (a(this).attr("footer") == "center") {
									a(this).find("tr:last").find("td").css("text-align", "center")
								} else {
									if (a(this).attr("footer") == "normal") {
										a(this).find("tr:last").find("td:even").css("text-align", "right")
									}
								}
							}
						}
					} else {
						var d = a(this).find("tr:last").find("td").eq(0).attr("colspan");
						if (d) {
							if (d.toString() != "1") {
								a(this).find("tr:last").find("td").css("text-align", "center")
							}
						}
					}
					a(this).find("td").css({
						paddingTop: "3px",
						paddingBottom: "3px",
						border: "none"
					})
				} else {
					if (a(this).attr("formMode") == "view") {
						a(this).attr("useColor", "false");
						a(this).attr("useHover", "false");
						a(this).attr("useClick", "false");
						a(this).find("th").css({
							fontWeight: "bold",
							"text-align": "center"
						});
						a(this).find("tr").find("td:even").addClass("viewModeEven");
						if (a(this).attr("footer") != null) {
							if (a(this).attr("footer") == "left") {
								a(this).find("tr:last").find("td").css({
									textAlign: "left",
									backgroundColor: "#ffffff"
								})
							} else {
								if (a(this).attr("footer") == "right") {
									a(this).find("tr:last").find("td").css({
										textAlign: "right",
										backgroundColor: "#ffffff"
									})
								} else {
									if (a(this).attr("footer") == "center") {
										a(this).find("tr:last").find("td").css({
											textAlign: "center",
											backgroundColor: "#ffffff"
										})
									} else {
										if (a(this).attr("footer") == "normal") {
											a(this).find("tr:last").find("td:even").css({
												textAlign: "right",
												backgroundColor: "#ffffff"
											})
										}
									}
								}
							}
						} else {
							var f = a(this).find("tr:last").find("td").eq(0).attr("colspan");
							if (f) {
								if (f.toString() != "1") {
									a(this).find("tr:last").find("td").css({
										textAlign: "center",
										backgroundColor: "#ffffff"
									})
								}
							}
						}
						a(this).find("td").css({
							paddingTop: "6px",
							paddingBottom: "6px"
						})
					}
				}
			}
			a(this).find("th").addClass("th")
		})
	}
})(jQuery);

function getPosition(c, d) {
	var a = -1;
	for (var b = 0; b < d.length; b++) {
		if (c == d[b]) {
			a = b;
			break
		}
	}
	return a
}
jQuery.fn.extend({
	selectRender: function() {
		return this.each(function() {
			if ($(this).prev("div").hasClass("mainCon")) {
				$(this).prev("div").remove()
			}
			new jQuery.SelectBox(this)
		})
	},
	selectAddItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			var c = "list";
			if ($(this).attr("dataRoot")) {
				c = $(this).attr("dataRoot")
			}
			b[c].push(a);
			$(this).data("data", b);
			$(this).prev(".mainCon").remove();
			new jQuery.SelectBox(this)
		})
	},
	selectRemoveItem: function(a) {
		this.each(function() {
			var b = $(this).data("data");
			var c = -1;
			var d = "list";
			if ($(this).attr("dataRoot")) {
				d = $(this).attr("dataRoot")
			}
			$.each(b[d], function(e, f) {
				if (f.value.toString() == a) {
					c = e
				}
			});
			if (c != -1) {
				b[d].splice(c, 1)
			}
			$(this).data("data", b);
			$(this).prev(".mainCon").remove();
			new jQuery.SelectBox(this)
		})
	}
});
if (!window.console) {
	var console = {
		log: function(a) {}
	}
}
var elm_id = 1;
jQuery.SelectBox = function(K) {
	var m = {};
	m.inputClass = m.inputClass || "selectbox";
	m.containerClass = m.containerClass || "selectbox-wrapper";
	m.hoverClass = m.hoverClass || "current";
	m.currentClass = m.selectedClass || "selected";
	m.debug = m.debug || false;
	elm_id++;
	var i = "0_input";
	var z = "0_button";
	var J = 0;
	var x = false;
	var u = 0;
	var N = $(K);
	var b = w(m);
	var p = g();
	var y = M(m);
	var G = false;
	var o = false;
	var A = 1;
	var s;
	var n;
	var c = 0;
	var O = 0;
	var e = 24;
	var f = 24;
	if (!splitMode) {
		var I = $(window.top.document.getElementById("theme"));
		if (I.attr("selInputHeight") != null) {
			e = Number(I.attr("selInputHeight"))
		}
		if (I.attr("selButtonWidth") != null) {
			f = Number(I.attr("selButtonWidth"))
		}
	}
	if (window.navigator.userAgent.indexOf("Windows") > -1) {
		c = 1
	}
	n = N.width();
	if (n == "0") {
		n = 116
	}
	var r;
	r = $("<input type='button' value=' ' class='selBtn'/>");
	r.attr("id", elm_id + "_button");
	var t = $("<div class='loader'>数据加载中...</div>");
	if (N.attr("colNum") != null) {
		A = parseInt(N.attr("colNum"))
	}
	if (N.attr("colWidth") != null) {
		s = Number(N.attr("colWidth"))
	} else {
		s = 100
	}
	var l = 99;
	if (N.attr("selWidth") != null) {
		l = Number(N.attr("selWidth")) - 22
	}
	y.width(l);
	N.hide().before(p);
	var R = $('<table cellspacing="0" cellpadding="0" style="border-style:none;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"></td><td class="ali01" style="border-style:none;;padding:0;margin:0;"></td></tr></table>');
	R.find("td").eq(0).append(y);
	R.find("td").eq(1).append(r);
	p.append(R);
	p.append(b);
	p.append(t);
	t.hide();
	if (N.attr("disabled") == "disabled" || N.attr("disabled") == "true" || N.attr("disabled") == true) {
		r.attr("disabled", true);
		r.addClass("selBtn_disabled");
		y.addClass("selectbox_disabled")
	}
	L();
	if (N.attr("editable") != null) {
		if (N.attr("editable") == "true") {
			o = true
		} else {
			o = false
		}
	}
	if (!o) {
		y.css({
			cursor: "pointer"
		});
		y.click(function(T) {
			i = $(T.target).attr("id");
			D();
			if (b.attr("hasfocus") == 0) {
				q()
			} else {
				a()
			}
		}).keydown(function(T) {
			switch (T.keyCode) {
			case 38:
				T.preventDefault();
				C(-1);
				break;
			case 40:
				T.preventDefault();
				C(1);
				break;
			case 13:
				T.preventDefault();
				$("li." + m.hoverClass).trigger("click");
				break;
			case 27:
				a();
				break
			}
		})
	} else {
		y.css({
			cursor: "text"
		});
		y.change(function() {
			N.attr("editValue", $(this).val())
		})
	}
	r.click(function(T) {
		z = $(T.target).attr("id");
		D();
		if (b.attr("hasfocus") == 0) {
			q()
		} else {
			a()
		}
	}).keydown(function(T) {
		switch (T.keyCode) {
		case 38:
			T.preventDefault();
			C(-1);
			break;
		case 40:
			T.preventDefault();
			C(1);
			break;
		case 13:
			T.preventDefault();
			$("li." + m.hoverClass).trigger("click");
			break;
		case 27:
			a();
			break
		}
	});

	function D() {
		var X;
		var U = b.find("li").length;
		if (A == 1) {
			X = U * 26
		} else {
			if (U % A == 0) {
				X = U * 26 / A
			} else {
				X = (U - U % A) * 26 / A + 26
			}
		}
		b.height(X);
		var T = 200;
		T = window.document.documentElement.clientHeight - (p.offset().top - $(window).scrollTop()) - 30;
		var W;
		if (!N.attr("boxWidth")) {
			W = b.width()
		}
		b.css({
			overflowY: "auto",
			overflowX: "hidden"
		});
		if (A != 1) {
			b.width((s + 6) * A)
		} else {
			if (!N.attr("boxWidth")) {
				b.width(W)
			} else {
				b.width(Number(N.attr("boxWidth")) + 1)
			}
		}
		var V = 0;
		if (N.attr("boxHeight")) {
			V = Number(N.attr("boxHeight"))
		}
		if (V != 0) {
			b.height(V);
			if (N.attr("openDirection") == "top") {
				b.css({
					top: -V
				})
			} else {
				if (N.attr("openDirection") == "bottom") {
					b.css({
						top: e
					})
				} else {
					if (T < V) {
						if (p.offset().top > V) {
							b.css({
								top: -V
							})
						} else {
							if (T < 100 && p.offset().top > T && p.offset().top > 100) {
								b.css({
									top: -V
								})
							} else {
								b.css({
									top: e
								})
							}
						}
					} else {
						b.css({
							top: e
						})
					}
				}
			}
		} else {
			if (N.attr("openDirection") == "top") {
				if (p.offset().top > X) {
					b.css({
						top: -X
					})
				} else {
					b.height(p.offset().top);
					b.css({
						top: -X
					})
				}
			} else {
				if (N.attr("openDirection") == "bottom") {
					if (T < X) {
						b.css({
							top: e
						});
						b.height(T)
					} else {
						b.css({
							top: e
						})
					}
				} else {
					if (T < X) {
						if (p.offset().top > X) {
							b.css({
								top: -X
							})
						} else {
							if (T < 100 && p.offset().top > T && p.offset().top > 100) {
								b.height(p.offset().top);
								b.css({
									top: -X
								})
							} else {
								b.css({
									top: e
								});
								b.height(T)
							}
						}
					} else {
						b.css({
							top: e
						})
					}
				}
			}
		}
		if (!N.attr("boxWidth")) {
			if (b.width() < l + f) {
				b.width(l + f)
			}
		}
	}
	function a() {
		b.attr("hasfocus", 0);
		b.hide();
		$("body").unbind("mousedown", P)
	}
	function q() {
		b.attr("hasfocus", 1);
		depth++;
		p.css({
			zIndex: depth
		});
		b.show();
		$("body").bind("mousedown", P)
	}
	function P(T) {
		if ($(T.target).attr("id") == i || $(T.target).attr("id") == z || $(T.target).parent().attr("class") == "selectbox-wrapper" || $(T.target).attr("class") == "selectbox-wrapper" || $(T.target).parents(".selectbox-wrapper").length > 0) {} else {
			a()
		}
	}
	function L() {
		b.append(E(y.attr("id"))).hide();
		var T = y.css("width")
	}
	function g() {
		var T = $("<div></div>");
		T.addClass("mainCon");
		return T
	}
	function w(T) {
		var U = $("<div></div>");
		U.attr("id", elm_id + "_container");
		U.addClass(T.containerClass);
		U.css({});
		U.attr("hasfocus", 0);
		return U
	}
	function M(U) {
		var T = document.createElement("input");
		var W = $(T);
		W.attr("id", elm_id + "_input");
		W.attr("type", "text");
		W.addClass(U.inputClass);
		if (broswerFlag == "IE8") {
			W.addClass("selectboxFont")
		}
		W.attr("autocomplete", "off");
		var V = false;
		if (N.attr("editable") != null) {
			if (N.attr("editable") == "true") {
				V = true
			} else {
				V = false
			}
		}
		if (!V) {
			if (broswerFlag == "Firefox") {
				W.attr("contenteditable", false)
			} else {
				W.attr("readonly", "readonly")
			}
		} else {
			W.attr("readonly", false)
		}
		W.attr("tabIndex", N.attr("tabindex"));
		if (N.attr("disabled") == "disabled" || N.attr("disabled") == "true" || N.attr("disabled") == true) {
			W.attr("disabled", true);
			W.addClass("inputDisabled")
		}
		return W
	}
	function C(U) {
		var T = $("li", b);
		if (!T || T.length == 0) {
			return false
		}
		J += U;
		if (J < 0) {
			J = T.size()
		} else {
			if (J > T.size()) {
				J = 0
			}
		}
		H(T, J);
		T.removeClass(m.hoverClass);
		$(T[J]).addClass(m.hoverClass)
	}
	function H(U, V) {
		var T = $(U[V]).get(0);
		var U = b.get(0);
		if (T.offsetTop + T.offsetHeight > U.scrollTop + U.clientHeight) {
			U.scrollTop = T.offsetTop + T.offsetHeight - U.clientHeight
		} else {
			if (T.offsetTop < U.scrollTop) {
				U.scrollTop = T.offsetTop
			}
		}
	}
	function h() {
		var T = $("li." + m.currentClass, b).get(0);
		var U = (T.id).split("_");
		var W = U[0].length + U[1].length + 2;
		var X = T.id;
		var V = X.substr(W, X.length);
		N.val(V);
		N.attr("relText", $(T).text());
		N.attr("relValue", V);
		var X = $(T).html().trim();
		y.val(X);
		if (o == true) {
			N.attr("editValue", y.val())
		}
		N.focus();
		return true
	}
	function d() {
		return N.val()
	}
	function S() {
		return y.val()
	}
	function E(X) {
		var Z = new Array();
		var ad = document.createElement("ul");
		var U = [];
		var ae = 0;
		var ai;
		if (N.attr("childId") != null) {
			ai = true
		}
		var ah;
		if (N.attr("editable") != null) {
			if (N.attr("editable") == "true") {
				ah = true
			} else {
				ah = false
			}
		}
		var T = false;
		var ab = N.attr("url");
		var V = N.attr("data");
		var W = N.data("data");
		if (ab != null || V != null || W != null) {
			T = true
		}
		if (T == true) {
			var ag = "list";
			if (N.attr("dataRoot")) {
				ag = N.attr("dataRoot")
			}
			var af = N.attr("params");
			var aa;
			if (af) {
				try {
					aa = JSON.parse(af)
				} catch (ac) {
					aa = "";
					alert("参数格式有误！（提示：放在标签中的json数据的属性和名称必须以双引号包围）")
				}
			} else {
				aa = ""
			}
			if (W) {
				F(W, X, A, s, ah, ai, ad, ag)
			} else {
				if (V) {
					var Y;
					try {
						Y = JSON.parse(V)
					} catch (ac) {
						Y = "";
						alert("参数格式有误！（提示：json数据key与value必须以双引号包围）")
					}
					N.data("data", Y);
					F(Y, X, A, s, ah, ai, ad, ag)
				} else {
					if (ab) {
						$.ajax({
							url: N.attr("url"),
							dataType: "json",
							data: aa,
							error: function() {
								alert("单选下拉框数据源出错，请检查url路径")
							},
							success: function(aj) {
								N.data("data", aj);
								F(aj, X, A, s, ah, ai, ad, ag)
							}
						})
					}
				}
			}
		} else {
			N.find("option").each(function() {
				U.push($(this)[0]);
				var aj = document.createElement("li");
				aj.setAttribute("id", X + "_" + $(this).val());
				aj.innerHTML = $(this).html();
				if ($(this).is(":selected")) {
					if (ah == true) {
						y.val($(this).html());
						$(aj).addClass(m.currentClass)
					} else {
						var al = $(this).html().trim();
						y.val(al);
						$(aj).addClass(m.currentClass)
					}
				}
				if (A != 1) {
					$(aj).addClass("li_left");
					if (s != null) {
						$(aj).width(s)
					} else {
						var ak = Number(n);
						$(aj).width(ak)
					}
				}
				ad.appendChild(aj);
				$(aj).mouseover(function(am) {
					u = 1;
					if (m.debug) {
						console.log("over on : " + this.id)
					}
					jQuery(am.target, b).addClass(m.hoverClass)
				}).mouseout(function(am) {
					u = -1;
					if (m.debug) {
						console.log("out on : " + this.id)
					}
					jQuery(am.target, b).removeClass(m.hoverClass)
				}).click(function(an) {
					var ao = $("li." + m.hoverClass, b).get(0);
					if (m.debug) {
						console.log("click on :" + this.id)
					}
					var am = $(this).attr("id").split("_");
					$("#" + am[0] + "_container li." + m.currentClass).removeClass(m.currentClass);
					$(this).addClass(m.currentClass);
					h();
					N.get(0).blur();
					a();
					try {
						N.trigger("change")
					} catch (ap) {}
					y.removeClass("tipColor");
					if (ai) {
						B(N, N.val())
					}
				});
				if (N.attr("editValue") != null) {
					y.val(N.attr("editValue"))
				}
			})
		}
		N.find("optgroup").each(function() {
			var ak = getPosition($(this).children("option").eq(0)[0], U);
			var aj = $(this).attr("label");
			$(ad).find("li").eq(ak + ae).before("<li class='group'>" + aj + "</li>");
			ae++
		});
		return ad
	}
	function F(Y, W, U, Z, af, ag, ac, ad, aa) {
		if (!Y) {
			return
		}
		var T = "请选择";
		if (N.attr("prompt") != null) {
			if (N.attr("prompt") == "") {
				T = "请选择"
			} else {
				T = N.attr("prompt")
			}
		}
		var X = -1;
		var ab = "";
		if (N.attr("selectedIdx")) {
			X = Number(N.attr("selectedIdx"))
		}
		if (N.attr("selectedValue")) {
			ab = N.attr("selectedValue")
		}
		N.attr("length", 10);
		if (N.attr("prompt") != null) {
			var ae = document.createElement("li");
			ae.setAttribute("id", W + "_");
			ae.innerHTML = T;
			if (X == -1 && ab == "") {
				$(ae).addClass(m.currentClass);
				y.val(ae.innerHTML)
			}
			ac.appendChild(ae);
			N[0].options.length = 0;
			N[0].options[N[0].options.length] = new Option(T, "");
			if (U != 1) {
				$(ae).addClass("li_left");
				if (Z != null) {
					$(ae).width(Z)
				} else {
					var V = Number(n);
					$(ae).width(V)
				}
			}
			$(ae).mouseover(function(ah) {
				u = 1;
				if (m.debug) {
					console.log("over on : " + this.id)
				}
				jQuery(ah.target, b).addClass(m.hoverClass)
			}).mouseout(function(ah) {
				u = -1;
				if (m.debug) {
					console.log("out on : " + this.id)
				}
				jQuery(ah.target, b).removeClass(m.hoverClass)
			}).click(function(ai) {
				var aj = $("li." + m.hoverClass, b).get(0);
				if (m.debug) {
					console.log("click on :" + this.id)
				}
				var ah = $(this).attr("id").split("_");
				$("#" + ah[0] + "_container li." + m.currentClass).removeClass(m.currentClass);
				$(this).addClass(m.currentClass);
				h();
				N.get(0).blur();
				a();
				N.trigger("change");
				y.removeClass("tipColor");
				if (ag) {
					B(N, N.val())
				}
			})
		}
		if (N.attr("prompt") == null) {
			if (X == -1 && ab == "") {
				X = 0
			}
		}
		$.each(Y[ad], function(ai, ak) {
			var ah = document.createElement("li");
			ah.setAttribute("id", W + "_" + ak.value);
			ah.innerHTML = ak.key;
			$(ah).data("itemData", ak);
			N[0].options[N[0].options.length] = new Option(ak.key, ak.value);
			if (X == ai) {
				if (af == true) {
					$(ah).addClass(m.currentClass);
					y.val(ah.innerHTML);
					N.val(ak.value);
					N.attr("relText", ak.key);
					N.attr("editValue", ak.key)
				} else {
					$(ah).addClass(m.currentClass);
					y.val(ah.innerHTML.trim());
					N.val(ak.value);
					N.attr("relText", ak.key);
					N.attr("relValue", ak.value)
				}
				N.data("selectedNode", ak);
				if (ag) {
					B(N, ak.value)
				}
			} else {
				if (ab != "") {
					if (ab == ak.value.toString()) {
						if (af == true) {
							$(ah).addClass(m.currentClass);
							y.val(ah.innerHTML);
							N.val(ak.value);
							N.attr("relText", ak.key);
							N.attr("editValue", ak.key)
						} else {
							$(ah).addClass(m.currentClass);
							y.val(ah.innerHTML.trim());
							N.val(ak.value);
							N.attr("relText", ak.key);
							N.attr("relValue", ak.value)
						}
						N.data("selectedNode", ak);
						if (ag) {
							B(N, ak.value)
						}
					}
				}
			}
			if (U != 1) {
				$(ah).addClass("li_left");
				if (Z != null) {
					$(ah).width(Z)
				} else {
					var aj = Number(n);
					$(ah).width(aj)
				}
			}
			$(ah).mouseover(function(al) {
				u = 1;
				if (m.debug) {
					console.log("over on : " + this.id)
				}
				jQuery(al.target, b).addClass(m.hoverClass)
			}).mouseout(function(al) {
				u = -1;
				if (m.debug) {
					console.log("out on : " + this.id)
				}
				jQuery(al.target, b).removeClass(m.hoverClass)
			}).click(function(am) {
				var an = $("li." + m.hoverClass, b).get(0);
				if (m.debug) {
					console.log("click on :" + this.id)
				}
				var al = $(this).attr("id").split("_");
				$("#" + al[0] + "_container li." + m.currentClass).removeClass(m.currentClass);
				$(this).addClass(m.currentClass);
				h();
				N.data("selectedNode", $(this).data("itemData"));
				N.get(0).blur();
				a();
				N.trigger("change");
				y.removeClass("tipColor");
				if (ag) {
					B(N, N.val())
				}
			});
			ac.appendChild(ah);
			if (N.attr("editValue") != null) {
				y.val(N.attr("editValue"))
			}
		});
		N.attr("finished", "true")
	}
	function B(V, U) {
		var W = V.attr("childId");
		var T = $("#" + W).prev().find("div[class=loader]");
		T.show();
		window.setTimeout(function() {
			Q(V, U)
		}, 200)
	}
	function Q(V, U) {
		var T;
		if (V.attr("childDataType") == null) {
			T = V.attr("childDataPath") + U
		} else {
			if (V.attr("childActionType") == "local") {
				T = V.attr("childDataPath") + U + "." + V.attr("childDataType")
			} else {
				T = V.attr("childDataPath") + U
			}
		}
		if (V.attr("childDataType") == "xml") {
			$.ajax({
				url: T,
				error: function() {
					try {
						top.Dialog.alert("数据加载失败，请检查childDataPath是否正确")
					} catch (W) {
						alert("数据加载失败，请检查childDataPath是否正确")
					}
				},
				success: function(Z) {
					var W = V.attr("childId");
					var ae = $("#" + W).prev().find("div[class=loader]");
					ae.hide();
					var ac = $("#" + W).prev().find("ul");
					var Y = $("#" + W).prev().find(">div").attr("id").split("_")[0];
					var X = $("#" + W).prev().find("input:text");
					var aa = $("#" + W)[0];
					ac.html("");
					aa.options.length = 0;
					$(Z).find("node").each(function() {
						var ah = $(this).attr("text");
						var ag = $(this).attr("value");
						var af = document.createElement("li");
						$(af).text(ah);
						$(af).attr("relValue", ag);
						ac.append($(af));
						aa.options[aa.options.length] = new Option(ah, ag);
						$(af).mouseover(function(ai) {
							jQuery(ai.target).addClass(m.hoverClass)
						});
						$(af).mouseout(function(ai) {
							jQuery(ai.target).removeClass(m.hoverClass)
						});
						$(af).mousedown(function(aj) {
							$("#" + Y + "_container li." + m.currentClass).removeClass(m.currentClass);
							$(this).addClass(m.currentClass);
							$("#" + W).attr("relText", $(this).text());
							$("#" + W).attr("relValue", $(this).attr("relValue"));
							$("#" + W).val($(this).attr("relValue"));
							X.val($(this).html());
							$("#" + W).prev().find(">div").hide();
							$("#" + W).focus();
							if ($("#" + W).attr("onchange") != null) {}
							try {
								$("#" + W).trigger("change")
							} catch (ak) {}
							var ai;
							if ($("#" + W).attr("childId") != null) {
								ai = true
							}
							if (ai) {
								B($("#" + W), $("#" + W).val())
							}
						})
					});
					if ($(Z).find("node").length == 0) {
						var ad = document.createElement("li");
						$(ad).text("无内容");
						ac.append($(ad))
					}
					var ab = ac.find("li").eq(0);
					X.val(ab.text());
					ab.addClass(m.currentClass);
					$("#" + W).val(ab.attr("relValue"));
					$("#" + W).attr("relValue", ab.attr("relValue"));
					$("#" + W).attr("relText", ab.text());
					$("#" + W).trigger("ajaxInit")
				}
			})
		} else {
			$.getJSON(T, function(Z) {
				var aa = V.attr("childId");
				var ac = $("#" + aa).prev().find("div[class=loader]");
				ac.hide();
				var am = $("#" + aa).prev().find("ul");
				var ab = $("#" + aa).prev().find(">div").attr("id").split("_")[0];
				var aj = $("#" + aa).prev().find("input:text");
				var X = $("#" + aa)[0];
				var ag = $("#" + aa);
				am.html("");
				X.options.length = 0;
				var ae = "list";
				if ($("#" + aa).attr("dataRoot")) {
					ae = $("#" + aa).attr("dataRoot")
				}
				if ($("#" + aa).attr("prompt")) {
					var af = document.createElement("li");
					var ai = $("#" + aa).attr("prompt");
					$(af).text(ai);
					$(af).attr("relValue", "");
					am.append($(af));
					X.options[X.options.length] = new Option(ai, "");
					$(af).mouseover(function(an) {
						jQuery(an.target).addClass(m.hoverClass)
					});
					$(af).mouseout(function(an) {
						jQuery(an.target).removeClass(m.hoverClass)
					});
					$(af).mousedown(function(an) {
						$("#" + ab + "_container li." + m.currentClass).removeClass(m.currentClass);
						$(this).addClass(m.currentClass);
						$("#" + aa).attr("relText", $(this).text());
						$("#" + aa).attr("relValue", $(this).attr("relValue"));
						$("#" + aa).val($(this).attr("relValue"));
						aj.val($(this).html());
						$("#" + aa).prev().find(">div").hide();
						$("#" + aa).focus();
						if ($("#" + aa).attr("onchange") != null) {}
						try {
							$("#" + aa).trigger("change")
						} catch (ao) {}
					})
				}
				var ah = -1;
				var W = "";
				var al;
				var ad;
				if (ag.attr("childId") != null) {
					ad = true
				}
				if (ag.attr("selectedIdx")) {
					ah = Number(ag.attr("selectedIdx"))
				}
				if (ag.attr("selectedValue")) {
					W = ag.attr("selectedValue")
				}
				if (ag.attr("editable") != null) {
					if (ag.attr("editable") == "true") {
						al = true
					} else {
						al = false
					}
				}
				$.each(Z[ae], function(an, aq) {
					var ao = aq.key;
					var ap = aq.value;
					var ar = document.createElement("li");
					$(ar).text(ao);
					$(ar).attr("relValue", ap);
					$(ar).data("itemData", aq);
					am.append($(ar));
					X.options[X.options.length] = new Option(ao, ap);
					if (ah == an) {
						if (al == true) {
							$(ar).addClass(m.currentClass);
							aj.val(ar.innerHTML);
							ag.val(aq.value);
							ag.attr("relText", aq.key);
							ag.attr("editValue", aq.key)
						} else {
							$(ar).addClass(m.currentClass);
							aj.val(ar.innerHTML.trim());
							ag.val(aq.value);
							ag.attr("relText", aq.key);
							ag.attr("relValue", aq.value)
						}
						ag.data("selectedNode", aq);
						if (rel) {
							B(ag, aq.value)
						}
					} else {
						if (W != "") {
							if (W == aq.value.toString()) {
								if (al == true) {
									$(ar).addClass(m.currentClass);
									aj.val(ar.innerHTML);
									ag.val(aq.value);
									ag.attr("relText", aq.key);
									ag.attr("editValue", aq.key)
								} else {
									$(ar).addClass(m.currentClass);
									aj.val(ar.innerHTML.trim());
									ag.val(aq.value);
									ag.attr("relText", aq.key);
									ag.attr("relValue", aq.value)
								}
								ag.data("selectedNode", aq);
								if (ad) {
									B(ag, aq.value)
								}
							}
						}
					}
					$(ar).mouseover(function(at) {
						jQuery(at.target).addClass(m.hoverClass)
					});
					$(ar).mouseout(function(at) {
						jQuery(at.target).removeClass(m.hoverClass)
					});
					$(ar).mousedown(function(at) {
						$("#" + ab + "_container li." + m.currentClass).removeClass(m.currentClass);
						$(this).addClass(m.currentClass);
						$("#" + aa).attr("relText", $(this).text());
						$("#" + aa).attr("relValue", $(this).attr("relValue"));
						$("#" + aa).data("selectedNode", $(this).data("itemData"));
						$("#" + aa).val($(this).attr("relValue"));
						aj.val($(this).html());
						$("#" + aa).prev().find(">div").hide();
						$("#" + aa).focus();
						if ($("#" + aa).attr("onchange") != null) {}
						try {
							$("#" + aa).trigger("change")
						} catch (au) {}
						if (ad) {
							B($("#" + aa), $("#" + aa).val())
						}
					})
				});
				if (Z.length == 0) {
					var ak = document.createElement("li");
					$(ak).text("无内容");
					am.append($(ak))
				}
				if (ah == -1 && W == "") {
					var Y = am.find("li").eq(0);
					aj.val(Y.text());
					Y.addClass(m.currentClass);
					$("#" + aa).val(Y.attr("relValue"));
					$("#" + aa).attr("relValue", Y.attr("relValue"));
					$("#" + aa).attr("relText", Y.text());
					$("#" + aa).data("selectedNode", Y.data("itemData"))
				}
				$("#" + aa).trigger("ajaxInit")
			})
		}
	}
};
var quiType = "advanced";
var tipDirection = "down";

function enableTooltips(e) {
	var b, a, c, d;
	if (!document.getElementById || !document.getElementsByTagName) {
		return
	}
	AddCss();
	d = document.createElement("span");
	d.id = "btc";
	d.setAttribute("id", "btc");
	d.style.position = "absolute";
	d.style.zIndex = 9999;
	$("body").append($(d))
}
function _getStrLength(c) {
	var b;
	var a;
	for (b = 0, a = 0; b < c.length; b++) {
		if (c.charCodeAt(b) < 128) {
			a++
		} else {
			a = a + 2
		}
	}
	return a
}
function addTooltip(f) {
	var g, d, a, e, c;
	d = f.getAttribute("title");
	if (d == " ") {
		f.removeAttribute("title");
		f.onmouseover = null;
		f.onmouseout = null;
		f.onmousemove = null;
		return
	}
	if (d != null && d.length != 0) {
		f.removeAttribute("title");
		if (_getStrLength(d) > 37 || _getStrLength(d) == 37) {
			g = CreateEl("span", "tooltip")
		} else {
			if (_getStrLength(d) > 10 && _getStrLength(d) < 37) {
				g = CreateEl("span", "tooltip_mid")
			} else {
				g = CreateEl("span", "tooltip_min")
			}
		}
		e = CreateEl("span", "top");
		$(e).html(d);
		g.appendChild(e);
		a = CreateEl("b", "bottom");
		g.appendChild(a);
		setOpacity(g);
		f.tooltip = g;
		f.onmouseover = showTooltip;
		f.onmouseout = hideTooltip;
		f.onmousemove = Locate2
	}
}
function hideTip(a) {
	var b = document.getElementById("btc");
	if (b.childNodes.length > 0) {
		b.removeChild(b.firstChild)
	}
}
function showTooltip(a) {
	document.getElementById("btc").appendChild(this.tooltip);
	Locate(a)
}
function hideTooltip() {
	var a = document.getElementById("btc");
	if (a.childNodes.length > 0) {
		a.removeChild(a.firstChild)
	}
}
function setOpacity(a) {
	a.style.filter = "alpha(opacity:95)";
	a.style.KHTMLOpacity = "0.95";
	a.style.MozOpacity = "0.95";
	a.style.opacity = "0.95"
}
function CreateEl(b, d) {
	var a = document.createElement(b);
	a.className = d;
	a.style.display = "block";
	return (a)
}
function AddCss() {}
function Locate(g) {
	var a = 0,
		i = 0;
	if (g == null) {
		g = window.event
	}
	if (g.pageX || g.pageY) {
		a = g.pageX;
		i = g.pageY
	} else {
		if (g.clientX || g.clientY) {
			if (document.documentElement.scrollTop) {
				a = g.clientX + document.documentElement.scrollLeft;
				i = g.clientY + document.documentElement.scrollTop
			} else {
				a = g.clientX + document.body.scrollLeft;
				i = g.clientY + document.body.scrollTop
			}
		}
	}
	var h = window.document.documentElement.clientWidth;
	var c = window.document.documentElement.clientHeight;
	var b = $("#btc").width();
	var f = $("#btc").height();
	var d = $("#btc >span")[0].className;
	if (h - b < a - 20) {
		document.getElementById("btc").style.left = (h - b) + "px";
		if (d == "tooltip") {
			$("#btc >span")[0].className = "tooltip_s"
		} else {
			if (d == "tooltip_min") {
				$("#btc >span")[0].className = "tooltip_min_s"
			} else {
				if (d == "tooltip_mid") {
					$("#btc >span")[0].className = "tooltip_mid_s"
				}
			}
		}
	} else {
		document.getElementById("btc").style.left = (a - 20) + "px"
	}
	if ($(window).scrollTop() + c - f < i) {
		document.getElementById("btc").style.top = (i - f - 10) + "px";
		if (d == "tooltip") {
			$("#btc >span")[0].className = "tooltip_r"
		} else {
			if (d == "tooltip_min") {
				$("#btc >span")[0].className = "tooltip_min_r"
			} else {
				if (d == "tooltip_mid") {
					$("#btc >span")[0].className = "tooltip_mid_r"
				}
			}
		}
		tipDirection = "up"
	} else {
		document.getElementById("btc").style.top = (i + 10) + "px";
		if (d == "tooltip_r") {
			$("#btc >span")[0].className = "tooltip"
		} else {
			if (d == "tooltip_min_r") {
				$("#btc >span")[0].className = "tooltip_min"
			} else {
				if (d == "tooltip_mid_r") {
					$("#btc >span")[0].className = "tooltip_mid"
				}
			}
		}
		tipDirection = "down"
	}
}
function Locate2(f) {
	var a = 0,
		h = 0;
	if (f == null) {
		f = window.event
	}
	if (f.pageX || f.pageY) {
		a = f.pageX;
		h = f.pageY
	} else {
		if (f.clientX || f.clientY) {
			if (document.documentElement.scrollTop) {
				a = f.clientX + document.documentElement.scrollLeft;
				h = f.clientY + document.documentElement.scrollTop
			} else {
				a = f.clientX + document.body.scrollLeft;
				h = f.clientY + document.body.scrollTop
			}
		}
	}
	var g = window.document.documentElement.clientWidth;
	var c = window.document.documentElement.clientHeight;
	var b = $("#btc").width();
	var d = $("#btc").height();
	if (g - b < a - 20) {
		document.getElementById("btc").style.left = (g - b) + "px"
	} else {
		document.getElementById("btc").style.left = (a - 20) + "px"
	}
	if (tipDirection == "up") {
		document.getElementById("btc").style.top = (h - d - 10) + "px"
	} else {
		document.getElementById("btc").style.top = (h + 10) + "px"
	}
}(function(c) {
	var h, i;
	var d = 0;
	var a = 32;
	var e;
	c.fn.TextAreaResizer = function() {
		return this.each(function() {
			h = c(this).addClass("processed"), i = null;
			c(this).wrap('<div class="resizable-textarea"><span></span></div>').parent().append(c('<div class="grippie"></div>').bind("mousedown", {
				el: this
			}, b)).wrap('<table cellspacing="0" cellpadding="0" style="border-style:none;"><tr><td class="ali01" style="border-style:none;padding:0;margin:0;"></td></tr></table>');
			var m = c("div.grippie", c(this).parent())
		})
	};

	function b(m) {
		h = c(m.data.el);
		h.blur();
		d = l(m).y;
		i = h.height() - d;
		h.css("opacity", 0.25);
		c(document).mousemove(g).mouseup(f);
		return false
	}
	function g(o) {
		var m = l(o).y;
		var n = i + m;
		if (d >= (m)) {
			n -= 5
		}
		d = m;
		n = Math.max(a, n);
		h.height(n + "px");
		if (n < a) {
			f(o)
		}
		return false
	}
	function f(m) {
		c(document).unbind("mousemove", g).unbind("mouseup", f);
		h.css("opacity", 1);
		h.focus();
		h = null;
		i = null;
		d = 0
	}
	function l(m) {
		return {
			x: m.clientX + document.documentElement.scrollLeft,
			y: m.clientY + document.documentElement.scrollTop
		}
	}
})(jQuery);
(function(a) {
	a.fn.watermark = function(b, c) {
		return this.each(function() {
			var e = a(this),
				d;
			e.focus(function() {
				d && !(d = 0) && e.removeClass(b).data("w", 0).val("")
			}).blur(function() {
				!e.val() && (d = 1) && e.addClass(b).data("w", 1).val(c)
			}).closest("form").submit(function() {
				d && e.val("")
			});
			e.blur()
		})
	};
	a.fn.removeWatermark = function() {
		return this.each(function() {
			a(this).data("w") && a(this).val("")
		})
	}
})(jQuery);
if (jQuery) {
	(function(a) {
		a.cursorMessageData = {};
		a(window).ready(function(b) {
			if (a("#cursorMessageDiv").length == 0) {
				a("body").append('<div id="cursorMessageDiv">&nbsp;</div>');
				a("#cursorMessageDiv").hide()
			}
			a("body").mousemove(function(c) {
				a.cursorMessageData.mouseX = c.pageX;
				a.cursorMessageData.mouseY = c.pageY;
				if (a.cursorMessageData.options != undefined) {
					a._showCursorMessage()
				}
			})
		});
		a.extend({
			cursorMessage: function(c, b) {
				if (b == undefined) {
					b = {}
				}
				if (b.offsetX == undefined) {
					b.offsetX = 5
				}
				if (b.offsetY == undefined) {
					b.offsetY = 5
				}
				if (b.hideTimeout == undefined) {
					b.hideTimeout = 3000
				}
				a("#cursorMessageDiv").html(c).show();
				if (jQuery.cursorMessageData.hideTimeoutId != undefined) {
					clearTimeout(jQuery.cursorMessageData.hideTimeoutId)
				}
				if (b.hideTimeout > 0) {
					jQuery.cursorMessageData.hideTimeoutId = setTimeout(a.hideCursorMessage, b.hideTimeout)
				}
				jQuery.cursorMessageData.options = b;
				a._showCursorMessage()
			},
			hideCursorMessage: function() {
				a("#cursorMessageDiv").hide()
			},
			_showCursorMessage: function() {
				a("#cursorMessageDiv").css({
					top: (a.cursorMessageData.mouseY + a.cursorMessageData.options.offsetY) + "px",
					left: (a.cursorMessageData.mouseX + a.cursorMessageData.options.offsetX)
				})
			}
		})
	})(jQuery)
}
jQuery.fn.caps = function(a) {
	return this.keypress(function(f) {
		var b = f.which ? f.which : (f.keyCode ? f.keyCode : -1);
		var d = f.shiftKey ? f.shiftKey : (f.modifiers ? !! (f.modifiers & 4) : false);
		var g = ((b >= 65 && b <= 90) && !d) || ((b >= 97 && b <= 122) && d);
		a.call(this, g)
	})
};

function iframeHeight(b) {
	var a = document.getElementById(b);
	a.style.height = a.contentWindow.document.body.scrollHeight + "px"
}(function(d) {
	d.fn.clearableTextField = function() {
		if (d(this).length > 0) {
			d(this).bind("keyup change paste cut", e);
			for (var f = 0; f < d(this).length; f++) {
				c(d(d(this)[f]))
			}
		}
	};

	function e() {
		c(d(this))
	}
	function c(f) {
		if (f.val().length > 0) {
			b(f)
		} else {
			a(f)
		}
	}
	function b(i) {
		if (!i.next().hasClass("text_clear_button")) {
			i.after("<div class='text_clear_button'></div>");
			var f = i.next();
			var g = f.outerHeight(),
				m = f.outerHeight();
			i.css("padding-right", parseInt(i.css("padding-right")) + g + 1);
			i.width(i.width() - g - 1);
			var o = i.position();
			var l = {};
			l.left = o.left + i.outerWidth(false) - (g + 2);
			var n = Math.round((i.outerHeight(true) - m) / 2);
			l.top = o.top + d("#scrollContent").scrollTop() + n;
			f.css(l);
			f.click(function() {
				i.val("");
				c(i)
			})
		}
	}
	function a(h) {
		var f = h.next();
		if (f.hasClass("text_clear_button")) {
			f.remove();
			var g = f.width();
			h.css("padding-right", parseInt(h.css("padding-right")) - g - 1);
			h.width(h.width() + g + 1)
		}
	}
})(jQuery);
(function(a) {
	a.fn.maxlength = function(b) {
		var c = jQuery.extend({
			events: [],
			maxCharacters: 10,
			status: true,
			statusClass: "maxNum",
			statusText: "剩余字数",
			notificationClass: "notification",
			showAlert: false,
			alertText: "输入字符超出限制.",
			slider: true
		}, b);
		a.merge(c.events, ["keyup"]);
		return this.each(function() {
			var g = a(this);
			var l = a(this).val().length;

			function d() {
				var m = c.maxCharacters - l;
				if (m < 0) {
					m = 0
				}
				g.next("div").html(c.statusText + " :" + m)
			}
			function e() {
				var m = true;
				if (l >= c.maxCharacters) {
					m = false;
					g.addClass(c.notificationClass);
					g.val(g.val().substr(0, c.maxCharacters));
					i()
				} else {
					if (g.hasClass(c.notificationClass)) {
						g.removeClass(c.notificationClass)
					}
				}
				if (c.status) {
					d()
				}
			}
			function i() {
				if (c.showAlert) {
					alert(c.alertText)
				}
			}
			function f() {
				var m = false;
				if (g.is("textarea")) {
					m = true
				} else {
					if (g.filter("input[type=text]")) {
						m = true
					} else {
						if (g.filter("input[type=password]")) {
							m = true
						}
					}
				}
				return m
			}
			if (!f()) {
				return false
			}
			a.each(c.events, function(m, o) {
				g.bind(o, function(n) {
					l = g.val().length;
					e()
				})
			});
			if (c.status) {
				g.after(a("<div/>").addClass(c.statusClass).html("-"));
				d()
			}
			if (!c.status) {
				var h = g.next("div." + c.statusClass);
				if (h) {
					h.remove()
				}
			}
			if (c.slider) {
				g.next().hide();
				g.focus(function() {
					g.next().slideDown("fast")
				});
				g.blur(function() {
					g.next().slideUp("fast")
				})
			}
		})
	}
})(jQuery);
var colsDefault = 0;
var rowsDefault = 5;

function setDefaultValues(a) {
	colsDefault = a.cols;
	rowsDefault = $(a).attr("rows")
}
function bindEvents(a) {
	a.onkeyup = function() {
		grow(a)
	}
}
function grow(d) {
	var c = 0;
	var a = d.value.split("\n");
	for (var b = a.length - 1; b >= 0; --b) {
		c += Math.floor((a[b].length / colsDefault) + 1)
	}
	if (c >= rowsDefault) {
		d.rows = c + 1
	} else {
		d.rows = rowsDefault
	}
}
jQuery.fn.autoGrow = function() {
	return this.each(function() {
		setDefaultValues(this);
		bindEvents(this)
	})
};
(function(b) {
	var a = new function() {
			this.countRegexp = function(d, e) {
				var c = d.match(e);
				return c ? c.length : 0
			};
			this.getStrength = function(i, e) {
				var c = i.length;
				if (c < e) {
					return 0
				}
				var g = this.countRegexp(i, /\d/g),
					l = this.countRegexp(i, /[a-z]/g),
					f = this.countRegexp(i, /[A-Z]/g),
					d = c - g - l - f;
				if (g == c || l == c || f == c || d == c) {
					return 1
				}
				var h = 0;
				if (g) {
					h += 2
				}
				if (l) {
					h += f ? 4 : 3
				}
				if (f) {
					h += l ? 4 : 3
				}
				if (d) {
					h += 5
				}
				if (c > 10) {
					h += 1
				}
				return h
			};
			this.getStrengthLevel = function(e, c) {
				var d = this.getStrength(e, c);
				switch (true) {
				case (d <= 0):
					return 1;
					break;
				case (d > 0 && d <= 4):
					return 2;
					break;
				case (d > 4 && d <= 8):
					return 3;
					break;
				case (d > 8 && d <= 12):
					return 4;
					break;
				case (d > 12):
					return 5;
					break
				}
				return 1
			}
		};
	b.fn.password_strength = function(c) {
		var d = b.extend({
			container: null,
			minLength: 6,
			texts: {
				1: "非常弱",
				2: "弱密码",
				3: "强度一般",
				4: "强密码",
				5: "非常强"
			}
		}, c);
		return this.each(function() {
			if (d.container) {
				var e = b(d.container)
			} else {
				var e = b("<span/>").attr("class", "password_strength");
				b(this).after(e)
			}
			b(this).keyup(function() {
				var g = b(this).val();
				if (g.length > 0) {
					var h = a.getStrengthLevel(g, d.minLength);
					var f = "password_strength_" + h;
					if (!e.hasClass(f) && h in d.texts) {
						e.text(d.texts[h]).attr("class", "password_strength " + f)
					}
				} else {
					e.text("").attr("class", "password_strength")
				}
			})
		})
	}
})(jQuery);
jQuery.jCookie = function(i, b, n, l) {
	if (!navigator.cookieEnabled) {
		return false
	}
	var l = l || {};
	if (typeof(arguments[0]) !== "string" && arguments.length === 1) {
		l = arguments[0];
		i = l.name;
		b = l.value;
		n = l.expires
	}
	i = encodeURI(i);
	if (b && (typeof(b) !== "number" && typeof(b) !== "string" && b !== null)) {
		return false
	}
	var e = l.path ? "; path=" + l.path : "";
	var f = l.domain ? "; domain=" + l.domain : "";
	var d = l.secure ? "; secure" : "";
	var g = "";
	if (b || (b === null && arguments.length == 2)) {
		n = (n === null || (b === null && arguments.length == 2)) ? -1 : n;
		if (typeof(n) === "number" && n != "session" && n !== undefined) {
			var m = new Date();
			m.setTime(m.getTime() + (n * 24 * 60 * 60 * 1000));
			g = ["; expires=", m.toGMTString()].join("")
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
function closeProgress() {
	try {
		if (top.progressFlag == 1) {
			top.Dialog.close();
			top.progressFlag = 0
		} else {
			if (top.progressFlag == 2) {
				top.hideSimpleProgress();
				top.progressFlag = 0
			}
		}
	} catch (a) {}
}
function _initComplete() {
	try {
		initComplete()
	} catch (a) {}
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
(function(a) {
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
	a.maskElement = function(e, d, g, c) {
		if (e.data("_mask_timeout") !== undefined) {
			clearTimeout(e.data("_mask_timeout"));
			e.removeData("_mask_timeout")
		}
		if (e.isMasked()) {
			a.unmaskElement(e)
		}
		if (e.css("position") == "static") {
			e.addClass("masked-relative")
		}
		e.addClass("masked");
		var f = a('<div class="loadmask"></div>');
		f.css({
			backgroundColor: c
		});
		if (navigator.userAgent.toLowerCase().indexOf("msie") > -1) {
			f.height(e.height() + parseInt(e.css("padding-top")) + parseInt(e.css("padding-bottom")));
			f.width(e.width() + parseInt(e.css("padding-left")) + parseInt(e.css("padding-right")))
		}
		if (navigator.userAgent.toLowerCase().indexOf("msie 6") > -1) {
			e.find("select").addClass("masked-hidden")
		}
		e.append(f);
		f.show();
		if (d !== undefined && d != null) {
			var b = a('<div class="loadmask-msg" style="display:none;"></div>');
			if (g) {
				b.append('<div class="mask_lading">' + d + "</div>")
			} else {
				b.append('<div  class="normal">' + d + "</div>")
			}
			e.append(b);
			b.css("top", Math.round(e.height() / 2 - (b.height() - parseInt(b.css("padding-top")) - parseInt(b.css("padding-bottom"))) / 2) + "px");
			b.css("left", Math.round(e.width() / 2 - (b.width() - parseInt(b.css("padding-left")) - parseInt(b.css("padding-right"))) / 2) + "px");
			b.show()
		}
	};
	a.unmaskElement = function(b) {
		if (b.data("_mask_timeout") !== undefined) {
			clearTimeout(b.data("_mask_timeout"));
			b.removeData("_mask_timeout")
		}
		b.find(".loadmask-msg,.loadmask").remove();
		b.removeClass("masked");
		b.removeClass("masked-relative");
		b.find("select").removeClass("masked-hidden")
	}
})(jQuery);
var JSON;
if (!JSON) {
	JSON = {}
}(function() {
	function f(n) {
		return n < 10 ? "0" + n : n
	}
	if (typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function(key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
			return this.valueOf()
		}
	}
	//var cx=/[\\fj\\be\\a4-\\bh\\bn\\b2\\b1\\b0-\\aT\\aJ-\\aI\\aM-\\aN\\aR\\bl-\\b7]/g,
	//escapable=/[\\\\\\"\\fo-\\fm\\fl-\\fU\\be\\a4-\\bh\\bn\\b2\\b1\\b0-\\aT\\aJ-\\aI\\aM-\\aN\\aR\\bl-\\b7]/g,
	var	gap, indent, meta = {
			"\b": "\\b",
			"\t": "\\t",
			"\n": "\\n",
			"\f": "\\f",
			"\r": "\\r",
			'"': '\\"',
			"\\": "\\\\"
		},
		rep;

	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
			var c = meta[a];
			return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
		}) + '"' : '"' + string + '"'
	}
	function str(key, holder) {
		var i, k, v, length, mind = gap,
			partial, value = holder[key];
		if (value && typeof value === "object" && typeof value.toJSON === "function") {
			value = value.toJSON(key)
		}
		if (typeof rep === "function") {
			value = rep.call(holder, key, value)
		}
		switch (typeof value) {
		case "string":
			return quote(value);
		case "number":
			return isFinite(value) ? String(value) : "null";
		case "boolean":
		case "null":
			return String(value);
		case "object":
			if (!value) {
				return "null"
			}
			gap += indent;
			partial = [];
			if (Object.prototype.toString.apply(value) === "[object Array]") {
				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || "null"
				}
				v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
				gap = mind;
				return v
			}
			if (rep && typeof rep === "object") {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === "string") {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ": " : ":") + v)
						}
					}
				}
			} else {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ": " : ":") + v)
						}
					}
				}
			}
			v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
			gap = mind;
			return v
		}
	}
	if (typeof JSON.stringify !== "function") {
		JSON.stringify = function(value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " "
				}
			} else {
				if (typeof space === "string") {
					indent = space
				}
			}
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify")
			}
			return str("", {
				"": value
			})
		}
	}
	if (typeof JSON.parse !== "function") {
		JSON.parse = function(text, reviver) {
			function walk(holder, key) {
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v
							} else {
								delete value[k]
							}
						}
					}
				}
				return reviver.call(holder, key, value)
			}
			text = String(text);
			cx.lastIndex = 0;
			alert(text);
			if (cx.test(text)) {
				text = text.replace(cx, function(a) {
					return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
				})
			}
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return typeof reviver === "function" ? walk({
					"": j
				}, "") : j
			}
			throw new SyntaxError("JSON.parse")
		}
	}
}());

function validateInput(c, b) {
	var a = new RegExp(b);
	return a.test(c)
}
function createPosition(c, a) {
	var b;
	if (a == "normal") {
		b = $('<div class="position"><div class="center"><div class="left"><div class="right"><span></span></div></div></div></div>')
	} else {
		if (a == "simple") {
			b = $('<div class="positionSimple"><span></span></div>')
		}
	}
	b.find("span").append(c);
	$("body").prepend(b)
}
$.fn.createBoxItem = function(d, f) {
	var c = $(this);
	var g = c.parents(".box4");
	c.empty();
	var e;
	var a = "double";
	if (d.type) {
		if (d.type == "single") {
			a = "single"
		}
	}
	if (a == "single") {
		g.attr("noTitle", "false");
		g.attr("panelTitle", d.title);
		g.box4Build();
		var b = $("<ul></ul>");
		c.append(b);
		$.each(d.list, function(h, m) {
			var l = $('<li><a><span class="text_slice"></span></a></li>');
			if (m.link != "") {
				var i = l.find("a");
				i.attr("href", m.link);
				i.attr("target", f)
			}
			l.find(".text_slice").text(m.name);
			b.append(l)
		})
	} else {
		g.attr("noTitle", "true");
		g.box4Build();
		$.each(d.list, function(h, i) {
			if (h == 0) {
				e = i.link
			}
			if (i.type == "parent") {
				var m = $('<div class="subtitle"></div>');
				var l;
				if (i.link != "") {
					l = $('<a><div class="subtitle_con"></div></a>');
					l.attr("href", i.link);
					l.attr("target", f)
				} else {
					l = $('<div class="subtitle_con"></div>')
				}
				m.append(l);
				m.find(".subtitle_con").text(i.name);
				m.attr("id", "boxitem_" + i.id);
				c.append(m);
				c.append("<ul></ul>")
			}
		});
		$.each(d.list, function(h, n) {
			if (n.type == "child") {
				var l = $('<li><a><span class="text_slice"></span></a></li>');
				if (n.link != "") {
					var m = l.find("a");
					m.attr("href", n.link);
					m.attr("target", f)
				}
				l.find(".text_slice").text(n.name);
				var i = n.pid;
				$("#boxitem_" + i).next("ul").append(l)
			}
		});
		c.find(".subtitle a").each(function() {
			$(this).unbind("click");
			$(this).click(function() {
				c.find("li a").removeClass("current")
			})
		})
	}
	c.find("li a").each(function(h) {
		$(this).unbind("click");
		$(this).click(function() {
			c.find("li a").removeClass("current");
			$(this).addClass("current");
			if ($(this).attr("href") != null) {
				showProgressBar();
				if (a == "single") {
					if (d.title) {
						top.positionContent = "【当前位置：" + d.title + ">>" + $(this).text() + "】"
					} else {
						top.positionContent = "【当前位置：" + $(this).text() + "】"
					}
				} else {
					if (d.title) {
						top.positionContent = "【当前位置：" + d.title + ">>" + $(this).parents("ul").prev(".subtitle").eq(0).text() + ">>" + $(this).text() + "】"
					} else {
						top.positionContent = "【当前位置：" + $(this).parents("ul").prev(".subtitle").eq(0).text() + ">>" + $(this).text() + "】"
					}
				}
				top.positionType = "simple"
			}
		})
	});
	$("#" + f).attr("src", e)
};

function showCodePage(c, a) {
	var b = new top.Dialog();
	b.Title = a;
	b.Modal = false;
	b.ID = "code1";
	b.URL = c;
	b.ShowMaxButton = true;
	b.ShowMinButton = true;
	b.Width = 900;
	b.Height = 540;
	b.MaxEvent = function() {
		b.innerFrame.contentWindow.changeCodeHeight($(top.document.getElementById("_DialogBGDiv")).height() - 55)
	};
	b.DecreaseEvent = function() {
		b.innerFrame.contentWindow.changeCodeHeight(530)
	};
	b.show()
};
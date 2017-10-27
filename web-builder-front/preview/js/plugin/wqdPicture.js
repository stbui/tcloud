(function(t, e, i) {
    function n(i, n, o) {
        var r = e.createElement(i);
        return n && (r.id = Z + n), o && (r.style.cssText = o), t(r)
    }

    function o() {
        return i.innerHeight ? i.innerHeight : t(i).height()
    }

    function r(e, i) {
        i !== Object(i) && (i = {}), this.cache = {}, this.el = e, this.value = function(e) {
            var n;
            return void 0 === this.cache[e] && (n = t(this.el).attr("data-cbox-" + e), void 0 !== n ? this.cache[e] = n : void 0 !== i[e] ? this.cache[e] = i[e] : void 0 !== X[e] && (this.cache[e] = X[e])), this.cache[e]
        }, this.get = function(e) {
            var i = this.value(e);
            return t.isFunction(i) ? i.call(this.el, this) : i
        }
    }

    function h(t) {
        var e = W.length,
            i = (A + t) % e;
        return 0 > i ? e + i : i
    }

    function a(t, e) {
        return Math.round((/%/.test(t) ? ("x" === e ? E.width() : o()) / 100 : 1) * parseInt(t, 10))
    }

    function s(t, e) {
        return t.get("photo") || t.get("photoRegex").test(e)
    }

    function l(t, e) {
        return t.get("retinaUrl") && i.devicePixelRatio > 1 ? e.replace(t.get("photoRegex"), t.get("retinaSuffix")) : e
    }

    function d(t) {
        "contains" in y[0] && !y[0].contains(t.target) && t.target !== v[0] && (t.stopPropagation(), y.focus())
    }

    function c(t) {
        c.str !== t && (y.add(v).removeClass(c.str).addClass(t), c.str = t)
    }

    function g(e) {
        A = 0, e && e !== !1 && "nofollow" !== e ? (W = t("." + te).filter(function() {
            var i = t.data(this, Y),
                n = new r(this, i);
            return n.get("rel") === e
        }), A = W.index(_.el), -1 === A && (W = W.add(_.el), A = W.length - 1)) : W = t(_.el)
    }

    function u(i) {
        t(e).trigger(i), ae.triggerHandler(i)
    }

    function f(i) {
        var o;
        if (!G) {
            if (o = t(i).data(Y), _ = new r(i, o), g(_.get("rel")), !$) {
                $ = q = !0, c(_.get("className")), y.css({
                    visibility: "hidden",
                    display: "block",
                    opacity: ""
                }), I = n(se, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden"), b.css({
                    width: "",
                    height: ""
                }).append(I), j = T.height() + k.height() + b.outerHeight(!0) - b.height(), D = C.width() + H.width() + b.outerWidth(!0) - b.width(), N = I.outerHeight(!0), z = I.outerWidth(!0);
                var h = a(_.get("initialWidth"), "x"),
                    s = a(_.get("initialHeight"), "y"),
                    l = _.get("maxWidth"),
                    f = _.get("maxHeight");
                _.w = (l !== !1 ? Math.min(h, a(l, "x")) : h) - z - D, _.h = (f !== !1 ? Math.min(s, a(f, "y")) : s) - N - j, I.css({
                    width: "",
                    height: _.h
                }), J.position(), u(ee), _.get("onOpen"), O.add(S).hide(), y.focus(), _.get("trapFocus") && e.addEventListener && (e.addEventListener("focus", d, !0), ae.one(re, function() {
                    e.removeEventListener("focus", d, !0)
                })), _.get("returnFocus") && ae.one(re, function() {
                    t(_.el).focus()
                })
            }
            var p = parseFloat(_.get("opacity"));
            v.css({
                opacity: p === p ? p : "",
                cursor: _.get("overlayClose") ? "pointer" : "",
                visibility: "visible"
            }).show(), _.get("closeButton") ? B.html(_.get("close")).appendTo(b) : B.appendTo("<div/>"), w()
        }
    }

    function p() {
        y || (V = !1, E = t(i), y = n(se).attr({
            id: Y,
            "class": t.support.opacity === !1 ? Z + "IE" : "",
            role: "dialog",
            tabindex: "-1"
        }).hide(), v = n(se, "Overlay").hide(), M = t([n(se, "LoadingOverlay")[0], n(se, "LoadingGraphic")[0]]), x = n(se, "Wrapper"), b = n(se, "Content").append(S = n(se, "Title"), F = n(se, "Current"), P = t('<button type="button"/>').attr({
            id: Z + "Previous"
        }), K = t('<button type="button"/>').attr({
            id: Z + "Next"
        }), R = n("button", "Slideshow"), M), B = t('<button type="button"/>').attr({
            id: Z + "Close"
        }), x.append(n(se).append(n(se, "TopLeft"), T = n(se, "TopCenter"), n(se, "TopRight")), n(se, !1, "clear:left").append(C = n(se, "MiddleLeft"), b, H = n(se, "MiddleRight")), n(se, !1, "clear:left").append(n(se, "BottomLeft"), k = n(se, "BottomCenter"), n(se, "BottomRight"))).find("div div").css({
            "float": "left"
        }), L = n(se, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"), O = K.add(P).add(F).add(R)), e.body && !y.parent().length && t(e.body).append(v, y.append(x, L))
    }

    function m() {
        function i(t) {
            t.which > 1 || t.shiftKey || t.altKey || t.metaKey || t.ctrlKey || (t.preventDefault(), f(this))
            f(this);
        }
        return y ? (V || (V = !0, K.click(function() {
            J.next()
        }), P.click(function() {
            J.prev()
        }), B.click(function() {
            J.close()
        }), v.click(function() {
            _.get("overlayClose") && J.close()
        }), t(e).bind("keydown." + Z, function(t) {
            var e = t.keyCode;
            $ && _.get("escKey") && 27 === e && (t.preventDefault(), J.close()), $ && _.get("arrowKey") && W[1] && !t.altKey && (37 === e ? (t.preventDefault(), P.click()) : 39 === e && (t.preventDefault(), K.click()))
        }), t.isFunction(t.fn.on) ? t(e).on("click." + Z, "." + te, i) : t("." + te).live("click." + Z, i)), !0) : !1
    }

    function w() {
        var e, o, r, h = J.prep,
            d = ++le;
        if (q = !0, U = !1, u(he), u(ie), _.get("onLoad"), _.h = _.get("height") ? a(_.get("height"), "y") - N - j : _.get("innerHeight") && a(_.get("innerHeight"), "y"), _.w = _.get("width") ? a(_.get("width"), "x") - z - D : _.get("innerWidth") && a(_.get("innerWidth"), "x"), _.mw = _.w, _.mh = _.h, _.get("maxWidth") && (_.mw = a(_.get("maxWidth"), "x") - z - D, _.mw = _.w && _.w < _.mw ? _.w : _.mw), _.get("maxHeight") && (_.mh = a(_.get("maxHeight"), "y") - N - j, _.mh = _.h && _.h < _.mh ? _.h : _.mh), e = _.get("href"), Q = setTimeout(function() {
                M.show()
            }, 100), _.get("inline")) {
            var c = t(e);
            r = t("<div>").hide().insertBefore(c), ae.one(he, function() {
                r.replaceWith(c)
            }), h(c)
        } else _.get("iframe") ? h(" ") : _.get("html") ? h(_.get("html")) : s(_, e) ? (e = l(_, e), U = _.get("createImg"), t(U).addClass(Z + "Photo").bind("error", function() {
            h(n(se, "Error").html(_.get("imgError")))
        }).one("load", function() {
            d === le && setTimeout(function() {
                var t;
                _.get("retinaImage") && i.devicePixelRatio > 1 && (U.height = U.height / i.devicePixelRatio, U.width = U.width / i.devicePixelRatio), _.get("scalePhotos") && (o = function() {
                    U.height -= U.height * t, U.width -= U.width * t
                }, _.mw && U.width > _.mw && (t = (U.width - _.mw) / U.width, o()), _.mh && U.height > _.mh && (t = (U.height - _.mh) / U.height, o())), _.h && (U.style.marginTop = Math.max(_.mh - U.height, 0) / 2 + "px"), W[1] && (_.get("loop") || W[A + 1]) && (U.style.cursor = "pointer", U.onclick = function() {
                    J.next()
                }), U.style.width = U.width + "px", U.style.height = U.height + "px", h(U)
            }, 1)
        }), U.src = e) : e && L.load(e, _.get("data"), function(e, i) {
            d === le && h("error" === i ? n(se, "Error").html(_.get("xhrError")) : t(this).contents())
        })
    }
    var v, y, x, b, T, C, H, k, W, E, I, L, M, S, F, R, K, P, B, O, _, j, D, N, z, A, U, $, q, G, Q, J, V, X = {
            html: !1,
            photo: !1,
            iframe: !1,
            inline: !1,
            transition: "elastic",
            speed: 300,
            fadeOut: 300,
            width: !1,
            initialWidth: "600",
            innerWidth: !1,
            maxWidth: !1,
            height: !1,
            initialHeight: "450",
            innerHeight: !1,
            maxHeight: !1,
            scalePhotos: !0,
            scrolling: !0,
            opacity: .9,
            preloading: !0,
            className: !1,
            overlayClose: !0,
            escKey: !0,
            arrowKey: !0,
            top: !1,
            bottom: !1,
            left: !1,
            right: !1,
            fixed: !1,
            data: void 0,
            closeButton: !0,
            fastIframe: !0,
            open: !1,
            reposition: !0,
            loop: !0,
            slideshow: !1,
            slideshowAuto: !0,
            slideshowSpeed: 2500,
            slideshowStart: "start slideshow",
            slideshowStop: "stop slideshow",
            photoRegex: /\.|(gif|png|jp(e|geg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
            retinaImage: !1,
            retinaUrl: !1,
            retinaSuffix: "@2x.$1",
            current: "image {current} of {total}",
            previous: "previous",
            next: "next",
            close: "close",
            xhrError: "This content failed to load.",
            imgError: "This image failed to load.",
            returnFocus: !0,
            trapFocus: !0,
            onOpen: !1,
            onLoad: !1,
            onComplete: !1,
            onCleanup: !1,
            onClosed: !1,
            rel: function() {
                return this.rel
            },
            href: function() {
                return t(this).attr("href")
            },
            title: function() {
                return this.title
            },
            createImg: function() {
                var e = new Image,
                    i = t(this).data("cbox-img-attrs");
                return "object" == typeof i && t.each(i, function(t, i) {
                    e[t] = i
                }), e
            },
            createIframe: function() {
                var i = e.createElement("iframe"),
                    n = t(this).data("cbox-iframe-attrs");
                return "object" == typeof n && t.each(n, function(t, e) {
                    i[t] = e
                }), "frameBorder" in i && (i.frameBorder = 0), "allowTransparency" in i && (i.allowTransparency = "true"), i.name = (new Date).getTime(), i.allowFullScreen = !0, i
            }
        },
        Y = "colorbox",
        Z = "cbox",
        te = Z + "Element",
        ee = Z + "_open",
        ie = Z + "_load",
        ne = Z + "_complete",
        oe = Z + "_cleanup",
        re = Z + "_closed",
        he = Z + "_purge",
        ae = t("<a/>"),
        se = "div",
        le = 0,
        de = {},
        ce = function() {
            function t() {
                clearTimeout(h)
            }

            function e() {
                (_.get("loop") || W[A + 1]) && (t(), h = setTimeout(J.next, _.get("slideshowSpeed")))
            }

            function i() {
                R.html(_.get("slideshowStop")).unbind(s).one(s, n), ae.bind(ne, e).bind(ie, t), y.removeClass(a + "off").addClass(a + "on")
            }

            function n() {
                t(), ae.unbind(ne, e).unbind(ie, t), R.html(_.get("slideshowStart")).unbind(s).one(s, function() {
                    J.next(), i()
                }), y.removeClass(a + "on").addClass(a + "off")
            }

            function o() {
                r = !1, R.hide(), t(), ae.unbind(ne, e).unbind(ie, t), y.removeClass(a + "off " + a + "on")
            }
            var r, h, a = Z + "Slideshow_",
                s = "click." + Z;
            return function() {
                r ? _.get("slideshow") || (ae.unbind(oe, o), o()) : _.get("slideshow") && W[1] && (r = !0, ae.one(oe, o), _.get("slideshowAuto") ? i() : n(), R.show())
            }
        }();
    t[Y] || (t(p), J = t.fn[Y] = t[Y] = function(e, i) {
        var n, o = this;
        return e = e || {}, t.isFunction(o) && (o = t("<a/>"), e.open = !0), o[0] ? (p(), m() && (i && (e.onComplete = i), o.each(function() {
            var i = t.data(this, Y) || {};
            t.data(this, Y, t.extend(i, e))
        }).addClass(te), n = new r(o[0], e), n.get("open") && f(o[0])), o) : o
    }, J.position = function(e, i) {
        function n() {
            T[0].style.width = k[0].style.width = b[0].style.width = parseInt(y[0].style.width, 10) - D + "px", b[0].style.height = C[0].style.height = H[0].style.height = parseInt(y[0].style.height, 10) - j + "px"
        }
        var r, h, s, l = 0,
            d = 0,
            c = y.offset();
        if (E.unbind("resize." + Z), y.css({
                top: -9e4,
                left: -9e4
            }), h = E.scrollTop(), s = E.scrollLeft(), _.get("fixed") ? (c.top -= h, c.left -= s, y.css({
                position: "fixed"
            })) : (l = h, d = s, y.css({
                position: "absolute"
            })), d += _.get("right") !== !1 ? Math.max(E.width() - _.w - z - D - a(_.get("right"), "x"), 0) : _.get("left") !== !1 ? a(_.get("left"), "x") : Math.round(Math.max(E.width() - _.w - z - D, 0) / 2), l += _.get("bottom") !== !1 ? Math.max(o() - _.h - N - j - a(_.get("bottom"), "y"), 0) : _.get("top") !== !1 ? a(_.get("top"), "y") : Math.round(Math.max(o() - _.h - N - j, 0) / 2), y.css({
                top: c.top,
                left: c.left,
                visibility: "visible"
            }), x[0].style.width = x[0].style.height = "9999px", r = {
                width: _.w + z + D,
                height: _.h + N + j,
                top: l,
                left: d
            }, e) {
            var g = 0;
            t.each(r, function(t) {
                return r[t] !== de[t] ? (g = e, void 0) : void 0
            }), e = g
        }
        de = r, e || y.css(r), y.dequeue().animate(r, {
            duration: e || 0,
            complete: function() {
                n(), q = !1, x[0].style.width = _.w + z + D + "px", x[0].style.height = _.h + N + j + "px", _.get("reposition") && setTimeout(function() {
                    E.bind("resize." + Z, J.position)
                }, 1), t.isFunction(i) && i()
            },
            step: n
        })
    }, J.resize = function(t) {
        var e;
        $ && (t = t || {}, t.width && (_.w = a(t.width, "x") - z - D), t.innerWidth && (_.w = a(t.innerWidth, "x")), I.css({
            width: _.w
        }), t.height && (_.h = a(t.height, "y") - N - j), t.innerHeight && (_.h = a(t.innerHeight, "y")), t.innerHeight || t.height || (e = I.scrollTop(), I.css({
            height: "auto"
        }), _.h = I.height()), I.css({
            height: _.h
        }), e && I.scrollTop(e), J.position("none" === _.get("transition") ? 0 : _.get("speed")))
    }, J.prep = function(i) {
        function o() {
            return _.w = _.w || I.width(), _.w = _.mw && _.mw < _.w ? _.mw : _.w, _.w
        }

        function a() {
            return _.h = _.h || I.height(), _.h = _.mh && _.mh < _.h ? _.mh : _.h, _.h
        }
        if ($) {
            var d, g = "none" === _.get("transition") ? 0 : _.get("speed");
            I.remove(), I = n(se, "LoadedContent").append(i), I.hide().appendTo(L.show()).css({
                width: o(),
                overflow: _.get("scrolling") ? "auto" : "hidden"
            }).css({
                height: a()
            }).prependTo(b), L.hide(), t(U).css({
                "float": "none"
            }), c(_.get("className")), d = function() {
                function i() {
                    t.support.opacity === !1 && y[0].style.removeAttribute("filter")
                }
                var n, o, a = W.length;
                $ && (o = function() {
                    clearTimeout(Q), M.hide(), u(ne), _.get("onComplete")
                }, S.html(_.get("title")).show(), I.show(), a > 1 ? ("string" == typeof _.get("current") && F.html(_.get("current").replace("{current}", A + 1).replace("{total}", a)).show(), K[_.get("loop") || a - 1 > A ? "show" : "hide"]().html(_.get("next")), P[_.get("loop") || A ? "show" : "hide"]().html(_.get("previous")), ce(), _.get("preloading") && t.each([h(-1), h(1)], function() {
                    var i, n = W[this],
                        o = new r(n, t.data(n, Y)),
                        h = o.get("href");
                    h && s(o, h) && (h = l(o, h), i = e.createElement("img"), i.src = h)
                })) : O.hide(), _.get("iframe") ? (n = _.get("createIframe"), _.get("scrolling") || (n.scrolling = "no"), t(n).attr({
                    src: _.get("href"),
                    "class": Z + "Iframe"
                }).one("load", o).appendTo(I), ae.one(he, function() {
                    n.src = "//about:blank"
                }), _.get("fastIframe") && t(n).trigger("load")) : o(), "fade" === _.get("transition") ? y.fadeTo(g, 1, i) : i())
            }, "fade" === _.get("transition") ? y.fadeTo(g, 0, function() {
                J.position(0, d)
            }) : J.position(g, d)
        }
    }, J.next = function() {
        !q && W[1] && (_.get("loop") || W[A + 1]) && (A = h(1), f(W[A]))
    }, J.prev = function() {
        !q && W[1] && (_.get("loop") || A) && (A = h(-1), f(W[A]))
    }, J.close = function() {
        // $ && !G && (G = !0, $ = !1, u(oe), _.get("onCleanup"), E.unbind("." + Z), v.fadeTo(_.get("fadeOut") || 0, 0), y.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
        //     y.hide(), v.hide(), u(he), I.remove(), setTimeout(function() {
        //         G = !1, u(re), _.get("onClosed")
        //     }, 1)
        // }))
        // alert($(".cboxPhoto").attr("src"));
        $ && !G && (G = !0, $ = !1, u(oe), _.get("onCleanup"), E.unbind("." + Z), v.fadeTo(_.get("fadeOut") || 0, 0), y.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
            y.hide(), v.hide(), u(he), endImgSrc = I.find(".cboxPhoto").attr("src"), I.remove(), setTimeout(function() {
                G = !1
                    // u(re), 
                    // _.get("onClosed")
            }, 1)
        }))
    }, J.remove = function() {
        y && (y.stop(), t[Y].close(), y.stop(!1, !0).remove(), v.remove(), G = !1, y = null, t("." + te).removeData(Y).removeClass(te), t(e).unbind("click." + Z).unbind("keydown." + Z))
    }, J.element = function() {
        return t(_.el)
    }, J.settings = X)
})(jQuery, document, window);
//------------------------------------------------------
$(function() {
    var pictureEvent = {};
    pictureEvent.eleInit = function() {
        //去除点击效果
        $(".mShadeBg").removeClass("mShadeBg");
        $(".mTitleColor").removeClass("mTitleColor");
        $(".pohotoshow").each(function() {
            var showHeight = $(this).parents(".atlasWrap5").height() - 84;
            $(this).css("height", showHeight);
        }).css("opacity", 0);
    }();
    pictureEvent.bindEvent = function() {
        var pc = $(window).width() > 768 ? true : false;
        var screenWid = $(window).width();
        var screenHei = $(window).height();
        var $AclickSource;
        $(".atlasWrap,.atlasWrap3,.atlasWrap5,.atlasWrap4").each(function() {
            var self = $(this);
            //手机端点击出现遮罩事件
            if ($("body").find(".wqdIphoneView").length) {
                self.find(".wqd-atlas li .wrap ").on("click", function() {
                    $(this).find("a>span").toggleClass("mShadeBg").end().parent().siblings().find("a>span").removeClass("mShadeBg");
                    $(this).find("h5").toggleClass("mTitleColor").end().parent().siblings().find("h5").removeClass("mTitleColor");
                });
            };
        });
        //发布后的图册三动画效果
        $(".atlasWrap3").each(function(i) {
            var self = $(this);
            self.find("#scroller").width(self.find(".wqd-atlas").width());
            if ($(window).width() >= 768) {
                var speed = 10;
                var tab = self[0];
                var tab1 = self.find(".wqd-atlas.autoscroll")[0];
                //为了平滑过渡
                if (self.find(".autoscroll.copy").length == 0) {
                    $("<div class='autoscroll copy'><div>").appendTo(self.find(".scrollBox"));
                };
                var MyMar;
                tab.scrollLeft = 0;
                var tab2 = self.find(".autoscroll.copy")[0];
                tab2.innerHTML = tab1.innerHTML;
                self.parent().find(".leftBar,.rightBar").hover(function() {
                        clearInterval(MyMar);
                        if ($(this).hasClass("rightBar")) {
                            function Marquee1() {
                                if (tab2.offsetWidth - tab.scrollLeft <= 0) {
                                    tab.scrollLeft = 0;
                                } else {
                                    tab.scrollLeft += 1;;
                                }
                            };
                            MyMar = setInterval(Marquee1, speed);
                        } else if ($(this).hasClass("leftBar")) {
                            function Marquee2() {
                                if (tab.scrollLeft <= 0)
                                    tab.scrollLeft += tab2.offsetWidth
                                else {
                                    tab.scrollLeft--
                                }
                            }
                            MyMar = setInterval(Marquee2, speed);
                        };
                    },
                    function() {
                        clearInterval(MyMar);
                    });
            } else {
                self.find(".copy").remove();
                self.siblings(".leftBar,.rightBar").css("display", "none");
            };
        });
        
        //发布后的图册四动画效果
        $(".atlasWrap4").each(function(i) {
            //获取比例
            function getInitRatio(url) {
                var image = new Image();    
                image.src = url;
                var realWidth = image.width;
                var realHeight = image.height;
                return realWidth / realHeight;
            };
            var self = $(this).find(".wqd-atlas");
            self.find("a").each(function() {
                $(this).height($(this).parents("[data-elementtype='picture']").height());
            });
            self.on("mouseenter click", "li", function() {
                var $li = $(this);
                var viewHeight = $li.parents("[data-elementtype='picture']").height();
                var viewWidth = $li.parent().width();
                var imgSrc = $li.find("a").css("background-image").replace(/\"|\(|\)|url/g, '');;
                var activeWidth = viewHeight * getInitRatio(imgSrc) >= viewWidth * 0.8 ? viewWidth * 0.8 : viewHeight * getInitRatio(imgSrc);
                var allChildren = $li.parent().children();
                var liLen = allChildren.length;
                var otherWidth = (viewWidth - activeWidth) / (liLen - 1);
                var activeIndex = $li.index();
                $li.addClass("active").siblings().removeClass("active");
                $li.find(".wrap,.wrap a").css({
                    "width": "100%"
                });
                allChildren.each(function(i) {
                    var self = $(this);
                    if (i < activeIndex) {
                        self.stop().animate({
                            "left": i * otherWidth,
                            "width": otherWidth
                        });
                    } else if (i == activeIndex) {
                        self.stop().animate({
                            "left": i * otherWidth,
                            "width": activeWidth
                        }, function() {
                            self.find(".txt_box").css("width", activeWidth).stop().show(200)
                        });
                    } else if (i > activeIndex) {
                        self.stop().animate({
                            "width": otherWidth,
                            "left": (i - 1) * otherWidth + activeWidth
                        });
                    };
                });
            });
            self.on("mouseleave", function() {
                var viewWidth = $(this).width();
                var liLen = self.find("li").length;
                self.find("li").each(function(m) {
                    self.find(".txt_box").hide();
                    $(this).stop().animate({
                        "width": viewWidth / liLen,
                        "left": viewWidth * m / liLen
                    }, function() {
                        self.find(".wrap,.wrap a").css({
                            "width": viewWidth / liLen + "px"
                        });
                    });
                });

            });

        });
        //发布后的图册五动画效果
        $(".atlasWrap5").each(function() {
            var self = $(this);
            var scrollBox = self.find(".wqd-atlas");
            var $li=self.find(".wqd-atlas li");
            var scrollerWidth=$li.length * $li.innerWidth() - parseInt($li.css("padding-right"), 10);
            self.find("#scroller,.wqd-atlas").css("width",scrollerWidth);
            self.find(".wqd-atlas a").each(function() {
                $(this).attr("onclick", "return false");
            });
        });
        //手机端添加弹框         
        $("[data-elementtype]").length != 0 && $("body").append("<div class='mtucebg' style='display:none;background-color:#000;position:fixed;top:0;width:100%;z-index:999'><div id='mWrapper' style='height:" + screenHei + "px'><div id='mScrollerShow'><ul style='white-space:nowrap' ></ul></div></div></div>");
        $(".autoscroll").addClass("wqd-atlas");
        //pc前进后退按键
        $(document).on("click", "i", function() {
            var $cboxLoadedContent = $("#cboxLoadedContent"),
                mengban;
            if ($(this).hasClass("pictureShowL") || $(this).hasClass("pictureShowR")) {
                $(this).hasClass("pictureShowL") && $("#cboxPrevious").trigger("click");
                $(this).hasClass("pictureShowR") && $("#cboxNext").trigger("click");
                setTimeout(function() {
                    var $cboxLoadedContentImg = $("#cboxLoadedContent").find("img")
                    $AclickSource.closest("ul").find("a").each(function() {
                        if (($(".atlasWrap3,.atlasWrap4,.atlasWrap5").length && $(this).css("background-image").indexOf($cboxLoadedContentImg.attr("src")) != -1) || (!$(".atlasWrap3,.atlasWrap4,.atlasWrap5").length && $(this).find("img").attr("src").indexOf($cboxLoadedContentImg.attr("src")) != -1)) {
                            mengban = $(this).find("div").css("background-color") ? $(this).find("div").css("background-color") : "rgba(0,0,0,0)";
                        };
                    });
                    $("#cboxLoadedContent").css({
                        position: "relative"
                    }).find("div").remove().end().append("<div style='background-color:" + mengban + ";position:absolute;top:0;left:0;width:100%;height:100%;'></div>")
                }, 100);
            };
            $(this).hasClass("pictureShowClose") && $("#cboxOverlay").trigger("click");
        });
        //关闭pc图册弹窗
        $(document).on("click", "#cboxOverlay", function() {
            $(".btnControl,.pictureShowClose").hide();
            $(".btnControl").remove();
        });
        //手机图册弹出框
        var time1, time2; //解决双击事件bug
        $(document).on("click", ".wqd-atlas:not(.pohotoindex .wqd-atlas) a,.pohotoshow a", function(e) {
            if($(this).attr("href").indexOf("javascript:void(0)")==-1) return;
            var screenWid = $(window).width();
            var screenHei = $(window).height();
            var bgHei = $(document).height() > $(window).height() ? $(document).height() : $(window).height();
            var $thisA=$(this);
            e.stopPropagation();
            $AclickSource = $(e.target);
            if (pc) {
                return;
            };
            $(".mtucebg").height(bgHei);
            $(".btnControl,.pictureShowClose").hide();
            if ($(this).parents(".atlasWrap4").length != 0) {
                return;
            };
            //加载手机弹窗
            var html = "";
            var liLen = $(this).parents("li").parent().children().length;
            $ele = $(this).parents('.pohotoshow').length ? $(this).parents('.pohotoshow').find("a") : $(this).parents('[data-elementtype]').find("a");
            $ele.each(function() {
                if($(this).attr("href").indexOf("javascript:void(0)")==-1) return;
                var imgSrc = $(this).parents(".atlasWrap3,.atlasWrap4,.atlasWrap5").length == 0 ? $(this).find("img").attr("src") : $(this).css("background-image").replace(/\"|\(|\)|url/g, '');
                var mengban = $(this).find("div").css("background-color");
                html += "<li style='display:inline-block;position:relative'><div style='display:table;vertical-align:middle;width:100%;height:100%'><p style='display:table-cell;vertical-align:middle'><span style='position:relative;display:inline-block'><img style='vertical-align: middle;' src='" + imgSrc + "'><span style='position:absolute;top:0;left:0;width:100%;height:100%;display:inline-block;background-color:" + mengban + "'></span></span></p></li>";
            });
            $(".mtucebg ul").html(html);
            //设置显示文字
            var $mtucebgLiIndex;
            $(".mtucebg ul li").each(function(){
                var $index=$(this).index()+1;
                var liLen=$(".mtucebg ul li").length;
                var liImg=$(this).find("img");
                var aInitImg=$thisA.parents(".atlasWrap3,.atlasWrap4,.atlasWrap5").length == 0 ? $thisA.find("img").attr("src") : $thisA.css("background-image").replace(/\"|\(|\)|url/g, '')
                $(this).append("<span style='position:absolute;top:10px;left:10px;color:#fff'>" + $index + "/" + liLen + "</span>")
                if(liImg.attr("src").indexOf(aInitImg)!=-1){
                   $mtucebgLiIndex=$(this).index()+1; 
                };
            });
            var sonLen = $(".mtucebg ul li").length;
            $(".mtucebg").show().find("#mScrollerShow").css({
                "width": sonLen * $(window).width(),
            }).find("li").css({
                width: screenWid,
                height: screenHei,
                "text-align": "center",
            }).find("img").css({
                "max-width": screenWid,
                "max-height": screenHei
            });
            new IScroll("#mWrapper", {
                scrollX: true,
                scrollY: false,
                hScrollbar: false,
                vScrollbar: false,
                disableTouch: false,
                HWCompositing: true,
                snap: "li",
                click: true,
                momentum: false,
            }).scrollToElement(".mtucebg ul li:nth-child(" + $mtucebgLiIndex + ")", 0);
            time1 = new Date().getTime();
        });
        //pc左右鼠标滑过
        $(document).on("mouseover mouseout", ".btnControl", function(e) {
            e.type == "mouseover" && $(this).find("i").show();
            e.type == "mouseout" && $(this).find("i").hide();
        });
        //手机关闭弹窗         
        $(document).on("click", "#mWrapper", function(e) {
            time2 = new Date().getTime(); //截胡双击<<<<<<<-----mbd
            if (time2 - time1 < 500) {
                return;
            };
            $(".mtucebg").css({
                display: "none"
            });
        });
    };
    pictureEvent.bindEvent();
});
//加载完成后的效果
window.onload = function() {
    var pc = $(window).width() > 768 ? true : false;
    var screenWid = $(window).width();
    var screenHei = $(window).height();
    //前四个可以调用
    $(".wqd-atlas").not(".pohotoindex .wqd-atlas").each(function(i) {
        $(this).find("a").each(function() {
            if ($(this).attr("href").indexOf("javascript:void(0)") != -1) {
                $(this).attr({
                    "href": "javascript:void(0)"
                }).addClass("y-enlarge" + i).attr({
                    "onclick": "return false"
                });
            }
        });
        slider($(".y-enlarge" + i), ".wqd-atlas");
    });
    //滚动设置
    if ($(".pohotoindex").length != 0 || $(".scrollBox").length != 0) {
        //第五索引
        $(".pohotoindex").each(function(i) {
            var $this = $(this);
            $this.attr("id", "wrapper1_" + i);
            // $this.children().eq(0).width($this.find("ul li").length * $this.find("ul li").innerWidth());
            setTimeout(function() {
                $this.scroll = new IScroll("#wrapper1_" + i, {
                    scrollX: true,
                    scrollY: false,
                    hScrollbar: false,
                    vScrollbar: false,
                    disableTouch: false,
                    mouseWheel: true,
                    click: true,
                    preventDefault: false,
                    HWCompositing: $(window).width() >= 768 ? false : true,
                });
                $this.on('touchstart', mEvent);
                $this.on('touchmove', mEvent);
                $this.on('touchend', mEvent);
            }, 100)
        });
        //第五展示
        $(".pohotoshow").each(function(i) {
            var $show = $(this);
            var html = "";
            var sonLen = $show.siblings(".pohotoindex").find(".wqd-atlas li").length;
            $show.attr("id", "wrapper2_" + i).siblings(".pohotoindex").find(".wqd-atlas li a").each(function() {
                var realTarget = $(this).attr("target") == "_blank" ? "target='_blank'" : "";
                var menban = $(this).find(".mask").css("background-color");
                html += "<li style='display:inline-block'><a href='" + $(this).attr("href") + "' " + realTarget + " style='background-image:" + $(this).css("background-image") + ";background-size:cover;width:" + $show.width() + "px;height:"+$show.height()+"px'><div style='background-color:" + menban + ";position:absolute;top:0;left:0;right:0;bottom:0'></div></a></li>";
                $(this).attr({
                    "href": "javascript:void(0);"
                }).removeAttr("target");
            });
            $show.html("<div id='scrollerShow' style='width:" + sonLen * $show.width() + "px;height:" + $show.height() + "px;overflow:hidden'><ul style='white-space:nowrap'>" + html + "</ul></div>");
            $show.find("a").each(function() {
                if ($(this).attr("href").indexOf("javascript:void(0)") != -1) {
                    $(this).attr({
                        "href": "javascript:void(0)"
                    }).addClass("y-enlargeTuce5_" + i).attr({
                        "onclick": "return false",
                        "ondragstart": "return false"
                    });
                }
            });
            slider($(".y-enlargeTuce5_" + i), ".pohotoshow");
            setTimeout(function() {
                $show.scroll = new IScroll("#wrapper2_" + i, {
                    scrollX: true,
                    scrollY: false,
                    hScrollbar: false,
                    vScrollbar: false,
                    disableTouch: false,
                    snap: "li",
                    click: true,
                    momentum: false,
                    HWCompositing: $(window).width() >= 768 ? false : true,
                    preventDefault: false,
                });
                $show.siblings().on("click ", ".wqd-atlas li a", function(e) {
                    if (e.type == "click") {
                        var index = $(this).parents("[data_pic]").index() + 1;
                        $show.scroll.scrollToElement("#wrapper2_" + i + " li:nth-child(" + index + ")", 500);
                    };
                });
                $show.on('touchstart', mEvent);
                $show.on('touchmove', mEvent);
                $show.on('touchend', mEvent);
            }, 100)
        }).css("opacity", 1);
        if ($(window).width() <= 768) {
            //第三滚动
            $(".scrollBox").each(function(i) {
                $this = $(this);
                $this.attr("id", "wrapper3_" + i);
                setTimeout(function() {
                    $this.scroll = new IScroll("#wrapper3_" + i, {
                        scrollX: true,
                        scrollY: false,
                        hScrollbar: false,
                        vScrollbar: false,
                        disableTouch: false,
                        click: true,
                        preventDefault: false,
                        HWCompositing: $(window).width() >= 768 ? false : true,
                    });
                }, 100)
                $this.on('touchstart', mEvent);
                $this.on('touchmove', mEvent);
                $this.on('touchend', mEvent);
            });
        };

    };
    //幻灯片
    function slider(ele, par) {
        if ($(window).width() > 786) {
            // var num=1;
            ele.colorbox({
                rel: ele.attr("class"),
                slideshow: true,
                photo: true,
                onOpen: function() {
                    $("#colorbox").css("outline", "none");
                    $("[data-elementtype]").length != 0 && $("body").append("<p style='position:fixed;z-index:10000;top:10px;right:10px' class='btnControlClose'><i class='pictureShowClose'></i></p><p style='position:absolute;z-index:9999;top:0;left:0;height:100%;width:150px' class='btnControl'><i class='pictureShowL '></i></p><p style='position:absolute;z-index:9999;top:0;right:0;height:100%;width:150px' class='btnControl'><i class='pictureShowR'></i></p>");
                    $("#cboxPrevious,#cboxNext,#cboxClose,#cboxSlideshow,#cboxLoadingGraphic,.cboxLoadingOverlay").css("opacity", 0);
                    $(".pictureShowL,.pictureShowR").hide();
                    $("#cboxLoadedContent").css({
                        "overflow": "hidden"
                    });
                    $(".btnControl,.pictureShowClose").show();
                    $("#cboxClose").css("opacity", 0);
                    // $("#cboxOverlay,#colorbox").css("display", "block");
                    ele.parents(par).find("a[href='javascript:void(0)']").each(function() {
                        var $a = $(this);
                        $a.attr({
                            "saveHref": $(this).attr("href"),
                            "href": $a.parents(".atlasWrap3,.atlasWrap4,.atlasWrap5").length != 0 ? $a.css("background-image").replace(/\"|\(|\)|url/g, "") : $a.find("img").attr("src"),
                        });
                    });
                },
                onComplete: function(e) {
                    //第一项的蒙版设置
                    $("#cboxLoadedContent").css({
                        position: "relative"
                    }).find("div").remove().end().append("<div style='background-color:" + $(this).find("div").css("background-color") + ";position:absolute;top:0;left:0;width:100%;height:100%;'></div>");
                    $(this).colorbox.resize();
                },
                next: "",
                previous: "",
                slideshowStart: "",
                slideshowStop: "",
                close: "",
                speed: 0,
                preloading: !0,
                fixed: !0,
                current: "",
                slideshowAuto: !1,
                loop: !1,
                onClosed: function() {
                    ele.parents(par).find("a[saveHref]").each(function() {
                        $(this).attr({
                            "href": $(this).attr("saveHref"),
                        });
                    });
                    return false;
                },
                opacity: 0.5,
                maxWidth: ($(window).width() > 786) ? "60%" : "90%",
                maxHeight: "90%"
            });
        };
    };
    //手机事件
    var startX, startY, moveX, moveY;

    function mEvent(e) {
        if (e.type == "touchstart") {
            touch = e.originalEvent.changedTouches[0];
            startX = touch.pageX;
            startY = touch.pageY;
            // e.preventDefault();
        } else if (e.type == "touchmove") {
            touch = e.originalEvent.changedTouches[0];
            moveX = touch.pageX;
            moveY = touch.pageY;
            if (Math.abs(moveY - startY) / Math.abs(moveX - startX) < 1) {
                e.preventDefault();
            };
        } else if (e.type == "touchend") {
            // touch = e.targetTouches[0]
            // moveX = touch.pageX;
            // moveY = touch.pageY;
            // if (Math.abs(moveY - startY) < 100) {
            //     e.preventDefault();
            // };
            // e.target.removeEventListener('touchmove',phone.move, false);
            // e.target.removeEventListener('touchend', phone.end, false);
        };
    };
    //中心弹出
    function centerModal($modal,$source){
      var centerX=$source.offset().left+$source.width()*0.5;
      var centerY=$source.offset().top+$source.height()*0.5;
      $modal.css({
        "transform-orgin":centerX+"px  "+centerY+"px",
        "transform":"scale(0)"
      });
    };

};
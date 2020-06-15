(function (a) {
    a.fn.extend({
        accordion: function (e) {
            var b = a.extend({
                accordion: "true",
                speed: 300,
                closedSign: "+",
                openedSign: "-"
            }, e),
                c = a(this);
            c.find("li").each(function () {
                0 != a(this).find("ul").size() && (a(this).find("a:first").append("<span>" + b.closedSign + "</span>"), "#" == a(this).find("a:first").attr("href") && a(this).find("a:first").click(function () {
                    return !1
                }))
            });
            c.find("li.active").each(function () {
                a(this).parents("ul").slideDown(b.speed);
                a(this).parents("ul").parent("li").find("span:first").html(b.openedSign)
            });
            c.find("li a").click(function () {
                0 != a(this).parent().find("ul").size() && (b.accordion && !a(this).parent().find("ul").is(":visible") && (parents = a(this).parent().parents("ul"), visible = c.find("ul:visible"), visible.each(function (c) {
                    var d = !0;
                    parents.each(function (a) {
                        if (parents[a] == visible[c]) return d = !1
                    });
                    d && a(this).parent().find("ul") != visible[c] && a(visible[c]).slideUp(b.speed, function () {
                        a(this).parent("li").find("span:first").html(b.closedSign);
                        a(this).parent("li").find("span:first").toggleClass("closeAcc")
                    })
                })), a(this).parent().find("ul:first").is(":visible") ? a(this).parent().find("ul:first").slideUp(b.speed, function () {
                    a(this).parent("li").find("span:first").delay(b.speed).html(b.closedSign);
                    a(this).parent("li").find("span:first").toggleClass("closeAcc")
                }) : a(this).parent().find("ul:first").slideDown(b.speed, function () {
                    a(this).parent("li").find("span:first").delay(b.speed).html(b.openedSign);
                    a(this).parent("li").find("span:first").toggleClass("closeAcc")
                }))
            })
        }
    });
    a(".leftNav_dropdown").click(function () {
        a(".Complaints").toggleClass("leftNavcolorchange")
    });
    a("ul.newConnection li a").click(function () {
        a("ul.newConnection li a").removeClass("clicked");
        a(this).addClass("clicked")
    })
})(jQuery);
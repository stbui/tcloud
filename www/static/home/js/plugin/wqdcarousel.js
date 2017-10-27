(function($) {
    var Wqdcarousel = function(element, options) {
        this.$element = $(element);
        this.$indicators = this.$element.find('.carousel-indicators');
        this.options = options;
        this.paused = null;
        this.sliding = null;
        this.interval = null;
        this.$active = null;
        this.$items = null;
        this.pointx = null;
        this.pointy = null;
        this.options.keyboard && this.$element.on('keydown.Wqdcarousel', $.proxy(this.keydown, this));
        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element.on('mouseenter.bs.Wqdcarousel', $.proxy(this.pause, this)).on('mouseleave.bs.Wqdcarousel', $.proxy(this.cycle, this));
        this.$element.on('touchstart', $.proxy(this.touchStart, this)).on('touchmove', $.proxy(this.touchMove, this));
        this.$element.on('touchend', $.proxy(this.touchEnd, this));
    };

    Wqdcarousel.VERSION = '3.3.4';
    Wqdcarousel.TRANSITION_DURATION = 600;
    Wqdcarousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    };
    Wqdcarousel.prototype.touchStart = function(e) {
        if (this.sliding || e.originalEvent.changedTouches.length != 1) return this;
        this.pointx = e.originalEvent.changedTouches[0].screenX;
        this.pointy = e.originalEvent.changedTouches[0].screenY;
        return this;
    }
    Wqdcarousel.prototype.touchMove = function(e) {
        if (e.originalEvent.changedTouches.length != 1) return this;
        var preventDefault = false;
        var pointx = e.originalEvent.changedTouches[0].screenX;
        var pointy = e.originalEvent.changedTouches[0].screenY;
        var changeX = pointx - this.pointx;
        var changeY = pointy - this.pointy;
        var sin = changeY / Math.sqrt(changeX * changeX + changeY * changeY);
        if (sin > Math.sin(Math.PI / 6) || sin < -Math.sin(Math.PI / 6)) {
            console.log(1);
            preventDefault = true;
        }
        return preventDefault;
    }
    Wqdcarousel.prototype.touchEnd = function(e) {
        if (this.sliding || e.originalEvent.changedTouches.length != 1) return this;
        var pointx = e.originalEvent.changedTouches[0].screenX;
        var pointy = e.originalEvent.changedTouches[0].screenY;
        var changeX = pointx - this.pointx;
        var changeY = pointy - this.pointy;
        var sin = changeY / Math.sqrt(changeX * changeX + changeY * changeY);
        if (sin > Math.sin(Math.PI / 6) || sin < -Math.sin(Math.PI / 6)) return false;
        changeX < -50 && this.next();
        changeX > 50 && this.prev();
        return this;
    }

    Wqdcarousel.prototype.keydown = function(e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch (e.which) {
            case 37:
                this.prev();
                break;
            case 39:
                this.next();
                break;
            default:
                return;
        }

        e.preventDefault();
    }

    Wqdcarousel.prototype.cycle = function(e) {
        e || (this.paused = false);

        this.interval && clearInterval(this.interval);

        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

        return this;
    }

    Wqdcarousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children('.item');
        return this.$items.index(item || this.$active);
    }

    Wqdcarousel.prototype.getItemForDirection = function(direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = (direction == 'prev' && activeIndex === 0) || (direction == 'next' && activeIndex == (this.$items.length - 1));
        if (willWrap && !this.options.wrap) return active;
        var delta = direction == 'prev' ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    }

    Wqdcarousel.prototype.to = function(pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

        if (pos > (this.$items.length - 1) || pos < 0) return;

        if (this.sliding) return this.$element.one('slid.Wqdcarousel', function() {
            that.to(pos)
        }); // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle();

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
    }

    Wqdcarousel.prototype.pause = function(e) {
        e || (this.paused = true);

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }

        this.interval = clearInterval(this.interval);

        return this;
    }

    Wqdcarousel.prototype.next = function() {
        if (this.sliding) return;
        return this.slide('next');
    }

    Wqdcarousel.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide('prev');
    }

    Wqdcarousel.prototype.slide = function(type, next) {
        var $active = this.$element.find('.item.active');
        var $next = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == 'next' ? 'left' : 'right';
        var that = this;

        if ($next.hasClass('active')) return (this.sliding = false);

        var relatedTarget = $next[0];
        var slideEvent = $.Event('slide.Wqdcarousel', {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;

        this.sliding = true;

        isCycling && this.pause();

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass('active');
        }

        var slidEvent = $.Event('slid.Wqdcarousel', {
            relatedTarget: relatedTarget,
            direction: direction
        }); // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type);
            $next[0].offsetWidth; // force reflow
            $active.addClass(direction);
            $next.addClass(direction);
            $active.one('bsTransitionEnd', function() {
                $next.removeClass([type, direction].join(' ')).addClass('active');
                $active.removeClass(['active', direction].join(' '));
                that.sliding = false;
                setTimeout(function() {
                    that.$element.trigger(slidEvent);
                }, 0);
            }).emulateTransitionEnd(Wqdcarousel.TRANSITION_DURATION);
        } else {
            $active.removeClass('active');
            $next.addClass('active');
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }

        isCycling && this.cycle();

        return this;
    }


    // Wqdcarousel PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data('Wqdcarousel');
            var options = $.extend({}, Wqdcarousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action = typeof option == 'string' ? option : options.slide;

            if (!data) $this.data('Wqdcarousel', (data = new Wqdcarousel(this, options)));
            if (typeof option == 'number') {
                data.options.interval = false;
                data.to(option);
            } else if (action) data[action]();
            else if (options.interval) data.pause().cycle();
        });
    }

    var old = $.fn.Wqdcarousel;

    $.fn.Wqdcarousel = Plugin;
    $.fn.Wqdcarousel.Constructor = Wqdcarousel;


    // Wqdcarousel NO CONFLICT
    // ====================

    $.fn.Wqdcarousel.noConflict = function() {
        $.fn.Wqdcarousel = old;
        return this;
    }


    // Wqdcarousel DATA-API
    // =================

    var clickHandler = function(e) {
        var href;
        var $this = $(this);
        var $target = $this.parents($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        if (!$target.hasClass('wqdCarousel')) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr('data-wqdslide-to');
        if (slideIndex) options.interval = false;

        Plugin.call($target, options);

        if (slideIndex) {
            $target.data('Wqdcarousel').to(slideIndex);
        }

        e.preventDefault();
    }

    $(document).on('click.Wqdcarousel', '[data-slide]', clickHandler).on('click.Wqdcarousel', '[data-wqdslide-to]', clickHandler);

    $(window).on('load', function() {
        $('.wqdCarousel').each(function() {
            var $Wqdcarousel = $(this);
            $Wqdcarousel.find(".item").removeClass("left right prev next");
            if ($Wqdcarousel.parents("#HTMLDATA").length) return false;
            Plugin.call($Wqdcarousel, $Wqdcarousel.data());
            if($(this).parents(".fullscreen").length) {
                var width = $(window).width(),
                    sectionWidth = +$(this).parents(".sectionV2").attr("sectionwidth") || 1200;
                width = width < sectionWidth ? sectionWidth : width;
                $(this).parents("[data-elementtype=carouse]").eq(0).width(width).css("opacity",1);
            }
        });
    });

})(jQuery);

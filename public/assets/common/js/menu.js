(function(window) {

    'use strict';

    /**
     * Extend Object helper function.
     */
    function extend(a, b) {
        for(var key in b) {
            if(b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /**
     * Menu Constructor.
     */
    function Menu(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * Menu Options.
     */
    Menu.prototype.options = {
        wrapper: '.o-wrapper',          // The content wrapper
        type: 'slide-left',             // The menu type
        mask: '.c-mask',               // The ID of the mask
        size: 60                    // Size of menu
    };

    /**
     * Initialise Menu.
     */
    Menu.prototype._init = function() {
        this.body = $('body');
        this.wrapper = $(this.options.wrapper);
        this.mask = $(this.options.mask);
        this.menu = $('.c-menu--' + this.options.type);

        $(this.wrapper).find('.c-menu--slide-bottom').css('transform', 'translateY(' + this.options.size.toString() + 'px)');
        $(this.wrapper).find('.c-menu--push-bottom').css('transform', 'translateY(' + this.options.size.toString() + 'px)');

        $(this.wrapper).find('.c-menu--slide-top').css('height', this.options.size + 35);
        $(this.wrapper).find('.c-menu--slide-bottom').css('height', this.options.size + 35);
        $(this.wrapper).find('.c-menu--push-top').css('height', this.options.size + 35);
        $(this.wrapper).find('.c-menu--push-bottom').css('height', this.options.size + 35);
    };

    /**
     * Open Menu.
     */
    Menu.prototype.open = function() {
        this.body.addClass('has-active-menu');
        this.wrapper.addClass('has-' + this.options.type);
        this.menu.addClass('is-active');
        this.mask.addClass('is-active');
    };

    /**
     * Close Menu.
     */
    Menu.prototype.close = function() {
        this.body.removeClass('has-active-menu');
        this.wrapper.removeClass('has-' + this.options.type);
        this.menu.removeClass('is-active');
        this.mask.removeClass('is-active');
    };

    /**
     * Add to global namespace.
     */
    window.Menu = Menu;

})(window);
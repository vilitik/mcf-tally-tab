/**
 * MyCashflow Tally Tab Plugin
 * Copyright (c) 2025 Vili Tikkanen
 * License <https://github.com/vilitik/mcf-tally-tab>
 */
;(function ($) {
	'use strict';

	const TallyTab = {
		// Default configuration
		defaults: {
			tallyUrl: '',
			height: 584,
			position: 'right', // 'right' or 'left'
			tabText: 'Palaute',
			zIndex: 9999,
			tabWidth: 40,
			tabHeight: 80,
			backgroundColor: 'var(--color-accent)',
			textColor: 'var(--color-text-on-accent)',
			animationDuration: 300
		},

		// State
		isOpen: false,
		isLoaded: false,
		$tab: null,
		$form: null,
		$overlay: null,

		init: function (config) {
			// Merge configuration with defaults
			this.config = $.extend(true, {}, this.defaults, config);
			
			// Validate required parameters
			if (!this.config.tallyUrl || !this.config.tallyUrl.trim()) {
				console.warn('TallyTab: tallyUrl is required and cannot be empty');
				return;
			}
			
			if (!this.config.height || isNaN(this.config.height) || this.config.height <= 0) {
				console.warn('TallyTab: height is required and must be a positive number');
				return;
			}

			this.createElements();
			this.bindEvents();
			this.positionTab();
		},

		createElements: function () {
			// Create the fixed tab
			this.$tab = $(`
				<div class="tally-tab" style="
					position: fixed;
					top: 50%;
					${this.config.position}: 0;
					transform: translateY(-50%);
					width: ${this.config.tabWidth}px;
					height: ${this.config.tabHeight}px;
					background-color: ${this.config.backgroundColor};
					color: ${this.config.textColor};
					border-radius: var(--border-radius) 0 0 var(--border-radius);
					display: flex;
					align-items: center;
					justify-content: center;
					cursor: pointer;
					z-index: ${this.config.zIndex};
					box-shadow: -2px 2px 10px rgba(0,0,0,0.2);
					transition: all ${this.config.animationDuration}ms ease;
					font-size: var(--font-size-regular);
					font-weight: var(--font-heading-weight);
					text-align: center;
					line-height: var(--line-height);
					writing-mode: vertical-rl;
					text-orientation: mixed;
					user-select: none;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
				">
					${this.config.tabText}
				</div>
			`);

			// Create the overlay
			this.$overlay = $(`
				<div class="tally-overlay" style="
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background-color: var(--backdrop-color);
					z-index: ${this.config.zIndex - 1};
					display: none;
					opacity: 0;
					transition: opacity ${this.config.animationDuration}ms ease;
				"></div>
			`);

			// Create the form container - positioned to slide from tab
			this.$form = $(`
				<div class="tally-form-container" style="
					position: fixed;
					top: 50%;
					${this.config.position}: ${this.config.tabWidth}px;
					transform: translateY(-50%) translateX(${this.config.position === 'right' ? '100%' : '-100%'});
					width: 400px;
					height: ${this.config.height}px;
					max-height: 90vh;
					background-color: var(--background-color);
					border-radius: var(--border-radius-drawers);
					z-index: ${this.config.zIndex};
					display: none;
					opacity: 0;
					transition: all ${this.config.animationDuration}ms ease;
					box-shadow: var(--box-shadow), 0 10px 30px rgba(0,0,0,0.3);
				">
					<div class="tally-form-content" style="
						height: 100%;
						overflow-y: auto;
						overflow-x: hidden;
					">
						<div class="tally-loading" style="
							display: flex;
							align-items: center;
							justify-content: center;
							height: 100%;
							color: var(--color-text-subtle);
							font-size: var(--font-size-regular);
						">
							Loading form...
						</div>
					</div>
				</div>
			`);

			// Append elements to body
			$('body').append(this.$overlay, this.$form, this.$tab);
		},

		bindEvents: function () {
			// Tab click event
			this.$tab.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.openForm();
			}.bind(this));

			// Overlay click event
			this.$overlay.on('click', function(e) {
				e.preventDefault();
				e.stopPropagation();
				this.closeForm();
			}.bind(this));

			// Escape key event
			$(document).on('keyup', $.proxy(this.onEscape, this));
		},

		positionTab: function () {
			// Adjust tab position based on configuration
			if (this.config.position === 'left') {
				this.$tab.css({
					'left': 0,
					'right': 'auto',
					'border-radius': '0 var(--border-radius) var(--border-radius) 0',
					'writing-mode': 'vertical-lr'
				});
				// Update form position for left side
				this.$form.css({
					'left': this.config.tabWidth + 'px',
					'right': 'auto',
					'transform': 'translateY(-50%) translateX(-100%)'
				});
			} else {
				this.$tab.css({
					'writing-mode': 'vertical-rl'
				});
				// Update form position for right side
				this.$form.css({
					'right': this.config.tabWidth + 'px',
					'left': 'auto',
					'transform': 'translateY(-50%) translateX(100%)'
				});
			}
		},

		openForm: function () {
			if (this.isOpen) return;

			this.isOpen = true;
			
			// Hide the tab
			this.$tab.css('opacity', 0);
			
			// Show overlay and form
			this.$overlay.show().css('opacity', 1);
			this.$form.show().css({
				'opacity': 1,
				'transform': 'translateY(-50%) translateX(0)'
			});

			// Load Tally form if not already loaded
			if (!this.isLoaded) {
				this.loadTallyForm();
			}

			// Prevent body scroll
			$('body').addClass('tally-form-open');
		},

		closeForm: function () {
			if (!this.isOpen) return;

			this.isOpen = false;

			// Show the tab
			this.$tab.css('opacity', 1);

			// Hide overlay and form with animation
			this.$overlay.css('opacity', 0);
			this.$form.css({
				'opacity': 0,
				'transform': `translateY(-50%) translateX(${this.config.position === 'right' ? '100%' : '-100%'})`
			});

			// Remove elements after animation
			setTimeout(() => {
				this.$overlay.hide();
				this.$form.hide();
			}, this.config.animationDuration);

			// Re-enable body scroll
			$('body').removeClass('tally-form-open');
		},

		loadTallyForm: function () {
			const $content = this.$form.find('.tally-form-content');
			
			// Create iframe with Tally form
			const iframe = $(`
				<iframe 
					data-tally-src="${this.config.tallyUrl}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
					loading="lazy" 
					width="100%" 
					height="100%" 
					frameborder="0" 
					marginheight="0" 
					marginwidth="0" 
					title="${this.config.tabText}"
					style="border: none; border-radius: 0 0 var(--border-radius-drawers) var(--border-radius-drawers);"
				></iframe>
			`);

			// Load Tally widget script
			const loadTallyWidget = () => {
				if (typeof Tally !== 'undefined') {
					Tally.loadEmbeds();
				} else {
					// Load Tally script if not already loaded
					if (!document.querySelector('script[src="https://tally.so/widgets/embed.js"]')) {
						const script = document.createElement('script');
						script.src = 'https://tally.so/widgets/embed.js';
						script.onload = () => {
							if (typeof Tally !== 'undefined') {
								Tally.loadEmbeds();
							}
						};
						document.body.appendChild(script);
					} else {
						// Script already exists, just load embeds
						if (typeof Tally !== 'undefined') {
							Tally.loadEmbeds();
						}
					}
				}
			};

			// Replace loading message with iframe
			$content.html(iframe);
			
			// Load Tally widget
			setTimeout(loadTallyWidget, 100);
			
			this.isLoaded = true;
		},

		onEscape: function (evt) {
			if (evt.code === 'Escape' && this.isOpen) {
				this.closeForm();
			}
		},

		// Public method to update configuration
		updateConfig: function (newConfig) {
			this.config = $.extend(true, this.config, newConfig);
			this.positionTab();
		},

		// Public method to destroy the plugin
		destroy: function () {
			this.$tab.remove();
			this.$form.remove();
			this.$overlay.remove();
			$('body').removeClass('tally-form-open');
			$(document).off('keyup', this.onEscape);
		}
	};

	// Extend window.MCF with TallyTab
	$.extend(true, window, { MCF: { TallyTab: TallyTab }});
})(jQuery); 

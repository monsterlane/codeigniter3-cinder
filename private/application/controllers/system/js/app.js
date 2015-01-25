
define( [ 'system/js/class.min', 'system/js/jquery.min' ], function( ) {
	'use strict';

	/*
	===============================================================================
	Class: App
	===============================================================================
	*/

	var App = Object.subClass({

		/**
		 * Method: init
		 */

		init: function( ) {
			this._module = null;

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var self = this;

			jQuery( 'body' ).addClass( 'cinder' );

			jQuery( window ).on( 'popstate.cinder', function( aEvent ) {
				if ( aEvent.originalEvent.state ) {
					aEvent.originalEvent.state.history = true;

					self.load( aEvent.originalEvent.state );
				}
			});
		},

		/**
		 * Method: loadModule
		 * @param {Object} aData
		 */

		load: function( aData ) {
			var data = aData || { },
				old, link, el, i, len,
				options = { },
				redir = false,
				self = this;

			data = jQuery.extend( true, {
				system: false,
				redirect: false,
				history: false,
				title: null,
				url: '/',
				module: false,
				css: [ ],
				js: [ ],
				view: null,
				container: null,
				json: { }
			}, data );

			if ( this._module !== null ) {
				old = this._module.getData( );

				if ( old.hasOwnProperty( 'module' ) && old.module !== false && data.hasOwnProperty( 'module' ) && data.module !== false ) {
					this._module = null;

					jQuery( old.container ).empty( );
					redir = true;

					if ( old.css.length > 0 ) {
						for ( i = 0, len = old.css.length; i < len; i++ ) {
							link = old.css[ i ].substr( 0, old.css[ i ].length - 4 );

							this.verbose( 'unload ' + link );

							el = jQuery( 'link[href^="/files/cache/' + link + '.css"]' );

							el.prop( 'disabled', true );
							el.remove( );

							requirejs.undef( 'system/js/css.min!' + link );
						}
					}

					if ( old.js.length > 0 ) {
						for ( i = 0, len = old.js.length; i < len; i++ ) {
							link = old.js[ i ].substr( 0, old.js[ i ].length - 3 );

							this.verbose( 'unload ' + link );

							requirejs.undef( link );
						}
					}
				}
			}

			for ( i = 0, len = data.css.length; i < len; i++ ) {
				link = 'css!' + data.css[ i ].substr( 0, data.css[ i ].indexOf( '.' ) );

				this.verbose( 'load ' + link );

				require( [ link ], function( ) { } );
			}

			if ( data.js.length > 0 ) {
				options.parent = this;
				options.url = data.url;

				data.redirect = redir;

				for ( i = 0, len = data.js.length; i < len; i++ ) {
					link = data.js[ i ].substr( 0, data.js[ i ].indexOf( '.' ) );

					this.verbose( 'load ' + link );

					require( [ link ], function( aModule ) {
						var module = new aModule( options );

						self._module = module.bindPendingData( data );
					});
				}
			}
			else {
				this._module.bindPendingData( data );
			}
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			console.log( 'app: ' + aMessage );

			return this;
		}
	});

	return App;
});

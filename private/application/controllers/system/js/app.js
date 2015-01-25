
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
		},

		/**
		 * Method: loadModule
		 * @param {Object} aData
		 */

		loadModule: function( aOptions, aData ) {
			var options = aOptions || { },
				data = aData || { },
				old, link, el, i, len,
				redir = false,
				self = this;

			data = jQuery.extend( true, {
				system: false,
				redirect: false,
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
			}
			else {
				old = { };
			}

			if ( jQuery.isEmptyObject( old ) === false && old.hasOwnProperty( 'module' ) && old.module !== '' && data.module !== false && data.module !== '' ) {
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

			for ( i = 0, len = data.css.length; i < len; i++ ) {
				link = 'css!' + data.css[ i ].substr( 0, data.css[ i ].indexOf( '.' ) );

				this.verbose( 'load ' + link );

				require( [ link ], function( ) { } );
			}

			if ( data.js.length > 0 ) {
				options.url = data.url;
				options.parent = this;
				data.redirect = redir;

				for ( i = 0, len = data.js.length; i < len; i++ ) {
					link = data.js[ i ].substr( 0, data.js[ i ].indexOf( '.' ) );

					this.verbose( 'load ' + link );

					require( [ link ], function( aModule ) {
						var module = new aModule( options );

						module.bindPendingData( data );

						self._module = module;
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

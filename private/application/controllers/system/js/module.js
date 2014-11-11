
define( [ 'system/js/conduit', 'system/js/class', 'system/js/jquery.min' ], function( aConduit ) {
	'use strict';

	/*
	===============================================================================
	Class: Module
	===============================================================================
	*/

	var Module = Object.subClass({
		/**
		 * Method: init
		 */

		init: function( ) {
			this._conduit = [ ];
			this._data = null;

			return this;
		},

		/**
		 * Method: clearData
		 */

		clearData: function( ) {
			var el, link, i, len;

			if ( this._data != null ) {
				jQuery( this._data.container ).empty( );

				for ( i = 0, len = this._data.css.length; i < len; i++ ) {
					link = this._data.css[ i ].substr( 0, this._data.css[ i ].indexOf( '.' ) );

					el = jQuery( 'link[href^="/files/cache/' + link + '.css"]' );

					if ( el.length > 0 ) {
						el.prop( 'disabled', true );
						el.remove( );
					}

					requirejs.undef( 'css!' + link );
				}

				for ( i = 0, len = this._data.js.length; i < len; i++ ) {
					link = this._data.js[ i ].substr( 0, this._data.js[ i ].indexOf( '.' ) );

					requirejs.undef( link );
				}
			}

			return this;
		},

		/**
		 * Method: bindPendingData
		 * @param {Object} aData
		 */

		bindPendingData: function( aData ) {
			var data = aData || { },
				el, link, i, len;

			this.clearData( );

			this._data = jQuery.extend( true, {
				title: null,
				url: '/',
				container: null,
				view: null,
				json: { },
				css: [ ],
				js: [ ],
				system: false
			}, data );

			if ( this._data.system == false ) {
				for ( i = 0, len = this._data.css.length; i < len; i++ ) {
					link = 'css!' + this._data.css[ i ].substr( 0, this._data.css[ i ].indexOf( '.' ) );

					require( [ link ], function( ) { } );
				}

				for ( i = 0, len = this._data.js.length; i < len; i++ ) {
					link = this._data.js[ i ].substr( 0, this._data.js[ i ].indexOf( '.' ) );

					require( [ link ], function( aModule ) {
						'use strict';

						var module = new aModule( );
					});
				}

				if ( this._data.title != null ) {
					document.title = this._data.title;
				}
			}

console.log( this._data.url );

			window.history.pushState( this._data, this._data.title, this._data.url );

			el = jQuery( this._data.container );

			if ( el.length > 0 ) {
				el[ 0 ].innerHTML = this._data.html;

				this.bindLinks( el );
				this.bindForms( el );
			}

			return this;
		},

		/**
		 * Method: bindLinks
		 * @param {Object} aContainer
		 */

		bindLinks: function( aContainer ) {
			var items, i,
				self = this;

			items = aContainer.find( 'a.cinder-link' );
			i = items.length;

			while ( i-- ) {
				$( items[ i ] ).on( 'click', function( aEvent ) {
					aEvent.preventDefault( );
					self.handleLinkClick( this );
				});
			}

			return this;
		},

		/**
		 * Method: handleLinkCLick
		 * @param {DOMelement} aLink
		 */

		handleLinkClick: function( aLink ) {
			var link = aLink.href || '/',
				data = { },
				self = this;

			//TODO collect data-attributes?

			data.system = false;

			if ( link.indexOf( '#' ) != -1 ) {
				link = '/' + link.substr( link.indexOf( '#' ) + 1 );
			}

			this.getConduit( link ).ajax({
				url: link,
				type: 'post',
				data: data,
				success: function( response ) {
					self.bindPendingData( response );
				}
			});

			return this;
		},

		/**
		 * Method: bindForms
		 * @param {Object} aContainer
		 */

		bindForms: function( aContainer ) {
			// TODO

			return this;
		},

		/**
		 * Method: getConduit
		 * @param {Object} aName
		 */

		getConduit: function( aName ) {
			var name = aName || Math.random( ).toString( 36 ).substr( 2 );

			if ( !this._conduit.hasOwnProperty( name ) ) {
				this._conduit[ name ] = new aConduit( this );
			}

			return this._conduit[ name ];
		},

		/**
		 * Method: error
		 * @param {Object} aMessage
		 */

		error: function( aMessage ) {
			console.log( aMessage );

			return this;
		},

		/**
		 * Method: verbose
		 * @param {Object} aMessage
		 */

		verbose: function( aMessage ) {
			console.log( aMessage );

			return this;
		}
	});

	return Module;
});


define( [ 'system/js/conduit', 'system/js/dot.min', 'system/js/class.min', 'system/js/jquery.min' ], function( aConduit, aParser ) {
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
			var body = jQuery( 'body' ),
				self = this;

			this._conduit = [ ];
			this._data = null;

			if ( !body.hasClass( 'cinder-history' ) ) {
				body.addClass( 'cinder-history' );

				$( window ).on( 'popstate', function( aEvent ) {
					if ( aEvent.originalEvent.state ) {
						self.bindPendingData( aEvent.originalEvent.state );
					}
				});
			}

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

					requirejs.undef( 'system/js/css.min!' + link );
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

				window.history.pushState( this._data, '', this._data.url );
			}

			el = jQuery( this._data.container );

			if ( el.length > 0 ) {
				el[ 0 ].innerHTML = this.compile( this._data.html, this._data.json );

				this.bindLinks( el );
				this.bindForms( el );
			}

			return this;
		},

		/**
		 * Method: bindLinks
		 * @param {DOMelement} aContainer
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
			var link = aLink || document.createElement( 'a' ),
				data = $( link ).data( ),
				self = this;

			data.system = false;

			this.getConduit( link.href ).ajax({
				url: link.href,
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
		 * @param {DOMelement} aContainer
		 */

		bindForms: function( aContainer ) {
			// TODO

			return this;
		},

		/**
		 * Method: getConduit
		 * @param {String} aName
		 */

		getConduit: function( aName ) {
			var name = aName || Math.random( ).toString( 36 ).substr( 2 );

			if ( !this._conduit.hasOwnProperty( name ) ) {
				this._conduit[ name ] = new aConduit( this );
			}

			return this._conduit[ name ];
		},

		/**
		 * Method: compile
		 * @param {String} aView
		 * @param {Object} aData
		 */

		compile: function( aView, aData ) {
			var tpl = aParser.template( aView ),
				str = tpl( aData );

			return str;
		},

		/**
		 * Method: error
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			console.log( aMessage );

			return this;
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			console.log( aMessage );

			return this;
		}
	});

	return Module;
});

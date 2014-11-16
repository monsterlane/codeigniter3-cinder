
define( [ 'system/js/conduit', 'system/js/model', 'system/js/parser', 'system/js/class.min', 'system/js/jquery.min' ], function( aConduit, aModel, aParser ) {
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
			this._model = new aModel( );
			this._view = new aParser( );

			if ( body.hasClass( 'cinder' ) === false ) {
				body.addClass( 'cinder' );

				$( window ).on( 'popstate', function( aEvent ) {
					if ( aEvent.originalEvent.state ) {
						self.bindPendingData( aEvent.originalEvent.state );
					}
				});
			}

			return this;
		},

		/**
		 * Method: bindPendingData
		 * @param {Object} aData
		 */

		bindPendingData: function( aData ) {
			var old = this._model.getData( ),
				data = aData || { },
				el, link, view,
				i, len;

			data = jQuery.extend( true, {
				title: null,
				url: '/',
				container: null,
				view: null,
				json: { },
				css: [ ],
				js: [ ],
				system: false
			}, data );

			if ( jQuery.isEmptyObject( old ) === false ) {
				if ( data.css.length > 0 ) {
					for ( i = 0, len = data.css.length; i < len; i++ ) {
						link = data.css[ i ].substr( 0, data.css[ i ].length - 4 );

						el = jQuery( 'link[href^="/files/cache/' + link + '.css"]' );

						el.prop( 'disabled', true );
						el.remove( );

						requirejs.undef( 'system/js/css.min!' + link );
					}
				}

				if ( data.js.length > 0 ) {
					jQuery( old.container ).empty( );

					for ( i = 0, len = data.js.length; i < len; i++ ) {
						link = data.js[ i ].substr( 0, data.js[ i ].length - 4 );

						requirejs.undef( link );
					}
				}
			}

			this._model.setData( data );

			if ( data.system === false ) {
				for ( i = 0, len = data.css.length; i < len; i++ ) {
					link = 'css!' + data.css[ i ].substr( 0, data.css[ i ].indexOf( '.' ) );

					require( [ link ], function( ) { } );
				}

				for ( i = 0, len = data.js.length; i < len; i++ ) {
					link = data.js[ i ].substr( 0, data.js[ i ].indexOf( '.' ) );

					require( [ link ], function( aModule ) {
						'use strict';

						var module = new aModule( );
					});
				}

				if ( data.title != null ) {
					document.title = data.title;
				}

				if ( data.js.length > 0 ) {
					window.history.pushState( data, '', data.url );
				}
			}

			el = jQuery( data.container );

			if ( el.length > 0 ) {
				view = this._view.get( data.url );

				if ( view === false ) {
					view = this._view.create( data.url, data.html );
				}

				el[ 0 ].innerHTML = view( data.json );

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
			var container = $( aContainer ),
				self = this;

			container.find( 'a.cinder' ).on( 'click', function( aEvent ) {
				aEvent.preventDefault( );
				self.handleLinkClick( this );
			});

			return this;
		},

		/**
		 * Method: handleLinkCLick
		 * @param {DOMelement} aLink
		 */

		handleLinkClick: function( aLink ) {
			var link = aLink || document.createElement( 'a' ),
				data = $( link ).data( ),
				view, self = this;

			data.system = false;

			view = link.href.replace( '//', '' );
			view = view.substr( view.indexOf( '/' ) );

			if ( this._view.get( view ) !== false ) {
				data.view = false;
			}

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
			var container = $( aContainer ),
				self = this;

			container.find( 'form.cinder' ).on( 'submit', function( aEvent ) {
				aEvent.preventDefault( );
				self.handleFormSubmit( this );
			});

			return this;
		},

		/**
		 * Method: handleFormSubmit
		 * @param {DOMelement} aForm
		 */

		handleFormSubmit: function( aForm ) {
			var data = $( aForm ).serialize( ),
				view, self = this;

			data += '&system=false';

			view = aForm.action.replace( '//', '' );
			view = view.substr( view.indexOf( '/' ) );

			if ( this._view.get( view ) !== false ) {
				data += '&view=false';
			}

			this.getConduit( aForm.action ).ajax({
				url: aForm.action,
				type: aForm.method,
				data: data,
				success: function( response ) {
					self.bindPendingData( response );
				}
			});
		},

		/**
		 * Method: getConduit
		 * @param {String} aName
		 */

		getConduit: function( aName ) {
			var name = aName || Math.random( ).toString( 36 ).substr( 2 );

			if ( this._conduit.hasOwnProperty( name ) === false ) {
				this._conduit[ name ] = new aConduit( this );
			}

			return this._conduit[ name ];
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

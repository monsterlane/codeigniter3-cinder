
define( [ 'system/js/conduit', 'system/js/model', 'system/js/parser', 'system/js/cache', 'system/js/class.min', 'system/js/jquery.min' ], function( aConduit, aModel, aParser, aCache ) {
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
			this._model = new aModel( this );
			this._view = new aParser( this );
			this._cache = new aCache( this );

			if ( body.hasClass( 'cinder' ) === false ) {
				body.addClass( 'cinder' );

				$( window ).on( 'popstate.cinder', function( aEvent ) {
					if ( aEvent.originalEvent.state ) {
						self.bindPendingData( aEvent.originalEvent.state );
					}
				});
			}
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
		 * Method: getData
		 */

		getData: function( ) {
			return this._model.getData( );
		},

		/**
		 * Method: setData
		 * @param {Object} aData
		 */

		setData: function( aData ) {
			this._model.setData( aData );

			return this;
		},

		/**
		 * Method: bindPendingData
		 * @param {Object} aData
		 */

		bindPendingData: function( aData ) {
			var old = this.getData( ),
				data = aData || { },
				redir = false,
				el, link, view,
				i, len;

			data = jQuery.extend( true, {
				title: null,
				url: '/',
				module: null,
				container: null,
				view: null,
				json: { },
				css: [ ],
				js: [ ],
				system: false
			}, data );

			if ( jQuery.isEmptyObject( old ) === false ) {
				if ( data.module != null && data.module != '' ) {
					jQuery( old.container ).empty( );

					redir = true;
				}

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
					for ( i = 0, len = data.js.length; i < len; i++ ) {
						link = data.js[ i ].substr( 0, data.js[ i ].length - 4 );

						requirejs.undef( link );
					}
				}
			}
			else {
				this._cache.empty( );
			}

			this.setData( data );

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

				if ( redir == true ) {
					if ( data.title != null ) {
						document.title = data.title;
					}

					this.history( data.url, data );
				}
			}

			el = jQuery( data.container );

			if ( el.length > 0 ) {
				view = this.getView( data.url );

				if ( view === false ) {
					view = this.createView( data.url, data.html );
				}

				el[ 0 ].innerHTML = view( data.json );

				this.bindLinks( el );
				this.bindForms( el );
			}

			if ( data.hasOwnProperty( 'callback' ) == true && data.callback != '' && data.callback != 'init' && jQuery.isFunction( this[ data.callback ] ) == true ) {
				this[ data.callback ]( );
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

			container.find( 'a.cinder' ).on( 'click.cinder', function( aEvent ) {
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

			if ( this.getView( view ) !== false ) {
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

			container.find( 'form.cinder' ).on( 'submit.cinder', function( aEvent ) {
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
			var form = $( aForm ),
				data = form.serialize( ),
				view, self = this;

			data += '&system=false';

			view = aForm.action.replace( '//', '' );
			view = view.substr( view.indexOf( '/' ) );

			if ( this.getView( view ) !== false ) {
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
		 * Method: getView
		 * @param {String} aView
		 */

		getView: function( aView ) {
			var view = this._view.get( aView ),
				cache;

			if ( view === false ) {
				cache = this.getCache( aView );

				if ( cache !== false ) {
					view = this._view.create( aView, cache );
				}
			}

			return view;
		},

		/**
		 * Method: createView
		 * @param {String} aKey
		 * @param {String} aContent
		 */

		createView: function( aKey, aContent ) {
			this.setCache( aKey, aContent );

			return this._view.create( aKey, aContent );
		},

		/**
		 * Method: getCache
		 * @param {String} aKey
		 */

		getCache: function( aKey ) {
			return this._cache.get( aKey );
		},

		/**
		 * Method: setCache
		 * @param {String} aKey
		 * @param {String} aContent
		 */

		setCache: function( aKey, aContent ) {
			this._cache.set( aKey, aContent );

			return this;
		},

		/**
		 * Method: history
		 * @param {String} aUrl
		 * @param {String} aData
		 */

		history: function( aUrl, aData ) {
			window.history.pushState( aData, '', aUrl );

			return this;
		},

		/**
		 * Method: redirect
		 * @param {String} aUrl
		 */

		redirect: function( aUrl ) {
			var a = document.createElement( 'a' );

			a.setAttribute( 'href', aUrl );

			this.handleLinkClick( a );
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

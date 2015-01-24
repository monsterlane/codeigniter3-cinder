
define( [ 'system/js/cache', 'system/js/conduit', 'system/js/model', 'system/js/view', 'system/js/class.min', 'system/js/jquery.min' ], function( aCache, aConduit, aModel, aView ) {
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
			this._view = new aView( this );
			this._cache = new aCache( this );

			if ( body.hasClass( 'cinder' ) === false ) {
				body.addClass( 'cinder' );

				jQuery( window ).on( 'popstate.cinder', function( aEvent ) {
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
				view = this.getView( data.url, data.hash );

				if ( view === false ) {
					view = this.createView({
						url: data.url,
						hash: data.hash,
						content: data.html
					});
				}

				el[ 0 ].innerHTML = view( data.json );

				this.bindLinks( el );
				this.bindForms( el );
			}

			this._cache.free( );

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
			var container = jQuery( aContainer ),
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
				data = jQuery( link ).data( ),
				url, self = this;

			data.system = false;

			url = link.href.replace( '//', '' );
			url = url.substr( url.indexOf( '/' ) );

			data.views = this.getViews( url );

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
			var container = jQuery( aContainer ),
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
			var form = jQuery( aForm ),
				data = form.serialize( ),
				url, views, i, len,
				self = this;

			data += '&system=false';

			url = aForm.action.replace( '//', '' );
			url = url.substr( url.indexOf( '/' ) );

			views = this.getViews( url );

			for ( i = 0, len = views.length; i < len; i++ ) {
				url += '&views[]=' + encodeURIComponent( views[ i ] );
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
		 * Method: getViews
		 * @param {String} aUrl
		 */

		getViews: function( aUrl ) {
			var views;

			if ( this._model._data.hasOwnProperty( aUrl ) ) {
				views = this._model._data[ aUrl ];
			}
			else {
				views = [ ];
			}

			return views;
		},

		/**
		 * Method: getView
		 * @param {String} aUrl
		 * @param {String} aHash
		 */

		getView: function( aUrl, aHash ) {
			var view = this._view.get( aUrl, aHash ),
				cache;

			if ( view === false ) {
				cache = this.getCache( aHash );

				if ( cache !== false ) {
					view = this.createView( JSON.parse( cache ) );

					this.verbose( 'view module: cache found' );
				}
			}
			else {
				this.verbose( 'view module: file found' );
			}

			return view;
		},

		/**
		 * Method: createView
		 * @param {Object} aView
		 */

		createView: function( aView ) {
			this.verbose( 'view module: creating view' );
			this.verbose( aView );

			if ( this._model._data.hasOwnProperty( aView.url ) === false ) {
				this._model._data[ aView.url ] = [ ];
			}

			this._model._data[ aView.url ].push( aView.hash );

			this.setCache( aView.hash, JSON.stringify( aView ) );

			return this._view.create( aView );
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

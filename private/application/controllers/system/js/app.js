
define( [ 'system/js/cache', 'system/js/conduit', 'system/js/model', 'system/js/view', 'class', 'jquery' ], function( aCache, aConduit, aModel, aView ) {
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

		init: function( aOptions ) {
			var options = aOptions || { };

			this._verbose = false;
			this._module = null;

			this._cache = new aCache( this );
			this._conduit = [ ];

			this._model = new aModel( this );
			this._view = new aView( this );

			if ( options.hasOwnProperty( 'verbose' ) === true && options.verbose === true ) {
				this._verbose = true;
			}

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
		 * Method: redirect
		 * @param {String} aUrl
		 */

		redirect: function( aUrl ) {
			var a = document.createElement( 'a' );

			a.setAttribute( 'href', aUrl );

			this.handleLinkClick( a );
		},

		/**
		 * Method: history
		 * @param {String} aUrl
		 * @param {String} aData
		 */

		history: function( aTitle, aUrl, aData ) {
			document.title = aTitle;

			window.history.pushState( aData, aTitle, aUrl );

			return this;
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			if ( this._verbose === true ) {
				console.log( aMessage );
			}

			return this;
		},

		/**
		 * Method: error
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			if ( this._module !== null ) {
				this._module.error( aMessage );
			}
			else {
				alert( aMessage );
			}
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
				old = this.getData( );

				if ( old.hasOwnProperty( 'module' ) && old.module !== false && data.hasOwnProperty( 'module' ) && data.module !== false ) {
					redir = true;

					if ( old.css.length > 0 ) {
						for ( i = 0, len = old.css.length; i < len; i++ ) {
							link = old.css[ i ].substr( 0, old.css[ i ].length - 4 );

							this.verbose( 'app: unload ' + link );

							el = jQuery( 'link[href^="/files/cache/' + link + '.css"]' );

							el.prop( 'disabled', true );
							el.remove( );

							requirejs.undef( 'system/js/css.min!' + link );
						}
					}

					if ( old.js.length > 0 ) {
						for ( i = 0, len = old.js.length; i < len; i++ ) {
							link = old.js[ i ].substr( 0, old.js[ i ].length - 3 );

							this.verbose( 'app: unload ' + link );

							requirejs.undef( link );
						}
					}
				}
			}

			for ( i = 0, len = data.css.length; i < len; i++ ) {
				link = 'css!' + data.css[ i ].substr( 0, data.css[ i ].indexOf( '.' ) );

				this.verbose( 'app: load ' + link );

				require( [ link ], function( ) { } );
			}

			if ( data.js.length > 0 ) {
				options.parent = this;
				options.url = data.url;

				data.redirect = redir;

				for ( i = 0, len = data.js.length; i < len; i++ ) {
					link = data.js[ i ].substr( 0, data.js[ i ].indexOf( '.' ) );

					this.verbose( 'app: load ' + link );

					require( [ link ], function( aModule ) {
						var module = new aModule( options );

						self.setModule( module );
						self.bindPendingData( data );
					});
				}
			}
			else {
				this.bindPendingData( data );
			}
		},

		/**
		 * Method: setModule
		 * @param {Object} aModule
		 */

		setModule: function( aModule ) {
			if ( this._module != null ) {
				this._module = null;
			}

			this._module = aModule;
		},

		/**
		 * Method: bindPendingData
		 * @param {Object} aData
		 */

		bindPendingData: function( aData ) {
			var data = aData || { },
				el, view;

			if ( typeof data.redirect === 'string' ) {
				this.redirect( data.redirect );
			}
			else {
				this.setData( data );

				if ( data.system === true || data.history === true ) {
					document.title = data.title;
				}
				else if ( data.redirect === true ) {
					this.history( data.title, data.url, data );
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

					el.empty( );
					el[ 0 ].innerHTML = view( data.json );

					this.bindLinks( el );
					this.bindForms( el );
				}

				if ( this._module !== null && data.hasOwnProperty( 'callback' ) === true && data.callback !== '' && data.callback !== 'init' ) {
					if ( jQuery.isFunction( this._module[ data.callback ] ) == true ) {
						this.verbose( 'app: callback ' + data.callback );

						this._module[ data.callback ]( );
					}
					else {
						this.verbose( 'app: callback ' + data.callback + ' skipped (not found)' );
					}
				}

				this._cache.free( );
			}

			return this;
		},

		/**
		 * Method: getData
		 */

		getData: function( aKey ) {
			var key = aKey || null,
				data = this._model.getData( );

			if ( key !== null ) {
				if ( data.hasOwnProperty( aKey ) ) {
					return data[ key ];
				}
				else {
					return false;
				}
			}
			else {
				return data;
			}
		},

		/**
		 * Method: setData
		 * @param {Mixed}
		 */

		setData: function( ) {
			this._model.setData( arguments );

			return this;
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
					this.verbose( 'app: view cache found' );

					view = this._view.create( JSON.parse( cache ) );
				}
			}
			else {
				this.verbose( 'app: view file found' );
			}

			return view;
		},

		/**
		 * Method: createView
		 * @param {Object} aView
		 */

		createView: function( aView ) {
			this.verbose( 'app: creating view' );

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
		 * Method: emptyCache
		 */

		emptyCache: function( ) {
			this._cache.empty( );
			this._cache.free( );
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

			if ( link.href != window.location.href ) {
				url = link.href.replace( '//', '' );
				url = url.substr( url.indexOf( '/' ) );

				data.views = this.getViews( url );

				this.getConduit( url ).ajax({
					url: url,
					data: data,
					success: function( response ) {
						self.load( response );
					}
				});
			}
			else {
				document.body.scrollTop = document.documentElement.scrollTop = 0;
			}

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

			url = aForm.action.replace( '//', '' );
			url = url.substr( url.indexOf( '/' ) );

			views = this.getViews( url );

			for ( i = 0, len = views.length; i < len; i++ ) {
				data += '&views[]=' + encodeURIComponent( views[ i ] );
			}

			this.getConduit( aForm.action ).ajax({
				url: aForm.action,
				data: data,
				success: function( response ) {
					self.load( response );
				}
			});
		}
	});

	return App;
});

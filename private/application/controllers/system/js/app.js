
define( [ 'jquery', 'jclass', 'system/js/cache', 'system/js/conduit', 'system/js/model', 'system/js/view' ], function( $, Class, Cache, Conduit, Model, View ) {
	'use strict';

	/*
	===============================================================================
	Class: App
	===============================================================================
	*/

	var App = Class._extend({

		/**
		 * Method: init
		 */

		init: function( aOptions ) {
			var options = aOptions || { };

			this._verbose = false;
			this._module = null;

			this._cache = new Cache( this );
			this._conduit = [ ];

			this._model = new Model( this );
			this._view = new View( this );

			this.setData( 'system.options', options );
			this.setData( 'views', [ ] );

			if ( Object.keys( options ).length > 0 ) {
				if ( options.hasOwnProperty( 'verbose' ) === true && options.verbose === true ) {
					this._verbose = true;
				}
			}

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var self = this;

			$( 'body' ).addClass( 'cinder' );

			$( window ).on( 'popstate.cinder', function( aEvent ) {
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
		 * @param {Object} aError
		 */

		error: function( aError ) {
			if ( this._module !== null ) {
				this._module.error( aError );
			}
			else {
				alert( aError );
			}
		},

		/**
		 * Method: load
		 * @param {Object} aData
		 */

		load: function( aData ) {
			var data = aData || { },
				last, link, el, i, len,
				options = { },
				redir = false,
				self = this;

			data = $.extend( true, {
				system: false,
				redirect: false,
				history: false,
				title: null,
				url: '/',
				name: false,
				view: {
					css: [ ],
					container: null,
					path: null,
					hash: null,
					data: [ ]
				}
			}, data );

			if ( this._module !== null ) {
				last = this.getData( 'module.data' );

				if ( last.name !== false && data.name !== false ) {
					redir = true;

					for ( i = 0, len = last.view.css.length; i < len; i++ ) {
						link = last.view.css[ i ].substr( 0, last.view.css[ i ].length - 4 );

						this.verbose( 'app: unload ' + link );

						el = $( 'link[href^="/files/cache/' + link + '.css"]' );

						el.prop( 'disabled', true );
						el.remove( );

						requirejs.undef( 'system/js/require.css.min!' + link );
					}

					this.verbose( 'app: unload ' + last.name );

					requirejs.undef( last.name );
				}
			}

			for ( i = 0, len = data.view.css.length; i < len; i++ ) {
				link = 'css!' + data.view.css[ i ].substr( 0, data.view.css[ i ].indexOf( '.' ) );

				this.verbose( 'app: load ' + link );

				require( [ link ], function( ) { } );
			}

			if ( data.name !== false ) {
				options.parent = this;
				options.url = data.url;

				data.redirect = redir;

				this.verbose( 'app: load ' + data.name );

				require( [ data.name ], function( Module ) {
					var module = new Module( options );

					self.setModule( module );
					self.setPendingData( data );
				});
			}
			else if ( this._module !== null ) {
				this.setPendingData( data );
			}
		},

		/**
		 * Method: setModule
		 * @param {Object} aModule
		 */

		setModule: function( aModule ) {
			if ( this._module !== null ) {
				this._module = null;
			}

			this._module = aModule;
		},

		/**
		 * Method: setPendingData
		 * @param {Object} aData
		 */

		setPendingData: function( aData ) {
			var data = aData || { },
				module, el, view;

			this.verbose( 'app: set pending data' );

			if ( typeof data.redirect === 'string' ) {
				this.redirect( data.redirect );
			}
			else {
				module = this.getData( 'module.data.name' );

				if ( module !== false && data.name === false ) {
					delete data.name;
				}

				this.setData( 'module.data', data );

				if ( data.system === true || data.history === true ) {
					document.title = data.title;
				}
				else if ( data.redirect === true ) {
					this.history( data.title, data.url, data );
				}

				el = $( data.view.container );

				if ( el.length > 0 ) {
					view = this.getView( data.url, data.view.hash );

					if ( view === false ) {
						view = this.createView({
							url: data.url,
							hash: data.view.hash,
							content: data.view.html
						});
					}

					el.empty( );
					el[ 0 ].innerHTML = view( data.view.data );

					this.bindLinks( el );
					this.bindForms( el );
				}

				if ( this._module !== null && data.hasOwnProperty( 'callback' ) === true ) {
					if ( data.callback !== 'init' && $.isFunction( this._module[ data.callback ] ) === true ) {
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
		 * @param {String} aKey
		 */

		getData: function( aKey ) {
			return this._model.get( aKey );
		},

		/**
		 * Method: setData
		 * @param {String} aKey
		 * @param {Mixed} aData
		 */

		setData: function( aKey, aData ) {
			this._model.set( aKey, aData );

			return this;
		},

		/**
		 * Method: getViews
		 * @param {String} aUrl
		 */

		getViews: function( aUrl ) {
			var url = aUrl || '',
				a, views;

			if ( url.indexOf( 'http' ) !== -1 ) {
				a = document.createElement( a );
				a.href = url;

				url = a.pathname + a.search;
				url = url.substring( 1 );
			}
			else if ( url.charAt( 0 ) === '/' ) {
				url = url.substring( 1 );
			}

			views = this.getData( 'views.' + url );

			return views;

			//return this.getData( 'views.' + aUrl );
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

			if ( this._model._data.views.hasOwnProperty( aView.url ) === false ) {
				this._model._data.views[ aView.url ] = [ ];
			}

			this._model._data.views[ aView.url ].push( aView.hash );

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
		 * Method: clearCache
		 */

		clearCache: function( ) {
			this._view.empty( );
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
				this._conduit[ name ] = new Conduit( this );
			}

			return this._conduit[ name ];
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
				url, self = this;

			if ( link.href !== window.location.href ) {
				url = link.href.replace( '//', '' );
				url = url.substr( url.indexOf( '/' ) );

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
				url, self = this;

			url = aForm.action.replace( '//', '' );
			url = url.substr( url.indexOf( '/' ) );

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

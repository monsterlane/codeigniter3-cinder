
define( [ 'jclass', 'jquery', 'plugins', 'font', 'system/js/cache', 'system/js/conduit', 'system/js/model', 'system/js/view' ], function( Class, $, Plugins, Font, Cache, Conduit, Model, View ) {
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
			var options = aOptions || { },
				link, i, len;

			this._verbose = false;
			this._module = null;

			this._cache = new Cache( this );
			this._conduit = [ ];

			this._model = new Model( this );
			this._view = new View( this );

			this.setData( 'system.options', options );
			this.setData( 'system.views', [ ] );

			if ( Object.keys( options ).length > 0 ) {
				if ( options.hasOwnProperty( 'verbose' ) === true && options.verbose === true ) {
					this._verbose = true;
				}

				if ( options.hasOwnProperty( 'fonts' ) === true && $.isArray( options.fonts ) === true ) {
					for ( i = 0, len = options.fonts.length; i < len; i++ ) {
						link = 'font!' + options.fonts[ i ];

						this.verbose( 'app: load ' + link );

						require( [ link ] );
					}
				}
			}

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var self = this;

			$( 'html' ).addClass( 'cinder' );

			$( window ).on( 'popstate.cinder', function( aEvent ) {
				if ( aEvent.originalEvent.state ) {
					aEvent.originalEvent.state.history = true;

					self.load( aEvent.originalEvent.state );
				}
			});

			if ( this._verbose === false ) {
				window.onerror = function( aMessage, aFilename, aLine ) {
					self.log( aMessage, aFilename, aLine );

					return true;
				};
			}
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
		 * Method: message
		 * @param {String} aMessage
		 * @param {String} aKey
		 */

		message: function( aMessage, aKey ) {
			var msg = aMessage || false,
				key = aKey || 'system.options.flashdata_container',
				selector = this.getData( key ),
				data = this.getData( 'module.data' ),
				el;

			if ( msg !== false ) {
				el = $( data.view.container ).find( selector );

				if ( el.length === 0 ) {
					el = $( selector );
				}

				el.html( aMessage ).show( );
			}
			else {
				$( selector ).empty( );
			}
		},

		/**
		 * Method: log
		 * @param {String} aMessage
		 * @param {String} aFilename
		 * @param {Int} aLine
		 */

		log: function( aMessage, aFilename, aLine ) {
			var msg = aMessage || 'SyntaxError: Unknown',
				file = aFilename || 'unknown',
				line = aLine || 0,
				self = this;

			this.getConduit( ).ajax({
				url: '/error',
				data: {
					message: msg,
					filename: file,
					line: line
				},
				success: function( response ) {
					self.error( {
						body: 'An error has occurred. ' + self.getData( 'system.options.support_message' )
					} );
				}
			});
		},

		/**
		 * Method: extend
		 * @param {Object} aDestination
		 * @param {Object} aSource
		 */

		extend: function( aDestination, aSource ) {
			var i;

			for ( i in aSource ) {
				if ( aSource.hasOwnProperty( i ) === true ) {
					aDestination[ i ] = aSource[ i ];
				}
			}

			return aDestination;
		},

		/**
		 * Method: load
		 * @param {Object} aData
		 */

		load: function( aData ) {
			var data = aData || { },
				last, link, fp, ff, el, i, len,
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
					fonts: [ ],
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

					for ( i = 0, len = last.view.fonts.length; i < len; i++ ) {
						link = last.view.fonts[ i ];

						this.verbose( 'app: unload ' + link );

						fp = link.substring( 0, link.indexOf( ',' ) );

						ff = link.substring( link.indexOf( '[' ) + 1, link.lastIndexOf( ']' ) );
						ff = ff.replace( ',', '|' );
						ff = encodeURIComponent( ff );

						el = $( 'link[href*="' + fp + '"][href*="' + ff + '"]' );

						el.prop( 'disabled', true );
						el.remove( );

						requirejs.undef( 'system/js/require.webfont!' + link );
					}

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

			if ( data.view !== false ) {
				for ( i = 0, len = data.view.fonts.length; i < len; i++ ) {
					link = 'font!' + data.view.fonts[ i ];

					this.verbose( 'app: load ' + link );

					require( [ link ] );
				}

				for ( i = 0, len = data.view.css.length; i < len; i++ ) {
					link = 'css!' + data.view.css[ i ].substr( 0, data.view.css[ i ].indexOf( '.' ) );

					this.verbose( 'app: load ' + link );

					require( [ link ] );
				}
			}

			if ( data.name !== false ) {
				options.parent = this;
				options.url = data.url;

				data.redirect = redir;

				this.verbose( 'app: load ' + data.name );

				this.setPendingData( data );

				require( [ data.name ], function( Module ) {
					self.setModule( new Module( options ) );
					self.callback( data );
				});
			}
			else if ( this._module !== null ) {
				this.setPendingData( data );
				this.callback( data );
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
							path: data.view.path,
							hash: data.view.hash,
							content: data.view.html
						});

						if ( data.view.hasOwnProperty( 'invalidate' ) === true ) {
							this.verbose( 'app: invalidate ' + data.view.invalidate );

							this.removeCache( data.view.invalidate );
						}
					}

					el.empty( );
					el[ 0 ].innerHTML = view( data.view.data );

					this.bindLinks( el );
					this.bindForms( el );
				}

				this._cache.free( );
			}

			return this;
		},

		/**
		 * Method: callback
		 * @param {Object} aData
		 */

		callback: function( aData ) {
			var data = aData || { };

			if ( this._module !== null && data.hasOwnProperty( 'callback' ) === true ) {
				if ( data.callback !== 'init' && $.isFunction( this._module[ data.callback ] ) === true ) {
					this.verbose( 'app: callback ' + data.callback );

					this._module[ data.callback ]( );
				}
				else {
					this.verbose( 'app: callback ' + data.callback + ' skipped (not found)' );
				}
			}

			if ( data.hasOwnProperty( 'flashdata' ) === true ) {
				if ( data.flashdata.hasOwnProperty( 'message' ) === true ) {
					this.verbose( 'app: flash message' );

					this.message( data.flashdata.message );
				}
			}
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
		 * Method: removeData
		 * @param {String} aKey
		 */

		removeData: function( aKey ) {
			this._model.remove( aKey );

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

			views = this.getData( 'system.views.' + url );

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
				cache = false;

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
			var key = 'system.views.' + aView.url;

			this.verbose( 'app: creating view' );

			if ( this.getData( key ) === false ) {
				this.setData( key, [ ] );
			}

			this.setData( key, [ aView.path + '|' + aView.hash ] );

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
		 * Method: removeCache
		 * @param {String} aKey
		 */

		removeCache: function( aKey )  {
			this._cache.remove( aKey );

			return this;
		},

		/**
		 * Method: clearCache
		 */

		clearCache: function( ) {
			this.removeData( 'system.views' );
			this.setData( 'system.views', [ ] );

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
			var options = { },
				form = $( aForm ),
				button, url,
				self = this;

			button = form.find( 'button[type=submit], input[type=submit]' );

			url = form[ 0 ].action.replace( '//', '' );
			url = url.substr( url.indexOf( '/' ) );

			options.url = url;

			if ( form[ 0 ].hasAttribute( 'enctype' ) === true && form[ 0 ].getAttribute( 'enctype' ) === 'multipart/form-data' ) {
				options.data = new FormData( form[ 0 ] );
				options.processData = false;
				options.contentType = false;
				options.cache = false;
			}
			else {
				options.data = form.serialize( );
			}

			options.beforeSend = function( ) {
				button.disable( );
			};

			options.success = function( response ) {
				button.enable( );
				self.load( response );
			};

			options.error = function( ) {
				button.enable( );
			};

			this.getConduit( url ).ajax( options );
		}
	});

	return App;
});

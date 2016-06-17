
define( [ 'jclass', 'jquery', 'plugins', 'font', 'timer', 'system/js/cache', 'system/js/conduit', 'system/js/model', 'system/js/view' ], function( Class, $, Plugins, Font, Timer, Cache, Conduit, Model, View ) {
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
			this._loaded = null;
			this._timer = null;

			this._cache = new Cache( this );
			this._conduit = [ ];

			this._model = new Model( this );
			this._view = new View( this );

			this._container = document.getElementById( 'cinderDocument' );
			this.$container = $( this._container );

			this._templates = document.getElementById( 'cinderTemplates' );
			this.$templates = $( this._templates );

			this.$overlay = this.$templates.find( '> div.overlay' );
			this._overlay = this.$overlay[ 0 ];

			this.$loading = this.$container.find( '> div.loading' );
			this._loading = this.$loading[ 0 ];

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
			var a;

			if ( aUrl.indexOf( window.location.protocol ) === -1 ) {
				window.location.href = aUrl;
			}
			else {
				a = document.createElement( 'a' );
				a.setAttribute( 'href', aUrl );

				this.handleLinkClick( a, true );
			}
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

		message: function( aMessage, aKey, aClasses ) {
			var msg = aMessage || false,
				key = aKey || 'system.options.flashdata_container',
				classes = aClasses || 'success',
				selector = this.getData( key ),
				data = this.getData( 'module.data' ),
				el;

			if ( msg !== false ) {
				el = $( data.view.container ).find( selector );

				if ( el.length === 0 ) {
					el = $( selector );
				}

				el.html( '<div class="alert alert-' + classes + '" role="alert">' + aMessage + '</div>' ).show( );
			}
			else {
				$( selector ).empty( );
			}
		},

		/**
		 * Method: clear
		 * @param {String} aKey
		 */

		clear: function( aKey ) {
			var key = aKey || 'system.options.flashdata_container',
				selector = this.getData( key ),
				data = this.getData( 'module.data' ),
				el;

			if ( data !== false ) {
				el = $( data.view.container );
			}
			else {
				el = $( key );
			}

			el.find( selector ).hide( ).empty( );
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
				url: '/error/javascript',
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
		 * Method: unload
		 */

		unload: function( ) {
			var module = this.getData( 'module.data' ),
				link, fp, ff, el,
				i, len;

			this._loaded = -1;

			if ( module !== false ) {
				for ( i = 0, len = module.view.fonts.length; i < len; i++ ) {
					link = module.view.fonts[ i ];

					this.verbose( 'app: unload ' + link );

					fp = link.substring( 0, link.indexOf( ',' ) );

					ff = link.substring( link.indexOf( '[' ) + 1, module.lastIndexOf( ']' ) );
					ff = ff.replace( ',', '|' );
					ff = encodeURIComponent( ff );

					el = $( 'link[href*="' + fp + '"][href*="' + ff + '"]' );

					el.prop( 'disabled', true );
					el.remove( );

					requirejs.undef( 'system/js/require.webfont!' + link );
				}

				for ( i = 0, len = module.view.css.length; i < len; i++ ) {
					link = module.view.css[ i ].substr( 0, module.view.css[ i ].length - 4 );

					this.verbose( 'app: unload ' + link );

					el = $( 'link[href*="' + link + '.css"]' );

					el.prop( 'disabled', true );
					el.remove( );

					requirejs.undef( 'system/js/require.css.min!' + link );
				}

				this.verbose( 'app: unload ' + module.name );
				this.verbose( '~===~' );

				requirejs.undef( module.name );
			}
		},

		/**
		 * Method: load
		 * @param {Object} aData
		 */

		load: function( aData ) {
			var data = aData || { },
				link, i, len,
				dependencies = [ ],
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

			this._loaded = -1;

			if ( this._module !== null ) {
				link = this.getData( 'module.data.name' );

				if ( link !== false && link.name !== false && data.name !== false ) {
					redir = true;

					this.unload( );
				}
			}

			if ( data.view !== false ) {
				for ( i = 0, len = data.view.fonts.length; i < len; i++ ) {
					link = 'font!' + data.view.fonts[ i ];

					this.verbose( 'app: load ' + link );

					dependencies.push( link );
				}

				for ( i = 0, len = data.view.css.length; i < len; i++ ) {
					link = 'css!' + data.view.css[ i ].substr( 0, data.view.css[ i ].indexOf( '.' ) );

					this.verbose( 'app: load ' + link );

					dependencies.push( link );
				}

				if ( data.view.css.length === 0 ) {
					this._loaded += 1;
				}
			}
			else {
				this._loaded += 1;
			}

			if ( data.name !== false ) {
				options.parent = this;
				options.url = data.url;

				data.redirect = redir;

				this.verbose( 'app: load ' + data.name );

				dependencies.unshift( data.name );

				$( 'li.selected' ).removeClass( 'selected' );
				$( 'li > a[href$="' + data.url + '"]' ).parent( ).addClass( 'selected' );

				require( dependencies, function( Module ) {
					self.setModule( new Module( options ) );

					self._loaded += 1;
				});

				if ( this._timer instanceof Timer ) {
					this._timer._callbacks.stop = function( ) {
						self.setPendingData( data );
						self.callback( data );
					};

					this._timer.start( );
				}
				else {
					this._timer = new Timer({
						parent: this,
						think: function( ) {
							if ( window.getComputedStyle( self._loading ).backgroundColor === 'rgb(0, 0, 0)' ) {
								self._loaded += 1;
							}

							if ( self._loaded > 0 ) {
								return false;
							}

							return true;
						},
						stop: function( ) {
							self.setPendingData( data );
							self.callback( data );
						}
					});
				}
			}
			else if ( this._module !== null ) {
				if ( this._timer instanceof Timer && this._timer.running( ) === true ) {
					this._timer.stop( );
				}
				else {
					this.setPendingData( data );
					this.callback( data );
				}
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
				module, csrf, el, view;

			this.verbose( 'app: set pending data' );

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

			if ( data.hasOwnProperty( 'csrf' ) === true && $.isEmptyObject( data.csrf ) === false && ( csrf = document.getElementById( 'cinderCsrf' ) ) !== null ) {
				csrf.value = data.csrf.hash;
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

				if ( data.view.show_nav === true ) {
					if ( this.$container.hasClass( 'hide-nav' ) === true ) {
						this.$container.removeClass( 'hide-nav' );
					}
				}
				else if ( this.$container.hasClass( 'hide-nav' ) === false ) {
					this.$container.addClass( 'hide-nav' );
				}

				el[ 0 ].innerHTML = view( data.view.data );

				if ( data.system === true ) {
					this.bindLinks( this.$container );

					this.$container.show( );
				}

				this.bindLinks( el );
				this.bindForms( el );

				this._module.bindMainEventListeners( );

				this.hideProgress( el );
			}

			this._cache.free( );

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

				if ( cache !== false ) {
					this.verbose( 'app: view cache found' );

					view = this._view.create( cache );
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

			this.setCache( aView.hash, aView );

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
		 * Method: showProgress
		 * @param {DOMelement} aContainer
		 */

		showProgress: function( aContainer ) {
			var container = $( aContainer );

			container.parent( ).append( this.$overlay.clone( ) );
		},

		/**
		 * Method: hideProgress
		 * @param {DOMelement} aContainer
		 */

		hideProgress: function( aContainer ) {
			var container = $( aContainer );

			container.parent( ).find( '> div.overlay' ).remove( );
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
				self.handleLinkClick( this, false );
			});

			return this;
		},

		/**
		 * Method: handleLinkCLick
		 * @param {DOMelement} aLink
		 * @param {Bool} aRedirect
		 */

		handleLinkClick: function( aLink, aRedirect ) {
			var container = $( this.getData( 'module.data.view.container' ) ),
				link = aLink || document.createElement( 'a' ),
				redirect = aRedirect || false,
				attr = $( link ).data( ),
				url, self = this;

			if ( link.href !== window.location.href || redirect === true ) {
				url = link.href.replace( '//', '' );
				url = url.substr( url.indexOf( '/' ) );

				this.getConduit( url ).ajax({
					url: url,
					data: attr,
					beforeSend: function( ) {
						if ( container.length > 0 && container.find( '> div.overlay' ).length === 0 ) {
							self.showProgress( container );
						}
					},
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
				button, url, view,
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

			view = this.getData( 'module.data.view.container' );

			options.beforeSend = function( ) {
				self.clear( 'system.options.validation_container' );

				if ( view !== self.getData( 'system.options.default_container' ) ) {
					$( view ).empty( );
				}

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

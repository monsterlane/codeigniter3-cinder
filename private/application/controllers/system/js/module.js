
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
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			var options = aOptions || { },
				body = jQuery( 'body' ),
				i, len, self = this;

			this._parent = aOptions.parent;
			this._cache = new aCache( this );
			this._conduit = [ ];
			this._url = '/';

			this._model = new aModel( this );
			this._view = new aView( this );

			if ( Object.keys( options ).length > 0 ) {
				this.setData( options );

				if ( options.hasOwnProperty( 'url' ) ) {
					this._url = options.url;
				}
			}
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
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

					el[ 0 ].innerHTML = view( data.json );

					this.bindLinks( el );
					this.bindForms( el );
				}

				if ( data.hasOwnProperty( 'callback' ) == true && data.callback != '' && data.callback != 'init' ) {
					if ( jQuery.isFunction( this[ data.callback ] ) == true ) {
						this.verbose( 'callback ' + data.callback );

						this[ data.callback ]( );
					}
					else {
						this.verbose( 'callback ' + data.callback + ' skipped (not found)' );
					}
				}

				this._cache.free( );
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
			var parent = this.getParent( ),
				link = aLink || document.createElement( 'a' ),
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
						parent.load( response );
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
			var parent = this.getParent( ),
				form = jQuery( aForm ),
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
					parent.load( response );
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
					this.verbose( 'view cache found' );

					view = this._view.create( JSON.parse( cache ) );
				}
			}
			else {
				this.verbose( 'view file found' );
			}

			return view;
		},

		/**
		 * Method: createView
		 * @param {Object} aView
		 */

		createView: function( aView ) {
			this.verbose( 'creating view' );

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
		 * Method: error
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			alert( aMessage );

			return this;
		},

		/**
		 * Method: dialog
		 * @param {Object} aOptions
		 */

		dialog: function( aOptions ) {
			// TODO
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			console.log( 'module: ' + aMessage );

			return this;
		}
	});

	return Module;
});

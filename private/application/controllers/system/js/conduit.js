
define( [ 'jclass', 'jquery' ], function( Class, $ ) {
	'use strict';

	/*
	===============================================================================
	Class: Conduit
	===============================================================================
	*/

	var Conduit = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._xhr = null;
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: ajax
		 * @param {Object} aOptions
		 */

		ajax: function( aOptions ) {
			var parent = this.getParent( ),
				opt = aOptions || { },
				regex = new RegExp( '^(https?:\/\/)' ),
				ncb, ocb, views, i, len,
				jsonp = false,
				self = this;

			if ( opt.hasOwnProperty( 'dataType' ) === true && opt.dataType === 'jsonp' ) {
				opt.type = 'get';

				jsonp = true;
			}
			else if ( regex.test( opt.url ) === false ) {
				opt.type = 'post';

				views = parent.getViews( opt.url );

				if ( opt.hasOwnProperty( 'data' ) && opt.data !== null ) {
					if ( typeof opt.data === 'object' ) {
						opt.data.system = false;
						opt.data.views = views;
					}
					else if ( typeof opt.data === 'string' ) {
						opt.data += '&system=false';

						for ( i = 0, len = views.length; i < len; i++ ) {
							opt.data += '&views[]=' + encodeURIComponent( views[ i ] );
						}
					}
				}
				else {
					opt.data = {
						system: false,
						views: views
					};
				}
			}

			if ( opt.hasOwnProperty( 'success' ) === true ) {
				ocb = opt.success;

				ncb = function( aResponse, aCode, aXhr ) {
					var r;

					if ( jsonp === true || $.isPlainObject( aResponse ) === true ) {
						ocb( aResponse );
					}
					else if ( ( r = self.parse( aResponse ) ) !== false ) {
						if ( r.hasOwnProperty( 'status' ) && r.status === false ) {
							if ( r.hasOwnProperty( 'message' ) === true ) {
								self.error( {
									body: r.message
								} );
							}
							else if ( r.hasOwnProperty( 'validation' ) === true ) {
								parent.message( r.validation, 'system.options.validation_container' );
							}
							else {
								self.error( {
									body: 'An error has occurred. ' + parent.getData( 'system.options.support_message' )
								} );
							}

							if ( opt.hasOwnProperty( 'error' ) === true ) {
								opt.error( );
							}
						}
						else if ( typeof r.redirect === 'string' ) {
							self.getParent( ).redirect( r.redirect );
						}
						else {
							ocb( r );
						}
					}
					else {
						self.error( {
							body: 'An error has occurred. ' + parent.getData( 'system.options.support_message' )
						} );

						if ( opt.hasOwnProperty( 'error' ) === true ) {
							opt.error( );
						}
					}
				};
			}
			else {
				ncb = function( aResponse, aCode, aXhr ) {
					if ( jsonp === false && self.parse( aResponse ) === false ) {
						self.error( {
							body: 'An error has occurred. ' + parent.getData( 'system.options.support_message' )
						} );

						if ( opt.hasOwnProperty( 'error' ) === true ) {
							opt.error( );
						}
					}
				};
			}

			opt.success = ncb;

			parent.message( false );

			this.abort( );

			this._xhr = $.ajax( opt );

			$.when( this._xhr ).then( function( ) {
				self._xhr = null;
			});
		},

		/**
		 * Method: abort
		 */

		abort: function( ) {
			if ( this.running( ) === true ) {
				this._xhr.abort( );
				this._xhr = null;
			}
		},

		/**
		 * Method: parse
		 * @param {String} aResponse
		 */

		parse: function( aResponse ) {
			var r;

			try {
				r = JSON.parse( aResponse );
			}
			catch( err ) {
				r = false;
			}

			return r;
		},

		/**
		 * Method: running
		 * @return {Bool}
		 */

		running: function( ) {
			return ( this._xhr !== null ) ? true : false;
		},

		/**
		 * Method: error
		 * @param {Object} aMessage
		 */

		error: function( aError ) {
			var parent = this.getParent( );

			parent.error( aError );
		},

		/**
		 * Method: validation
		 * @param {String} aValidation
		 */

		validation: function( aValidation ) {
			var parent = this.getParent( );

			parent.validation( aValidation );
		}
	});

	return Conduit;
});

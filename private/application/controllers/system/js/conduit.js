
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
				obcb, nbcb, oscb, nscb, oecb, necb, views, csrf, i, len,
				jsonp = false,
				self = this;

			if ( opt.hasOwnProperty( 'dataType' ) === true && opt.dataType === 'jsonp' ) {
				opt.type = 'get';

				jsonp = true;
			}
			else if ( regex.test( opt.url ) === false ) {
				opt.type = 'post';
				opt.dataType = 'json';

				views = parent.getViews( opt.url );

				if ( opt.hasOwnProperty( 'data' ) && opt.data !== null ) {
					if ( typeof opt.data === 'object' ) {
						if ( opt.data instanceof FormData ) {
							opt.data.append( 'system', false );

							if ( ( csrf = document.getElementById( 'cinderCsrf' ) ) !== null ) {
								opt.data.append( csrf.name, csrf.value );
							}

							for ( i = 0, len = views.length; i < len; i++ ) {
								opt.data.append( 'views[]', encodeURIComponent( views[ i ] ) );
							}
						}
						else {
							opt.data.system = false;
							opt.data.views = views;

							if ( ( csrf = document.getElementById( 'cinderCsrf' ) ) !== null ) {
								opt.data[ csrf.name ] = csrf.value;
							}
						}
					}
					else if ( typeof opt.data === 'string' ) {
						opt.data += '&system=false';

						if ( ( csrf = document.getElementById( 'cinderCsrf' ) ) !== null ) {
							opt.data += '&' + csrf.name + '=' + csrf.value;
						}

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

					if ( ( csrf = document.getElementById( 'cinderCsrf' ) ) !== null ) {
						opt.data[ csrf.name ] = csrf.value;
					}
				}
			}

			if ( opt.hasOwnProperty( 'error' ) === true && $.isFunction( opt.error ) === true ) {
				oecb = opt.error;
			}
			else {
				oecb = function( ) { };
			}

			necb = function( aXhr, aStatus, aError ) {
				if ( aXhr.hasOwnProperty( 'readyState' ) === true ) {
					parent.error( {
						body: 'An error has occurred. ' + parent.getData( 'system.options.support_message' )
					} );
				}

				oecb( aXhr, aStatus, aError );
			};

			opt.error = necb;

			if ( opt.hasOwnProperty( 'beforeSend' ) === true && $.isFunction( opt.beforeSend ) === true ) {
				obcb = opt.beforeSend;
			}
			else {
				obcb = function( aXhr, aOptions ) { };
			}

			nbcb = function( aXhr, aOptions ) {
				parent.message( false );

				self.abort( );

				obcb( aXhr, aOptions );
			};

			opt.beforeSend = nbcb;

			if ( opt.hasOwnProperty( 'success' ) === true && $.isFunction( opt.success ) === true ) {
				oscb = opt.success;
			}
			else {
				oscb = function( aResponse, aCode, aXhr ) { };
			}

			nscb = function( aResponse, aCode, aXhr ) {
				if ( aResponse.hasOwnProperty( 'status' ) && aResponse.status === false ) {
					if ( aResponse.hasOwnProperty( 'message' ) === true ) {
						parent.error( {
							body: aResponse.message
						} );

						necb( aResponse );
					}
					else if ( aResponse.hasOwnProperty( 'validation' ) === true ) {
						parent.message( aResponse.validation, 'system.options.validation_container' );

						necb( aResponse );
					}
				}
				else if ( typeof aResponse.redirect === 'string' ) {
					parent.redirect( aResponse.redirect );
				}
				else {
					oscb( aResponse, aCode, aXhr );
				}

				self.done( );
			};

			opt.success = nscb;

			this._xhr = $.ajax( opt );
		},

		/**
		 * Method: done
		 */

		done: function( ) {
			this._xhr = null;
		},

		/**
		 * Method: running
		 * @return {Bool}
		 */

		running: function( ) {
			return ( this._xhr !== null ) ? true : false;
		},

		/**
		 * Method: abort
		 */

		abort: function( ) {
			if ( this.running( ) === true ) {
				this._xhr.abort( );
				this._xhr = null;
			}
		}
	});

	return Conduit;
});

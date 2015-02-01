
define( [ 'class', 'jquery' ], function( ) {
	'use strict';

	/*
	===============================================================================
	Class: Conduit
	===============================================================================
	*/

	var Conduit = Object.subClass({

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
				jsonp = false,
				ncb, ocb,
				self = this;

			opt.type = 'post';

			if ( opt.hasOwnProperty( 'data' ) && opt.data !== null ) {
				if ( typeof opt.data === 'object' ) {
					opt.data.system = false;
				}
				else if ( typeof opt.data === 'string' ) {
					opt.data += '&system=false';
				}
			}
			else {
				opt.data = {
					system: false
				};
			}

			if ( opt.hasOwnProperty( 'dataType' ) === true && opt.dataType === 'jsonp' ) {
				jsonp = true;
			}

			if ( opt.hasOwnProperty( 'success' ) === true ) {
				ocb = opt.success;

				ncb = function( aResponse, aCode, aXhr ) {
					var r;

					if ( jsonp === true ) {
						ocb( aResponse );
					}
					else if ( ( r = self.parse( aResponse ) ) !== false ) {
						if ( r.hasOwnProperty( 'status' ) && r.status === false ) {
							if ( r.hasOwnProperty( 'message' ) ) {
								self.error( {
									body: r.message
								} );
							}
							else {
								self.error( {
									body: 'An error has occurred. '+ parent.getData( 'support_message' )
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
							body: 'An error has occurred. ' + parent.getData( 'support_message' )
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
							body: 'An error has occurred. '+ parent.getData( 'support_message' )
						} );

						if ( opt.hasOwnProperty( 'error' ) === true ) {
							opt.error( );
						}
					}
				};
			}

			opt.success = ncb;

			this.abort( );

			this._xhr = jQuery.ajax( opt );

			jQuery.when( this._xhr ).then( function( ) {
				self._xhr = null;
			});
		},

		/**
		 * Method: abort
		 */

		abort: function( ) {
			if ( this.inProgress( ) === true ) {
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
		 * Method: inProgress
		 * @return {Bool}
		 */

		inProgress: function( ) {
			return ( this._xhr !== null ) ? true : false;
		},

		/**
		 * Method: error
		 * @param {Object} aMessage
		 */

		error: function( aError ) {
			var parent = this.getParent( );

			parent.error( aError );
		}
	});

	return Conduit;
});


define( [ 'system/js/class', 'system/js/jquery.min' ], function( ) {
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
		 * @param {Object} aData
		 */

		ajax: function( aData ) {
			var ncb, ocb,
				jsonp = false,
				self = this;

			if ( aData.hasOwnProperty( 'dataType' ) === true && aData.dataType === 'jsonp' ) {
				jsonp = true;
			}

			if ( aData.hasOwnProperty( 'success' ) === true ) {
				ocb = aData.success;

				ncb = function( aResponse, aCode, aXhr ) {
					var r;

					if ( jsonp === true ) {
						ocb( aResponse );
					}
					else if ( ( r = self.parse( aResponse ) ) !== false ) {
						ocb( r );
					}
					else {
						self.error( 'An error has occurred. Please refresh the page, if the problem persists please contact <a href="#">support</a>.' );

						if ( aData.hasOwnProperty( 'error' ) === true ) {
							aData.error( );
						}
					}
				};
			}
			else {
				ncb = function( aResponse, aCode, aXhr ) {
					if ( jsonp === false && self.parse( aResponse ) === false ) {
						self.error( 'An error has occurred. Please refresh the page, if the problem persists please contact <a href="#">support</a>.' );

						if ( aData.hasOwnProperty( 'error' ) === true ) {
							aData.error( );
						}
					}
				};
			}

			aData.success = ncb;

			this.abort( );

			this._xhr = jQuery.ajax( aData );

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
				r = jQuery.parseJSON( aResponse );
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
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			var parent = this.getParent( ),
				message = jQuery.trim( aMessage );

			if ( message != '' ) {
				parent.error( message );
			}
		}
	});

	return Conduit;
});

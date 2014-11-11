
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
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._xhr = null;
		},

		/**
		 * Method: ajax
		 * @param {Object} aData
		 */

		ajax: function( aData ) {
			var ncb, ocb,
				jsonp = false,
				self = this;

			if ( aData.hasOwnProperty( 'checkResponse' ) === false ) {
				aData.checkResponse = true;
			}

			if ( aData.hasOwnProperty( 'dataType' ) === true && aData.dataType === 'jsonp' ) {
				jsonp = true;
			}

			if ( aData.hasOwnProperty( 'form' ) === true && aData.form !== null ) {
				aData.url = aData.form.action;
				aData.type = aData.form.method;
				aData.data = $( aData.form ).serialize( );
			}

			if ( aData.hasOwnProperty( 'success' ) === true ) {
				ocb = aData.success;

				ncb = function( aResponse, aCode, aXhr ) {
					var r;

					if ( jsonp === true ) {
						ocb( aResponse );
					}
					else if ( aData.checkResponse === false || ( r = self.parse( aResponse ) ) !== false ) {
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
					if ( jsonp == false ) {
						if ( aData.checkResponse === false || self.parse( aResponse ) === false ) {
							self.error( 'An error has occurred. Please refresh the page, if the problem persists please contact <a href="#">support</a>.' );

							if ( aData.hasOwnProperty( 'error' ) === true ) {
								aData.error( );
							}
						}
					}
				};
			}

			aData.success = ncb;

			this.abort( );

			this._xhr = $.ajax( aData );

			$.when( this._xhr ).then( function( ) {
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
				r = $.parseJSON( aResponse );
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
			return ( this._xhr != null ) ? true : false;
		},

		/**
		 * Method: error
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			var message = jQuery.trim( aMessage );

			if ( message != '' ) {
				this._parent.error( message );
			}
		}
	});

	return Conduit;
});

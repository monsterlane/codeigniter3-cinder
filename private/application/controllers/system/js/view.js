
define( [ 'system/js/dot.min', 'system/js/class' ], function( aParser ) {
	'use strict';

	/*
	===============================================================================
	Class: View
	===============================================================================
	*/

	var View = Object.subClass({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._data = [ ];
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: create
		 * @param {Object} aView
		 */

		create: function( aView ) {
			var parent = this.getParent( );

			parent.verbose( 'view module: creating view' );

			if ( this._data.hasOwnProperty( aView.url ) === false ) {
				this._data[ aView.url ] = [ ];
			}

			this._data[ aView.url ][ aView.hash ] = aParser.template( aView.content );

			return this._data[ aView.url ][ aView.hash ];
		},

		/**
		 * Method: get
		 * @param {String} aUrl
		 * @param {String} aHash
		 */

		get: function( aUrl, aHash ) {
			if ( this._data[ aUrl ] && this._data[ aUrl ][ aHash ] ) {
				return this._data[ aUrl ][ aHash ];
			}

			return false;
		}
	});

	return View;
});


define( [ 'jclass', 'system/js/dot.min' ], function( Class, Parser ) {
	'use strict';

	/*
	===============================================================================
	Class: View
	===============================================================================
	*/

	var View = Class._extend({

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
		 * Method: get
		 * @param {String} aUrl
		 * @param {String} aHash
		 */

		get: function( aUrl, aHash ) {
			if ( this._data.hasOwnProperty( aUrl ) === true && this._data[ aUrl ].hasOwnProperty( aHash ) === true ) {
				return this._data[ aUrl ][ aHash ];
			}

			return false;
		},

		/**
		 * Method: create
		 * @param {Object} aView
		 */

		create: function( aView ) {
			if ( this._data.hasOwnProperty( aView.url ) === false ) {
				this._data[ aView.url ] = [ ];
			}

			this._data[ aView.url ][ aView.hash ] = Parser.template( aView.content );

			return this._data[ aView.url ][ aView.hash ];
		}
	});

	return View;
});

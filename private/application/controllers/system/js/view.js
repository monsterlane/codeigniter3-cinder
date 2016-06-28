
define( [ 'jclass', 'dust' ], function( Class, Dust ) {
	'use strict';

	//require( [ 'system/js/dust.helpers.min', 'system/js/dust.extra' ], function( ) { } );

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

			this._data[ aView.url ][ aView.hash ] = this.compile( aView );

			return this._data[ aView.url ][ aView.hash ];
		},

		/**
		 * Method: compile
		 * @param {Object} aView
		 */

		compile: function( aView ) {
			Dust.loadSource( Dust.compile( aView.content, aView.url + '|' + aView.hash ) );

			return this;
		},

		/**
		 * Method: render
		 * @param {String} aKey
		 * @param {Object} aData
		 * @param {Function} aCallback
		 */

		render: function( aKey, aData, aCallback ) {
			var callback = aCallback || function( aOutput ) { };

			Dust.render( aKey, aData, function( aError, aOutput ) {
				callback( aOutput );
			} );
		},

		/**
		 * Method: empty
		 */

		empty: function( ) {
			this._data = [ ];

			return this;
		}
	});

	return View;
});

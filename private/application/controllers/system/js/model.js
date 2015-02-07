
define( [ 'jquery', 'jclass' ], function( $, Class ) {
	'use strict';

	/*
	===============================================================================
	Class: Model
	===============================================================================
	*/

	var Model = Class._extend({

		/**
		 * Method: init
		 * @parma {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._data = { };
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: get
		 * @param {String} aKey
		 */

		get: function( aKey ) {
			var key = aKey || false,
				val = this._data,
				keys, i, len;

			if ( key !== false ) {
				keys = key.split( '.' );

				for ( i = 0, len = keys.length; i < len; i++ ) {
					if ( val.hasOwnProperty( keys[ i ] ) === true ) {
						val = val[ keys[ i ] ];
					}
					else {
						val = false;
						break;
					}
				}
			}

			return val;
		},

		/**
		 * Method: set
		 * @param {String} aKey
		 * @param {Mixed} aValue
		 */

		set: function( aKey, aValue ) {
			var keys = aKey.split( '.' ),
				arr = this._data,
				i, len;

			for ( i = 0, len = keys.length; i < len; i++ ) {
				if ( arr.hasOwnProperty( keys[ i ] ) === true ) {
					if ( i === len - 1 ) {
						if ( arr[ keys[ i ] ].constructor === Array && aValue.constructor === Array ) {
							arr[ keys[ i ] ] = $.extend( true, arr[ keys[ i ] ], aValue );
						}
						else {
							arr[ keys[ i ] ] = aValue;
						}
					}
					else {
						arr = arr[ keys[ i ] ];
					}
				}
				else {
					arr[ keys[ i ] ] = aValue;
					break;
				}
			}
		}
	});

	return Model;
});

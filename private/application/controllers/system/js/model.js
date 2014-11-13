
define( [ 'system/js/class' ], function( ) {
	'use strict';

	/*
	===============================================================================
	Class: Model
	===============================================================================
	*/

	var Model = Object.subClass({

		/**
		 * Method: init
		 */

		init: function( ) {
			this._data = { };

			return this;
		},

		/**
		 * Method: getData
		 */

		getData: function( ) {
			return this._data;
		},

		/**
		 * Method: setData
		 * @param {Mixed}
		 */

		setData: function( ) {
			var arg = arguments || [ ],
				i, len;

			if ( arg.length > 0 && arg[ 0 ] != null ) {
				if ( arg.legnth == 2 ) {
					this._data[ arg[ 0 ] ] = arg[ 1 ];
				}
				else if ( arg.length == 1 && typeof arg[ 0 ] === 'object' ) {
					for ( i in arg[ 0 ] ) {
						this._data[ i ] = arg[ 0 ][ i ];
					}
				}
			}

			return this;
		}
	});

	return Model;
});

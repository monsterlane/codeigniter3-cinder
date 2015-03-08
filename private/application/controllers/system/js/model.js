
define( [ 'jclass', 'jquery' ], function( Class, $ ) {
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
		 * Method: merge
		 * @param {Mixed} aObject
		 * @param {Mixed} bObject
		 */

		merge: function( aObject, bObject ) {
			if ( $.isPlainObject( aObject ) === true && $.isPlainObject( bObject ) === true ) {
				aObject = $.extend( true, aObject, bObject );
			}
			else if ( $.isArray( aObject ) === true && $.isArray( bObject ) === true ) {
				aObject = $.merge( aObject, bObject );
			}
			else {
				aObject = bObject;
			}

			return aObject;
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
						arr[ keys[ i ] ] = this.merge( arr[ keys[ i ] ], aValue );
					}
					else {
						arr = arr[ keys[ i ] ];
					}
				}
				else if ( i === len - 1 ) {
					arr[ keys[ i ] ] = this.merge( arr[ keys[ i ] ], aValue );
				}
				else {
					arr[ keys[ i ] ] = [ ];

					arr = arr[ keys[ i ] ];
				}
			}
		},

		/**
		 * Method: remove
		 * @param {Object} aKey
		 */

		remove: function( aKey ) {
			var key = aKey || false,
				val = this._data,
				keys, i, len;

			if ( key !== false ) {
				keys = key.split( '.' );

				for ( i = 0, len = keys.length; i < len; i++ ) {
					if ( val.hasOwnProperty( keys[ i ] ) === true ) {
						if ( i === len - 1 ) {
							delete val[ keys[ i ] ];
						}
						else {
							val = val[ keys[ i ] ];
						}
					}
					else {
						val = false;
						break;
					}
				}
			}
		}
	});

	return Model;
});

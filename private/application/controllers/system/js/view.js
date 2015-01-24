
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
		 * @param {String} aName
		 * @param {String} aString
		 */

		create: function( aName, aString ) {
			this._data[ aName ] = aParser.template( aString );

			return this._data[ aName ];
		},

		/**
		 * Method: get
		 * @param {Object} aName
		 */

		get: function( aName ) {
			if ( this._data[ aName ] ) {
				return this._data[ aName ];
			}

			return false;
		}
	});

	return View;
});

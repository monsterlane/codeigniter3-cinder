
define( [ 'system/js/dot.min', 'system/js/class' ], function( aEngine ) {
	'use strict';

	/*
	===============================================================================
	Class: Parser
	===============================================================================
	*/

	var Parser = Object.subClass({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._view = [ ];
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
			this._view[ aName ] = aEngine.template( aString );

			return this._view[ aName ];
		},

		/**
		 * Method: get
		 * @param {Object} aName
		 */

		get: function( aName ) {
			if ( this._view[ aName ] ) {
				return this._view[ aName ];
			}

			return false;
		}
	});

	return Parser;
});


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
		 */

		init: function( ) {
			this._view = [ ];
		},

		/**
		 * Method: createView
		 * @param {String} aName
		 * @param {String} aString
		 */

		createView: function( aName, aString ) {
			this._view[ aName ] = aEngine.template( aString );

			return this._view[ aName ];
		},

		/**
		 * Method: getView
		 * @param {Object} aName
		 */

		getView: function( aName ) {
			if ( this._view[ aName ] ) {
				return this._view[ aName ];
			}

			return false;
		}
	});

	return Parser;
});


define( [ 'system/js/module' ], function( aModule ) {
	'use strict';

	/*
	===============================================================================
	Class: Main
	===============================================================================
	*/

	var Module = aModule.subClass({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			this._super( aOptions );

			this.verbose( 'module loaded: main' );
		},

		/**
		 * Method: test
		 */

		test: function( ) {
			// TODO remove
		}
	});

	return Module;
});

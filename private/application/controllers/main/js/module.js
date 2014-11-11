
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
		 */

		init: function( ) {
			this._super( );

			this.verbose( 'module loaded: main' );

			return this;
		},


	});

	return Module;
});

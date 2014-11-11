
define( [ 'system/js/module', 'system/js/jquery.min' ], function( aModule ) {
	'use strict';

	/*
	===============================================================================
	Class: About
	===============================================================================
	*/

	var Module = aModule.subClass({
		/**
		 * Method: init
		 */

		init: function( ) {
			this._super( );

			this.verbose( 'module loaded: about' );

			return this;
		},


	});

	return Module;
});

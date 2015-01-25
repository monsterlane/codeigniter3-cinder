
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

			var parent = this.getParent( );

			parent.verbose( 'module loaded: main' );
		}
	});

	return Module;
});

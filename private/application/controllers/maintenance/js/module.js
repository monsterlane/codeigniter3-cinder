
define( [ 'system/js/module' ], function( aModule ) {
	'use strict';

	/*
	===============================================================================
	Class: Maintenance
	===============================================================================
	*/

	var Module = aModule.subClass({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			this._super( aOptions );

			this.verbose( 'maintenance' );
		}
	});

	return Module;
});


define( [ 'jclass', 'jquery', 'system/js/module', 'plugin/js/jquery.hotkeys.min' ], function( Class, $, Module, Hotkeys ) {
	'use strict';

	/*
	===============================================================================
	Class: Plugin
	===============================================================================
	*/

	var Plugin = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: plugin' );
		},

		/**
		 * Method: bindMainEventListeners
		 */

		bindMainEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				preview = container.find( 'div.colourPreview' );

			this.verbose( 'module: bindMainEventListeners' );

			$( document ).on( 'keydown', null, 'shift+w', function( ) {
				preview.toggleClass( 'on' );
			} );
		}
	});

	return Plugin;
});


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

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				preview = container.find( 'div.colourPreview' );

			this.verbose( 'module: bindEventListeners' );

			$( document ).on( 'keydown', null, 'shift+w', function( ) {
				preview.toggleClass( 'on' );
			} );
		}
	});

	return Plugin;
});

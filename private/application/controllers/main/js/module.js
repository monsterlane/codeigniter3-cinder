
define( [ 'jclass', 'jquery', 'system/js/module' ], function( Class, $, Module ) {
	'use strict';

	/*
	===============================================================================
	Class: Main
	===============================================================================
	*/

	var Main = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: main' );

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				self = this;

			this.verbose( 'module: bindEventListeners' );

			container.find( 'button.purpose-clearcache' ).on( 'click', function( aEvent ) {
				aEvent.preventDefault( );
				self.handleClearCacheButtonClick( this );
			});
		},

		/**
		 * Method: handleClearCacheButtonClick
		 * @param {DOMelement} aButton
		 */

		handleClearCacheButtonClick: function( aButton ) {
			var parent = this.getParent( );

			var x = y / 2;

			parent.clearCache( );
		}
	});

	return Main;
});

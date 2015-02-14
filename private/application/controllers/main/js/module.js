
define( [ 'jquery', 'jclass', 'system/js/module' ], function( $, Class, BaseModule ) {
	'use strict';

	/*
	===============================================================================
	Class: Main
	===============================================================================
	*/

	var Module = BaseModule._extend({

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

			parent.clearCache( );
		}
	});

	return Module;
});

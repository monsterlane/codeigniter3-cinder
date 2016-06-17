
define( [ 'jclass', 'jquery', 'system/js/module' ], function( Class, $, Module ) {
	'use strict';

	/*
	===============================================================================
	Class: Debug
	===============================================================================
	*/

	var Debug = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: debug' );
		},

		/**
		 * Method: bindMainEventListeners
		 */

		bindMainEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				self = this;

			this.verbose( 'module: bindMainEventListeners' );

			container.find( 'a.purpose-clearcache' ).on( 'click', function( aEvent ) {
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

			parent.message( 'View cache has been cleared.' );
		}
	});

	return Debug;
});

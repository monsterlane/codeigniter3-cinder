
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
		 * @param {DOMelement} aContainer
		 */

		bindMainEventListeners: function bindMainEventListeners( aContainer ) {
			var container = $( aContainer ),
				self = this;

			bindMainEventListeners._super.call( this, aContainer );

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

			parent.message( 'Local cache has been cleared.' );
		}
	});

	return Debug;
});

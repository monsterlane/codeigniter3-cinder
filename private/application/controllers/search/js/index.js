
define( [ 'jclass', 'jquery', 'system/js/module' ], function( Class, $, Module ) {
	'use strict';

	/*
	===============================================================================
	Class: Search
	===============================================================================
	*/

	var Search = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: search' );
		},

		/**
		 * Method: bindSearchResults
		 */

		bindSearchResults: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				self = this;

			this.verbose( 'module: bindSearchResults' );

			container.find( 'a.purpose-delete' ).on( 'click', function( aEvent ) {
				aEvent.preventDefault( );
				self.handleDeleteButtonClick( this );
			});
		},

		/**
		 * Method: handleDeleteButtonClick
		 * @param {DOMelement} aButton
		 */

		handleDeleteButtonClick: function( aButton ) {
			var container = $( aButton ).closest( 'tr' );

			this.getConduit( 'delete' ).ajax({
				url: aButton.href,
				success: function( response ) {
					container.remove( );
				}
			});
		}
	});

	return Search;
});

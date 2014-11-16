
define( [ 'system/js/module' ], function( aModule ) {
	'use strict';

	/*
	===============================================================================
	Class: Search
	===============================================================================
	*/

	var Module = aModule.subClass({

		/**
		 * Method: init
		 */

		init: function( ) {
			this._super( );

			this.verbose( 'module loaded: search' );

			return this;
		},

		/**
		 * Method: bindSearchResults
		 */

		bindSearchResults: function( ) {
			var data = this.getData( ),
				container = jQuery( data.container );

			this.verbose( 'module binding: search' );

			container.find( 'a.purpose-delete' ).on( 'click', function( aEvent ) {
				aEvent.preventDefault( );

				$( this ).closest( 'tr' ).remove( );
			});
		}
	});

	return Module;
});

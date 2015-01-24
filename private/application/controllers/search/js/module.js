
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
		},

		/**
		 * Method: bindSearchResults
		 */

		bindSearchResults: function( ) {
			var data = this.getData( ),
				container = jQuery( data.container ),
				self = this;

			this.verbose( 'module binding: search' );

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
			var container = jQuery( aButton ).closest( 'tr' ),
				id = container[ 0 ].getAttribute( 'data-id' ),
				self = this;

			this.getConduit( 'delete' ).ajax({
				url: '/search/user/delete/' + id,
				success: function( response ) {
					container.remove( );
				}
			});
		}
	});

	return Module;
});

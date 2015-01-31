
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
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			this._super( aOptions );

			this.verbose( 'module: search' );
		},

		/**
		 * Method: bindSearchResults
		 */

		bindSearchResults: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( ),
				container = jQuery( data.container ),
				self = this;

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
			var parent = this.getParent( ),
				container = jQuery( aButton ).closest( 'tr' ),
				id = container[ 0 ].getAttribute( 'data-id' );

			parent.getConduit( 'delete' ).ajax({
				url: this._url + '/user/delete/' + id,
				success: function( response ) {
					container.remove( );
				}
			});
		}
	});

	return Module;
});

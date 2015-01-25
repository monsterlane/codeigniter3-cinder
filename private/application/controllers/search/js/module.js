
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

			var parent = this.getParent( );

			parent.verbose( 'module loaded: search' );
		},

		/**
		 * Method: bindSearchResults
		 */

		bindSearchResults: function( ) {
			var parent = this.getParent( ),
				data = this.getData( ),
				container = jQuery( data.container ),
				self = this;

			parent.verbose( 'module binding: search' );

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
			var data = this.getData( ),
				container = jQuery( aButton ).closest( 'tr' ),
				id = container[ 0 ].getAttribute( 'data-id' ),
				self = this;

			this.getConduit( 'delete' ).ajax({
				url: this._url + '/user/delete/' + id,
				success: function( response ) {
					container.remove( );
				}
			});
		}
	});

	return Module;
});

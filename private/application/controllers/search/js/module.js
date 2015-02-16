
define( [ 'jclass', 'jquery', 'system/js/module' ], function( Class, $, BaseModule ) {
	'use strict';

	/*
	===============================================================================
	Class: Search
	===============================================================================
	*/

	var Module = BaseModule._extend({

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
			var parent = this.getParent( ),
				container = $( aButton ).closest( 'tr' ),
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


define( [ 'jclass', 'jquery', 'system/js/module' ], function( Class, $, Module ) {
	'use strict';

	/*
	 ===============================================================================
	 Class: Migrations
	 ===============================================================================
	 */

	var Migrations = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: migrations' );
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

			container.find( 'a.purpose-migration' ).on( 'click', function( aEvent ) {
				aEvent.preventDefault( );
				self.handleMigrationButtonClick( this );
			});
		},

		/**
		 * Method: handleMigrationButtonClick
		 * @param {DOMelement} aButton
		 */

		handleMigrationButtonClick: function( aButton ) {
			var parent = this.getParent( ),
				button = $( aButton ),
				container = button.closest( 'div.panel-body' ),
				conduit = this.getConduit( 'migrate' );

			if ( conduit.running( ) === false ) {
				conduit.ajax({
					url: aButton.href,
					beforeSend: function( ) {
						parent.clearMessage( );
					},
					success: function( response ) {
						var data;

						if ( response.status === true ) {
							data = parent.getData( 'module.data.view.data' );

							if ( parseInt( data.branch_id, 10 ) === parseInt( response.current_id, 10 ) ) {
								container.find( '> div.current' ).addClass( 'hidden' );
							}
							else {
								container.find( '> div.current' ).removeClass( 'hidden' );
							}

							container.find( '> ol > li.current' ).removeClass( 'current' );
							container.find( '> ol > li[data-id="' + response.current_id + '"]' ).addClass( 'current' );

							parent.setData( 'module.data.view.data.current_id', response.current_id );
							parent.message( response.message, 'success' );
						}
						else {
							parent.message( response.message, 'danger' );
						}
					}
				});
			}
		}
	});

	return Migrations;
});

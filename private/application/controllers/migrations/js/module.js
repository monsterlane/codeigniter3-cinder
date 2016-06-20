
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
		 */

		bindMainEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				self = this;

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
						parent.clear( 'system.options.flashdata_container' );
					},
					success: function( response ) {
						if ( response.status === true ) {
							// TODO remove swap to current p if user is now on current branch

							container.find( '> ol > li.current' ).removeClass( 'current' );
							container.find( '> ol > li[data-id="' + response.current_id + '"' ).addClass( 'current' );

							parent.message( response.message, 'system.options.flashdata_container', 'success' );
						}
						else {
							parent.message( response.message, 'system.options.flashdata_container', 'danger' );
						}
					}
				});
			}
		}
	});

	return Migrations;
});


define( [ 'jclass', 'jquery', 'system/js/module', 'upload' ], function( Class, $, Module, Upload ) {
	'use strict';

	/*
	===============================================================================
	Class: Dragdrop
	===============================================================================
	*/

	var Dragdrop = Module._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function init( aOptions ) {
			init._super.call( this, aOptions );

			this.verbose( 'module: dragdrop' );

			this.bindEventListeners( );
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module.data' ),
				container = $( data.view.container ),
				upload = new Upload( this );

			this.verbose( 'module: bindEventListeners' );

			upload.bind({
				container: container.find( 'div.purpose-dragdrop' )
			});
		}
	});

	return Dragdrop;
});

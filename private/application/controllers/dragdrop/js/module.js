
define( [ 'jclass', 'jquery', 'system/js/module', 'system/js/upload' ], function( Class, $, Module, Upload ) {
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
		},

		/**
		 * Method: bindMainEventListeners
		 * @param {DOMelement} aContainer
		 */

		bindMainEventListeners: function( aContainer ) {
			var container = $( aContainer ),
				upload = new Upload( this );

			this.verbose( 'module: bindMainEventListeners' );

			upload.bind({
				container: container.find( 'div.purpose-dragdrop' )
			});
		}
	});

	return Dragdrop;
});

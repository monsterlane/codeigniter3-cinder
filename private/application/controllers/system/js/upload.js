
define( [ 'jclass', 'jquery' ], function( Class, $ ) {
	'use strict';

	$.event.fixHooks.drop = {
		props: [ 'dataTransfer' ]
	};

	/*
	===============================================================================
	Class: Upload
	===============================================================================
	*/

	var Upload = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aParent
		 * @param {Object} aOptions
		 */

		init: function( aParent, aOptions ) {
			this._parent = aParent;
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		}
	});

	return Upload;
});

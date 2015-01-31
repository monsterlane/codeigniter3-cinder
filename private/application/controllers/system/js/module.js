
define( [ 'class', 'jquery' ], function( ) {
	'use strict';

	/*
	===============================================================================
	Class: Module
	===============================================================================
	*/

	var Module = Object.subClass({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			var options = aOptions || { };

			this._parent = aOptions.parent;
			this._url = '/';

			if ( Object.keys( options ).length > 0 ) {
				this._parent.setData( options );

				if ( options.hasOwnProperty( 'url' ) ) {
					this._url = options.url;
				}
			}
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			this.getParent( ).verbose( aMessage );

			return this;
		},

		/**
		 * Method: error
		 * @param {String} aMessage
		 */

		error: function( aMessage ) {
			var msg = aMessage || 'An error has occured.';

			alert( msg );

			return this;
		},

		/**
		 * Method: dialog
		 * @param {Object} aOptions
		 */

		dialog: function( aOptions ) {
			// TODO
		}
	});

	return Module;
});

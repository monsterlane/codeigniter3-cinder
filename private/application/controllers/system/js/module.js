
define( [ 'files/cache/system/js/class' ], function( ) {
	'use strict';

	/**
	 * Class: Module
	 */

	var Module = Object.subClass({
		/**
		 * Method: init
		 */

		init: function( aData ) {
			var data = aData || { };

			this.bindPendingData( data );
		},

		/**
		 * Method: bindPendingData
		 * @param {Array} aData
		 */

		bindPendingData: function( aData ) {
			var el, i, len;

			this.data = aData;

			for ( i = 0, len = this.data.length; i < len; i++ ) {
				el = document.querySelector( this.data[ i ].container );

				el.innerHTML = this.data[ i ].html;
			}
		}
	});

	return Module;
});

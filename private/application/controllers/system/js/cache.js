
define( [ 'system/js/class' ], function( ) {
	'use strict';

	/*
	===============================================================================
	Class: Cache
	===============================================================================
	*/

	var Cache = Object.subClass({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._storage = localStorage;

			this.empty( );
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: get
		 * @param {String} aKey
		 */

		get: function( aKey ) {
			return this._storage.getItem( aKey ) || false;
		},

		/**
		 * Method: set
		 * @param {String} aKey
		 * @param {String} aContent
		 */

		set: function( aKey, aContent ) {
			this._storage.setItem( aKey, aContent );

			return this;
		},

		/**
		 * Method: remove
		 */

		remove: function( aKey ) {
			this._storage.removeItem( aKey );

			return this;
		},

		/**
		 * Method: empty
		 */

		empty: function( ) {
			var i;

			for ( i in this._storage ) {
				this._storage.removeItem( i );
			}

			this.free( );

			return this;
		},

		/**
		 * Method: free
		 */

		free: function( ) {
			var parent = this.getParent( ),
				total = 5,
				used = 0,
				free, i;

			for ( i in this._storage ) {
				used += ( this._storage[ i ].length * 2 ) / 1024 / 1024;
			}

			free = total - used;

			parent.verbose( 'cache module: ' + used.toFixed( 2 ) + 'MB used' );
			parent.verbose( 'cache module: ' + free.toFixed( 2 ) + 'MB free' );

			return this;
		}
	});

	return Cache;
});


define( [ 'class' ], function( ) {
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
				if ( this._storage.hasOwnProperty( i ) ) {
					this._storage.removeItem( i );
				}
			}

			return this;
		},

		/**
		 * Method: free
		 */

		free: function( ) {
			var parent = this.getParent( ),
				str = '', total = 5120,
				key, used, free;

			for ( key in this._storage ) {
				if ( this._storage.hasOwnProperty( key ) ) {
					str += this._storage[ key ];
				}
			}

			used = str ? 3 + ( ( str.length * 16 ) / ( 8 * 1024 ) ) : 0;
			free = total - used;

			if ( used > 1024 ) {
				used = used / 1024;

				parent.verbose( 'cache: ' + used.toFixed( 2 ) + 'MB used' );
			}
			else {
				parent.verbose( 'cache: ' + used.toFixed( 2 ) + 'KB used' );
			}

			if ( free > 1024 ) {
				free = free / 1024;

				parent.verbose( 'cache: ' + free.toFixed( 2 ) + 'MB free' );
			}
			else {
				parent.verbose( 'cache: ' + free.toFixed( 2 ) + 'KB free' );
			}

			return this;
		}
	});

	return Cache;
});


define( [ 'jclass' ], function( Class ) {
	'use strict';

	/*
	===============================================================================
	Class: Cache
	===============================================================================
	*/

	var Cache = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;
			this._storage = localStorage;
			this._max_size = 5120;
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: getBytes
		 * @param {String} aData
		 */

		getBytes: function( aData ) {
			return aData ? 3 + ( ( aData.length * 16 ) / ( 8 * 1024 ) ) : 0;
		},

		/**
		 * Method: get
		 * @param {String} aKey
		 */

		get: function( aKey ) {
			var json = this._storage.getItem( aKey ),
				data = false;

			if ( json != null ) {
				data = JSON.parse( json );
			}

			return data;
		},

		/**
		 * Method: getAll
		 */

		getAll: function( ) {
			var data = [ ],
				key, val;

			for ( key in this._storage ) {
				if ( this._storage.hasOwnProperty( key ) == true ) {
					val = this.get( key );
					val._key = key;

					data.push( val );
				}
			}

			data.sort( function( a, b ) {
				return a[ '_timestamp' ] < b[ '_timestamp' ];
			});

			return data;
		},

		/**
		 * Method: set
		 * @param {String} aKey
		 * @param {String} aData
		 */

		set: function( aKey, aData ) {
			var parent = this.getParent( ),
				key = aKey || null,
				data = aData || { },
				used = this.used( ),
				json, all, del, b;

			if ( key != null ) {
				data._timestamp = new Date( ).getTime( );

				json = JSON.stringify( data );

				used += this.getBytes( json );

				if ( used > this._max_size ) {
					all = this.getAll( );

					while ( used > this._max_size && all.length > 0 ) {
						del = all.shift( );

						this.remove( del._key );
						delete del._key;

						del = JSON.stringify( del );
						b = this.getBytes( del );

						used -= b;

						parent.verbose( 'cache: ' + ( b / 1024 ).toFixed( 2 ) + 'KB freed' );
					}
				}

				this._storage.setItem( aKey, json );
			}

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
		 * Method: available
		 */

		available: function( ) {
			var parent = this.getParent( ),
				used = this.used( ),
				free = ( this._max_size - used ),
				us = 'KB', fs = 'KB';

			if ( used > 1024 ) {
				used = used / 1024;

				us = 'MB';
			}

			if ( free > 1024 ) {
				free = free / 1024;

				fs = 'MB';
			}

			parent.verbose( 'cache: ' + used.toFixed( 2 ) + us + ' / ' + free.toFixed( 2 ) + fs + ' used' );

			return this;
		},

		/**
		 * Method: used
		 */

		used: function( ) {
			var str = '',
				key;

			for ( key in this._storage ) {
				if ( this._storage.hasOwnProperty( key ) ) {
					str += this._storage[ key ];
				}
			}

			return this.getBytes( str );
		},

		/**
		 * Method: empty
		 */

		empty: function( ) {
			var i;

			if ( this._storage.hasOwnProperty( 'clear' ) == true ) {
				this._storage.clear( );
			}
			else {
				for ( i in this._storage ) {
					if ( this._storage.hasOwnProperty( i ) ) {
						this._storage.removeItem( i );
					}
				}
			}

			return this;
		}
	});

	return Cache;
});

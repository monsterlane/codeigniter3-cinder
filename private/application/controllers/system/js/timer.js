
define( [ 'jclass', 'jquery' ], function( Class, $ ) {
	'use strict';

	/*
	===============================================================================
	Class: Timer
	===============================================================================
	*/

    window.requestAnimationFrame = ( function( ) {
		return (
			window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( aCallback, aElement ) {
				window.setTimeout( aCallback, 1000 / 60 );
			}
		);
	}( ));

	window.performance = window.performance || { };

	window.performance.now = ( function( ) {
		return (
			window.performance.now ||
			window.performance.webkitNow ||
			window.performance.mozNow ||
			window.performance.oNow ||
			window.performance.msNow ||
			function( ) {
                return new Date( ).getTime( );
            }
		);
    }( ));

	var Timer = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			var options = aOptions || { };

			this._options = $.extend( true, {
				parent: null,
				interval: 200,
				limit: Infinity,
				start: function( ) { },
				stop: function( ) { },
				think: function( ) { }
			}, options );

			this._parent = this._options.parent;
			this._interval = this._options.interval;

			this._running = false;
			this._limit = this._options.limit;
			this._ticks = 0;
			this._start = null;
			this._end = null;

			this._callbacks = {
				start: this._options.start,
				stop: this._options.stop,
				think: this._options.think
			};

			this.start( );
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: running
		 */

		running: function( ) {
			return this._running;
		},

		/**
		 * Method: runtime
		 */

		runtime: function( ) {
			return parseInt( this._stop - this._start, 10 );
		},

		/**
		 * Method: start
		 */

		start: function( ) {
			if ( this._running === false ) {
				this._start = window.performance.now( );
				this._stop = window.performance.now( );
				this._running = true;

				this._callbacks.start( );

				this.think( );
			}
		},

		/**
		 * Method: stop
		 */

		stop: function( ) {
			if ( this._running === true ) {
				this._stop = window.performance.now( );
				this._running = false;
				this._callbacks.stop( );
			}
		},

		/**
		 * Method: think
		 */

		think: function( ) {
			var tick = this._callbacks.think( ),
				self = this;

			this._ticks += 1;

			if ( tick === false || this._ticks > this._limit ) {
				this.stop( );
			}
			else if ( tick === true ) {
				window.requestAnimationFrame( function( ) {
					self.think( );
				});
			}
		}
	});

	return Timer;
});

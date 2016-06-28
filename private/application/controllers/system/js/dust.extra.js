(function(root, factory) {
	if ( typeof define === 'function' && define.amd && define.amd.dust === true ) {
		define( [ 'dust.core' ], factory );
	}
	else if ( typeof exports === 'object' ) {
		module.exports = factory( require( 'dustjs-linkedin' ) );
	}
	else {
		factory( root.dust );
	}
}( this, function( dust ) {

	function log( helper, msg, level ) {
		level = level || "INFO";
		helper = helper ? '{@' + helper + '}: ' : '';

		dust.log( helper + msg, level );
	}

	var helpers = {

		/**
		 * copy of copy of https://github.com/rragan/dust-motes/blob/master/src/helpers/control/iterate/iterate.js
		 * iterate helper, loops over given object.
		 * Inspired: https://github.com/akdubya/dustjs/issues/9
		 *
		 * Example:
		 * {@iterate key=obj}{$key}-{$value} of type {$type} with parent key: {$parentKey}{~n}{/iterate}
		 *
		 * @param key - object of the iteration - Mandatory parameter
		 * @param sort - Optional. If omitted, no sort is done. Values allowed:
		 * sort="asc" - sort ascending (per JavaScript array sort rules)
		 * sort="desc" - sort descending
		 * sort="fname" - Look for fname object in global context,
		 * if found, treat it as a JavaScript array sort compare function.
		 * if not found, result is undefined (actually sorts ascending
		 * but you should not depend on it)
		 */

		"iterate": function( chunk, context, bodies, params ) {
			var body = bodies.block,
				sort, arr, i, k, obj,
				compareFn;

			params = params || { };

			function desc( a, b ) {
				if ( a < b ) {
					return 1;
				}
				else if ( a > b ) {
					return -1;
				}

				return 0;
			}

			function processBody( key, value ) {
				var parentKey = context.get( '$key' );

				return body( chunk, context.push({
					$key: key,
					$parentKey: parentKey,
					$value: value,
					$type: typeof value
				}));
			}

			if ( params.key ) {
				obj = dust.helpers.tap( params.key, chunk, context );

				if ( body ) {
					if ( !!params.sort ) {
						sort = dust.helpers.tap( params.sort, chunk, context );
						arr = [ ];

						for ( k in obj ) {
							if ( obj.hasOwnProperty( k ) ) {
								arr.push( k );
							}
						}

						compareFn = context.global[ sort ];

						if ( !compareFn && sort === 'desc' ) {
							compareFn = desc;
						}

						if ( compareFn ) {
							arr.sort(compareFn);
						}
						else {
							arr.sort( );
						}

						for ( i = 0; i < arr.length; i++ ) {
							chunk = processBody( arr[ i ], obj[ arr[ i ] ] );
						}
					}
					else {
						for ( k in obj ) {
							if ( obj.hasOwnProperty( k ) ) {
								chunk = processBody( k, obj[ k ] );
							}
						}
					}
				}
				else {
					log( "iterate", "Missing body block in the iter helper.", "WARN");
				}
			}
			else {
				log( "iterate", "Missing parameter 'key' in the iter helper.", "WARN");
			}

			return chunk;
		}

	};

	for ( var key in helpers ) {
		dust.helpers[ key ] = helpers[ key ];
	}

	return dust;
}));

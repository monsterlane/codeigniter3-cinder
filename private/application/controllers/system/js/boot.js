
/**
 * config
 */

require.config({
	urlArgs: Date.now( )
});

/**
 * boot
 */

require( [ '/files/cache/system/js/module', 'class' ], function( aModule ) {
	'use strict';

	var module = new aModule( );
});

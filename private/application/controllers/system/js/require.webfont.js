
define( [ 'system/js/webfont.min' ], function( Webfont ) {
	'use strict';

	/*
	===============================================================================
	Plugin: Font
	Standalone version of webfont plugin by Miller Medeiros with a few small tweaks
	https://github.com/millermedeiros/requirejs-plugins
	===============================================================================
	*/

	function infer( aValue ) {
		var regex = new RegExp( '^\\[([^\\]]+)\\]$' ),
			val = aValue || '';

		if ( regex.test( val ) ) {
			val = val.replace( regex, '$1' ).split( ',' );
		}
		else if ( val === 'null' ) {
			val = null;
		}
		else if ( val === 'true' ) {
			val = true;
		}
		else if ( val === 'false' ) {
			val = false;
		}
		else if ( val === '' || val === '\'\'' || val === '""' ) {
			val = '';
		}
		else if ( isNaN( val ) === false ) {
			val = +val;
		}

		return val;
	}

	function properties( aString ) {
		var regex = new RegExp( '([\\w-]+)\\s*:\\s*(?:(\\[[^\\]]+\\])|([^,]+)),?', 'g' ),
			data = { },
			match;

		while ( ( match = regex.exec( aString ) ) !== null ) {
			data[ match[ 1 ] ] = infer( match[ 2 ] || match[ 3 ] );
		}

		return data;
	}

	function parse( aName ) {
		var regex = new RegExp( '^([^,]+),([^\\|]+)\\|?' ),
			vendors = aName.split( '|' ),
			i = vendors.length,
			data = { },
			match;

		while ( i-- ) {
			match = regex.exec( vendors[ i ] );

			data[ match[ 1 ] ] = properties( match[ 2 ] );
		}

		return data;
	}

	return {
		load: function( aName, aRequire, aLoad, aConfig ) {
			var data;

			if ( aConfig.isBuild === true ) {
				aLoad( null );
			}
			else {
				data = parse( aName );
				data.active = aLoad;

				data.inactive = function( ) {
					aLoad( false );
				};

				Webfont.load( data );
			}
		}
	};
});


define( [ 'jquery' ], function( $ ) {
	'use strict';

	/*
	===============================================================================
	Helpers: jQuery
	===============================================================================
	*/

	$.fn.serializeObject = function( ) {
		var o = { },
			a = this.serializeArray( );

		$.each( a, function( ) {
			if ( o[ this.name ] !== undefined ) {
				if ( !o[ this.name ].push ) {
					o[ this.name ] = [ o[ this.name ] ];
				}

				o[ this.name ].push( this.value || '' );
			}
			else {
				o[ this.name ] = this.value || '';
			}
		});

		return o;
	};

	$.fn.getStyle = function( aProperty ) {
		var styles = this.attr( 'style' ),
			value;

		if ( styles !== undefined ) {
			styles.split( ';' ).forEach( function( e ) {
				var style = e.split( ':' );

				if ( $.trim( style[ 0 ] ) === aProperty ) {
					value = style[ 1 ];
				}
			});
		}

		return value;
	};

	$.fn.removeStyle = function( aStyle ) {
		var search = new RegExp( aStyle + '[^;]+;?', 'g' );

		return this.each( function( ) {
			$( this ).attr( 'style', function( i, style ) {
				return ( style !== undefined ) ? style.replace( search, '' ) : '';
			});
		});
	};

	$.fn.enable = function( ) {
		var label;

		if ( this.is( 'button' ) === true ) {
			if ( this.is( '[data-label]' ) === true ) {
				label = this.html( );

				this.html( this.attr( 'data-label' ) );
				this.attr( 'data-label', label );
			}
		}

		this.prop( 'disabled', false );
		this.removeClass( 'disabled' );
	};

	$.fn.disable = function( aLabel ) {
		var label = aLabel || 'Saving';

		if ( this.is( 'button' ) === true ) {
			if ( this.is( '[data-label]' ) === true ) {
				label = this.html( );

				this.html( this.attr( 'data-label' ) );
				this.attr( 'data-label', label );
			}
			else {
				this.attr( 'data-label', this.html( ) );
				this.html( label );
			}
		}

		this.prop( 'disabled', true );
		this.addClass( 'disabled' );
	};

	$.fn.disableSelect = function( ) {
		this.attr( 'unselectable', 'on' );
		this.on( 'selectstart.cinder-disableselect', false );

		if ( this.is( 'img' ) === true ) {
			this.on( 'dragstart.cinder-disableselect', false );
		}
	};

	$.fn.enableSelect = function( ) {
		this.removeAttr( 'unselectable' );
		this.off( 'selectstart.cinder-disableselect' );

		if ( this.is( 'img' ) === true ) {
			this.off( 'dragstart.cinder-disableselect' );
		}
	};

	var _jquery_original_val = $.fn.val;

	$.fn.val = function( aValue, aEvent ) {
		var ret = _jquery_original_val.apply( this, arguments ),
			evt = aEvent || false;

		if ( aValue !== undefined && evt !== false ) {
			this.trigger( 'change' );
		}

		return ret;
	};
});


define( [ 'system/js/conduit', 'system/js/class', 'system/js/jquery.min' ], function( aConduit ) {
	'use strict';

	/*
	===============================================================================
	Class: Module
	===============================================================================
	*/

	var Module = Object.subClass({
		/**
		 * Method: init
		 */

		init: function( aData ) {
			var data = aData || { };

			this._conduit = [ ];
			this._data = { };

			this.bindPendingData( data );
		},

		/**
		 * Method: bindPendingData
		 * @param {Object} aData
		 */

		bindPendingData: function( aData ) {
			var data = aData || { },
				el, i, len;

			this._data = jQuery.extend( true, {
				title: null,
				container: null,
				view: null,
				data: { },
				css: [ ],
				js: [ ]
			}, data );

			if ( this._data.title != null ) {
				document.title = this._data.title;
			}

			el = jQuery( this._data.container );

			if ( el.length > 0 ) {
				el[ 0 ].innerHTML = this._data.html;

				this.bindLinks( el );
				this.bindForms( el );
			}
		},

		/**
		 * Method: bindLinks
		 * @param {Object} aContainer
		 */

		bindLinks: function( aContainer ) {
			var items, i,
				self = this;

			items = aContainer.find( 'a.cinder-link' );
			i = items.length;

			while ( i-- ) {
				$( items[ i ] ).on( 'click', function( aEvent ) {
					aEvent.preventDefault( );
					self.handleLinkClick( this );
				});
			}
		},

		/**
		 * Method: handleLinkCLick
		 * @param {DOMelement} aLink
		 */

		handleLinkClick: function( aLink ) {
			var link = aLink.href || '/',
				data = { },
				self = this;

			//TODO collect data-attributes?

			data.system = false;

			if ( link.indexOf( '#' ) != -1 ) {
				link = '/' + link.substr( link.indexOf( '#' ) + 1 );
			}

			this.getConduit( link ).ajax({
				url: link,
				type: 'post',
				data: data,
				success: function( response ) {
					self.bindPendingData( response );
				}
			});
		},

		/**
		 * Method: bindForms
		 * @param {Object} aContainer
		 */

		bindForms: function( aContainer ) {
			// TODO
		},

		/**
		 * Method: getConduit
		 * @param {Object} aName
		 */

		getConduit: function( aName ) {
			var name = aName || Math.random( ).toString( 36 ).substr( 2 );

			if ( !this._conduit.hasOwnProperty( name ) ) {
				this._conduit[ name ] = new aConduit( this );
			}

			return this._conduit[ name ];
		},

		/**
		 * Method: error
		 * @param {Object} aMessage
		 */

		error: function( aMessage ) {
			console.log( aMessage );
		}
	});

	return Module;
});

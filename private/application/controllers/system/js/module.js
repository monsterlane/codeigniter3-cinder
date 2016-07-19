
define( [ 'jclass', 'jquery', 'system/js/jquery.ui.min', 'bootstrap', 'system/js/bootstrap.notify.min' ], function( Class, $ ) {
	'use strict';

	/*
	===============================================================================
	Class: Module
	===============================================================================
	*/

	var Module = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aOptions
		 */

		init: function( aOptions ) {
			var options = aOptions || { };

			this._parent = aOptions.parent;
			this._parent.setData( 'module.options', options );
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: getConduit
		 */

		getConduit: function( aName ) {
			return this.getParent( ).getConduit( aName );
		},

		/**
		 * Method: bindMainEventListeners
		 * @param {DOMelement} aContainer
		 */

		bindMainEventListeners: function( aContainer ) {
			var parent = this.getParent( ),
				data = parent.getData( 'module' );

			parent.$container.find( '> div.sidebar > ul.toolbar > li.selected' ).removeClass( 'selected' );
			parent.$container.find( '> div.sidebar > ul.toolbar > li > a[href$="' + data.options.url + '"]' ).parent( ).addClass( 'selected' );
		},

		/**
		 * Method: handleUserLogin
		 * @param {Object} aData
		 */

		handleUserLogin: function( aData ) {
			this.handleUserLogout( );

			return this;
		},

		/**
		 * Method: handleUserLogout
		 */

		handleUserLogout: function( ) {
			return this;
		},

		/**
		 * Method: verbose
		 * @param {String} aMessage
		 */

		verbose: function( aMessage ) {
			this.getParent( ).verbose( aMessage );

			return this;
		},

		/**
		 * Method: notification
		 * @param {Object} aOptions
		 */

		notification: function( aOptions ) {
			var options = aOptions || { },
				body = $( 'body' ),
				stack = body.find( '> div.modal' ).length,
				z = 10002 + stack;

			options = $.extend( true, {
				body: 'An event has occurred.',
				type: 'success'
			}, options );

			$.notify({
				message: options.body
			}, {
				type: options.type,
				position: 'fixed',
				placement: {
					align: 'center'
				},
				z_index: z,
				offset: {
					y: 5
				}
			});

			return this;
		},

		/**
		 * Method: alert
		 * @param {Object} aOptions
		 */

		alert: function( aOptions ) {
			var parent = this.getParent( ),
				tpl = parent.$templates.find( 'div.purpose-alert' ).clone( ),
				options = aOptions || { },
				body = $( 'body' ),
				stack = body.find( '> div.modal' ).length,
				pos = $( window ).width( ) / 2,
				z;

			options = $.extend( true, {
				body: 'An error has occurred. ' + parent.getData( 'system.options.support_message' ),
				buttons: {
					ok: {
						text: 'Ok',
						callback: function( ) {
							tpl.modal( 'hide' );
						}
					}
				},
				overlay: true,
				draggable: false,
				beforeClose: function( ) { },
				beforeOpen: function( ) { },
				close: function( ) { },
				open: function( ) { }
			}, options );

			tpl.find( 'div.modal-body' )[ 0 ].innerHTML = options.body;
			tpl.find( 'div.modal-footer > button.btn-primary' )[ 0 ].innerHTML = options.buttons.ok.text;

			body.append( tpl );

			z = parseInt( tpl.css( 'z-index' ), 10 ) + stack;
			tpl.css( 'z-index', z );

			tpl.on( 'hide.bs.modal', function( ) {
				options.beforeClose( );
			}).on( 'show.bs.modal', function( ) {
				options.beforeOpen( );
			}).on( 'hidden.bs.modal', function( ) {
				options.close( );

				tpl.remove( );
			}).on( 'shown.bs.modal', function( ) {
				options.open( );
			});

			if ( options.draggable === true ) {
				tpl.draggable({
					containment: 'document'
				});
			}

			pos -= ( tpl.width( ) / 2 );
			pos = parseInt( pos, 10 );

			tpl.css({
				left: pos + 'px'
			});

			tpl.modal( 'show' );

			if ( options.overlay === false ) {
				tpl.next( 'div.modal-backdrop' ).addClass( 'hidden' );
			}

			return tpl;
		},

		/**
		 * Method: confirm
		 * @param {Object} aOptions
		 */

		confirm: function( aOptions ) {
			var parent = this.getParent( ),
				tpl = parent.$templates.find( 'div.purpose-confirm' ).clone( ),
				options = aOptions || { },
				body = $( 'body' ),
				stack = body.find( '> div.modal' ).length,
				pos = $( window ).width( ) / 2,
				t, z;

			options = $.extend( true, {
				body: 'Confirm action?',
				buttons: {
					cancel: {
						text: 'Cancel'
					},
					ok: {
						text: 'Ok',
						callback: function( ) {
							tpl.modal( 'hide' );
						}
					}
				},
				overlay: false,
				draggable: true,
				beforeClose: function( ) { },
				beforeOpen: function( ) { },
				close: function( ) { },
				open: function( ) { }
			}, options );

			tpl.find( 'div.modal-body' )[ 0 ].innerHTML = options.body;
			tpl.find( 'div.modal-footer > button.btn-default' )[ 0 ].innerHTML = options.buttons.cancel.text;

			t = tpl.find( 'div.modal-footer > button.btn-primary' );
			t[ 0 ].innerHTML = options.buttons.ok.text;

			t.on( 'click', function( aEvent ) {
				aEvent.preventDefault( );

				options.buttons.ok.callback( );
			});

			body.append( tpl );

			z = parseInt( tpl.css( 'z-index' ), 10 ) + stack;
			tpl.css( 'z-index', z );

			tpl.on( 'hide.bs.modal', function( ) {
				options.beforeClose( );
			}).on( 'show.bs.modal', function( ) {
				options.beforeOpen( );
			}).on( 'hidden.bs.modal', function( ) {
				options.close( );

				tpl.remove( );
			}).on( 'shown.bs.modal', function( ) {
				options.open( );
			});

			if ( options.draggable === true ) {
				tpl.draggable({
					containment: 'document'
				});
			}

			pos -= ( tpl.width( ) / 2 );
			pos = parseInt( pos, 10 );

			tpl.css({
				left: pos + 'px'
			});

			tpl.modal( 'show' );

			if ( options.overlay === false ) {
				tpl.next( 'div.modal-backdrop' ).addClass( 'hidden' );
			}

			return tpl;
		},

		/**
		 * Method: dialog
		 * @param {Object} aOptions
		 */

		dialog: function( aOptions ) {
			var parent = this.getParent( ),
				tpl = parent.$templates.find( 'div.purpose-dialog' ).clone( ),
				options = aOptions || { },
				body = $( 'body' ),
				stack = body.find( '> div.modal' ).length,
				pos = $( window ).width( ) / 2,
				t, z;

			options = $.extend( true, {
				title: false,
				body: '',
				buttons: {
					cancel: {
						text: 'Cancel'
					},
					ok: {
						text: 'Ok',
						callback: function( ) {
							tpl.modal( 'hide' );
						}
					}
				},
				overlay: false,
				draggable: true,
				beforeClose: function( ) { },
				beforeOpen: function( ) { },
				close: function( ) { },
				open: function( ) { }
			}, options );

			if ( options.title !== false ) {
				tpl.find( 'h4.modal-title' )[ 0 ].innerHTML = options.title;
			}
			else {
				t = tpl.find( 'div.modal-header' );
				t.find( '> h4.modal-title' ).remove( );

				t.css({
					'border-bottom': 'none',
					'padding-bototm': 0
				});
			}

			tpl.find( 'div.modal-body' )[ 0 ].innerHTML = options.body;

			if ( options.buttons !== false ) {
				tpl.find( 'div.modal-footer > button.btn-default' )[ 0 ].innerHTML = options.buttons.cancel.text;

				t = tpl.find( 'div.modal-footer > button.btn-primary' );
				t[ 0 ].innerHTML = options.buttons.ok.text;

				t.on( 'click', function( aEvent ) {
					aEvent.preventDefault( );

					options.buttons.ok.callback( );
				});
			}
			else {
				tpl.find( 'div.modal-footer' ).remove( );
			}

			body.append( tpl );

			z = parseInt( tpl.css( 'z-index' ), 10 ) + stack;
			tpl.css( 'z-index', z );

			tpl.on( 'hide.bs.modal', function( ) {
				options.beforeClose( );
			}).on( 'show.bs.modal', function( ) {
				options.beforeOpen( );
			}).on( 'hidden.bs.modal', function( ) {
				options.close( );

				tpl.remove( );
			}).on( 'shown.bs.modal', function( ) {
				options.open( );
			});

			if ( options.draggable === true ) {
				tpl.draggable({
					handle: 'div.modal-header',
					containment: 'document'
				});
			}

			pos -= ( tpl.width( ) / 2 );
			pos = parseInt( pos, 10 );

			tpl.css({
				left: pos + 'px'
			});

			tpl.modal( 'show' );

			if ( options.overlay === false ) {
				tpl.next( 'div.modal-backdrop' ).addClass( 'hidden' );
			}

			return tpl;
		}
	});

	return Module;
});

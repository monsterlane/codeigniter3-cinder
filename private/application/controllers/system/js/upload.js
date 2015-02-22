
define( [ 'jclass', 'jquery' ], function( Class, $ ) {
	'use strict';

	$.event.fixHooks.drop = {
		props: [ 'dataTransfer' ]
	};

	/*
	===============================================================================
	Class: Upload
	===============================================================================
	*/

	var Upload = Class._extend({

		/**
		 * Method: init
		 * @param {Object} aParent
		 */

		init: function( aParent ) {
			this._parent = aParent;

			this._options = {
				container: null,
				field_name: 'userfile',
				allowed_types: /(gif|jpg|jpeg|png)/,
				max_size: 1024 * ( 1024 ) // 1MB
			};

			this._container = null;
			this.$container = null;

			this._drop_area = null;
			this.$drop_area = null;
		},

		/**
		 * Method: getParent
		 */

		getParent: function( ) {
			return this._parent;
		},

		/**
		 * Method: bind
		 * @param {Mixed} aOptions
		 */

		bind: function( aOptions ) {
			var options = aOptions || { };

			if ( options.hasOwnProperty( 'nodeType' ) === true ) {
				this._options.container = options;
			}
			else if ( options.hasOwnProperty( 'container' ) === true ) {
				this._options = $.extend( true, this._options, options );
			}

			if ( this._options.container instanceof jQuery ) {
				this._container = this._options.container[ 0 ];
				this.$container = this._options.container;
			}
			else {
				this._container = this._options.container;
				this.$container = $( this._container );
			}

			if ( this.$container.hasClass( 'purpose-dragdrop' ) === true ) {
				this._drop_area = this._container;
				this.$drop_area = this.$container;
			}
			else {
				this.$drop_area = this.$container.find( '.purpose-dragdrop' );
				this._drop_area = this.$drop_area[ 0 ];
			}

			if ( window.File && window.FileList && window.FileReader && new XMLHttpRequest( ).upload ) {
				this.bindEventListeners( );
			}
			else {
				this.$drop_area.hide( );
			}
		},

		/**
		 * Method: bindEventListeners
		 */

		bindEventListeners: function( ) {
			var self = this;

			this.$drop_area.on( 'dragover', function( aEvent ) {
				aEvent.stopPropagation( );
				aEvent.preventDefault( );

				self.handleDragOver( );
			}).on( 'dragleave', function( aEvent ) {
				aEvent.stopPropagation( );
				aEvent.preventDefault( );

				self.handleDragLeave( );
			}).on( 'drop', function( aEvent ) {
				aEvent.stopPropagation( );
				aEvent.preventDefault( );

				self.handleDragDrop( aEvent );
			});
		},

		/**
		 * Method: handleDragOver
		 */

		handleDragOver: function( ) {
			this.$drop_area.find( '.purpose-message' ).hide( );
			this.$drop_area.find( '.purpose-dragover' ).show( );

			this.$drop_area.addClass( 'drop' );
		},

		/**
		 * Method: handleDragLeave
		 */

		handleDragLeave: function( ) {
			this.$drop_area.find( '.purpose-message' ).show( );
			this.$drop_area.find( '.purpose-dragover' ).hide( );

			this.$drop_area.removeClass( 'drop' );
		},

		/**
		 * Method: handleDragDrop
		 * @param {DOMevent} aEvent
		 */

		handleDragDrop: function( aEvent ) {
			var parent = this.getParent( ),
				files = [ ],
				file, i, len;

			if ( aEvent.dataTransfer !== undefined ) {
				files = aEvent.dataTransfer.files;
			}
			else if ( aEvent.target.files !== undefined ) {
				files = aEvent.target.files;
			}
			else {
				parent.error({
					body: 'An unexpected error occurred.'
				});

				this.$container.trigger( 'uploaderror', [ 'unknown' ] );
			}

			for ( i = 0, len = files.length; i < len; i++ ) {
				file = files[ i ];

				if ( file.type.match( this._options.allowed_types ) === null ) {
					this.reset( );

					parent.error({
						body: 'The file \'' + file.name + '\' is not a valid file type.'
					});

					this.$container.trigger( 'uploaderror', [ 'invalid_type' ] );
				}
				else if ( file.size > this._options.max_size ) {
					this.reset( );

					parent.error({
						body: 'The file \'' + file.name + '\' exceeds the maximum allowed size of ' + ( this._options.max_size / ( 1024 * 1024 ) ) + 'MB.'
					});

					this.$container.trigger( 'uploaderror', [ 'invalid_size' ] );
				}
				else {
					this.upload( file );
				}
			}
		},

		/**
		 * Method: reset
		 */

		reset: function( ) {
			this.$drop_area.find( '.purpose-message' ).show( );
			this.$drop_area.find( '.purpose-dragover' ).hide( );
			this.$drop_area.find( '.purpose-progress' ).hide( );

			this.$drop_area.removeClass( 'drop' );
		},

		/**
		 * Method: beforeStart
		 */

		beforeStart: function( ) {
			this.$drop_area.find( '.purpose-message' ).hide( );
			this.$drop_area.find( '.purpose-dragover' ).hide( );
			this.$drop_area.find( '.purpose-progress' ).show( );

			this.$drop_area.removeClass( 'drop' );
		},

		/**
		 * Method: uploadFile
		 * @param {DOMfile} aFile
		 */

		upload: function( aFile ) {
			var parent = this.getParent( ),
				form = this.$container.serializeArray( ),
				data = new FormData( ),
				url, i, self = this;

			if ( this.$container.is( 'form' ) === true ) {
				url = this._container.getAttribute( 'action' );
			}
			else {
				url = this._container.getAttribute( 'data-action' );
			}

			data.append( this._options.field_name, aFile );

			for ( i in form ) {
				if ( form.hasOwnProperty( i ) === true ) {
					data.append( form[ i ].name, form[ i ].value );
				}
			}

			parent.getConduit( ).ajax({
				url: url,
				data: data,
				cache: false,
				contentType: false,
				processData: false,
				beforeSend: function( ) {
					self.beforeStart( );
				},
				success: function( response ) {
					self.reset( );

					self.$container.trigger( 'uploadcomplete' );

					if ( response.hasOwnProperty( 'message' ) ) {
						parent.notification({
							body: response.message
						});
					}
				},
				error: function( ) {
					self.reset( );

					self.$container.trigger( 'uploaderror' );
				}
			});
		}
	});

	return Upload;
});

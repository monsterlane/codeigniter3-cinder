<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/dot/Dot.php' );

class MY_Controller extends CI_Controller {
	private $_options = array( );
	private $_data;

	public function __construct( ) {
		parent::__construct( );

		$boot = ( $this->input->post( 'system' ) === 'false' ) ? false : true;

		$this->set_option( 'system', true );
		$this->set_option( 'boot', $boot );

		$this->set_option( 'require_https', $this->config->item( 'require_https' ) );
		$this->set_option( 'require_auth', $this->config->item( 'require_auth' ) );

		$url = uri_string( );
		if ( $url === '' ) {
			$url = str_replace( '_controller', '', $this->router->default_controller );
		}

		$this->_data = new Dot( array(
			'system' => array(
				'options' => array( ),
				'data' => array( ),
			),
			'module' => array(
				'options' => array( ),
				'data' => array(
					'system' => false,
					'redirect' => false,
					'name' => false,
					'view' => false,
					'url' => $url,
				),
				'messages' => array( ),
			),
		));
	}

	/* public methods */

	public function boot( ) {
		$data = array(
			'environment' => ENVIRONMENT,
			'version' => $this->config->item( 'version' ),
			'verbose' => $this->config->item( 'verbose' ),
			'support_email' => $this->config->item( 'support_email' ),
			'support_message' => $this->config->item( 'support_message' ),
			'default_container' => $this->config->item( 'default_container' ),
			'validation_container' => $this->config->item( 'validation_container' ),
			'flashdata_container' => $this->config->item( 'flashdata_container' ),
		);

		if ( $this->config->item( 'csrf_protection' ) === true ) {
			$data[ 'csrf' ] = array(
				'name' => $this->security->get_csrf_token_name( ),
				'value' => $this->security->get_csrf_hash( ),
			);
		}

		$this->set_data( 'system.options', $data );

		$config = file_get_contents( APPPATH . 'controllers/system/js/require.config.js' );
		$vpath = '';

		if ( ENVIRONMENT === 'production' || ENVIRONMENT === 'testing' ) {
			$vpath = str_replace( '.', '', $this->config->item( 'version' ) );
			$config = str_replace( '/files/cache', '/files/cache/' . $vpath, $config );
			$vpath .= '/';

			$dust = 'core';
		}
		else {
			$config = substr_replace( $config, ",\n	urlArgs: 't=' + Date.now( )\n});", strrpos( $config, "\n" . '});' ), strlen( "\n});" ) );

			$config = str_replace( 'dust.core.min', 'dust.full.min', $config );
			$dust = 'full';
		}

		$data = array(
			'config' => $config,
			'version' => $vpath,
		);

		$this->set_view( array(
			'title' => 'CI3-Cinder',
			'view' => array(
				'path' => 'system/views/index.html',
				'css' => array(
					'system/css/jquery.ui.min.css',
					'system/css/bootstrap.min.css',
					'system/css/bootstrap.theme.min.css',
					'system/css/loading.css',
					'system/css/loaded.css',
					'system/css/sprite.css',
					'system/css/svg.css',
					'system/css/index.css',
					'system/css/plugins.css',
				),
				'js' => array(
					'system/js/require.config.js',
					'system/js/require.js.min.js',
					'system/js/require.css.min.js',
					'system/js/require.domready.min.js',
					'system/js/require.webfont.js',
					'system/js/jquery.min.js',
					'system/js/jquery.ui.min.js',
					'system/js/jquery.plugins.js',
					'system/js/jquery.validate.min.js',
					'system/js/bootstrap.min.js',
					'system/js/bootstrap.notify.min.js',
					'system/js/jclass.min.js',
					'system/js/dust.' . $dust . '.min.js',
					'system/js/dust.helpers.min.js',
					'system/js/dust.extra.js',
					'system/js/webfont.min.js',
					'system/js/app.js',
					'system/js/cache.js',
					'system/js/conduit.js',
					'system/js/model.js',
					'system/js/module.js',
					'system/js/timer.js',
					'system/js/view.js',
				),
				'fonts' => array(
					'google,families:[Italiana]',
				),
				'data' => $data,
			),
			'templates' => array(
				'alert' => 'system/views/alert.html',
				'confirm' => 'system/views/confirm.html',
				'dialog' => 'system/views/dialog.html',
			),
		), 'system.data' );

		$data = array(
			'system' => true,
		);

		$this->set_data( 'module.data', $data );
	}

	public function set_option( $key, $val ) {
		$this->_options[ $key ] = $val;
	}

	public function get_option( $key ) {
		if ( array_key_exists( $key, $this->_options ) === true ) {
			return $this->_options[ $key ];
		}
		else {
			return null;
		}
	}

	public function get_data( $key = null ) {
		return $this->_data->get( $key );
	}

	public function set_data( $key, $data = array( ) ) {
		$this->_data->set( $key, $data );
	}

	public function set_view( $data = array( ), $key = 'module.data' ) {
		$module = $this->get_data( $key );

		$redir = ( array_key_exists( 'redirect', $module ) === true && is_string( $module[ 'redirect' ] ) === true );

		if ( $key === 'system.data' || $redir === false ) {
			$data = merge_array( array(
				'version' => $this->config->item( 'version' ),
				'name' => 'system/js/module',
				'view' => array(
					'path' => false,
					'module' => false,
					'css' => array( ),
					'js' => array( ),
					'fonts' => array( ),
					'container' => $this->config->item( 'default_container' ),
					'show_nav' => true,
					'data' => array(
						'_site_url' => site_url( ),
						'_base_url' => base_url( ),
					),
					'hash' => false,
				)
			), $data );

			$dest = $this->config->item( 'cache_file_path' );

			if ( empty( $data[ 'view' ][ 'css' ] ) === true ) {
				$style = $this->router->directory . 'css/' . $this->router->method . '.css';

				if ( file_exists( VIEWPATH . $style ) === true && is_file( VIEWPATH . $style ) === true ) {
					$data[ 'view' ][ 'css' ][ ] = $style;
				}
			}

			if ( ENVIRONMENT !== 'development' ) {
				foreach ( $data[ 'view' ][ 'css' ] as $k => $style ) {
					if ( strpos( $style, '/' ) !== false ) {
						$name = substr( $style, strrpos( $style, '/' ) + 1 );
					}
					else {
						$name = $style;
					}

					if ( $name !== 'index.css' ) {
						unset( $data[ 'view' ][ 'css' ][ $k ] );
					}
					else if ( strpos( $style, '/' ) === false ) {
						$data[ 'view' ][ 'css' ][ $k ] = $this->router->directory . 'css/' . $style;
					}
				}

				$data[ 'view' ][ 'css' ] = array_values( $data[ 'view' ][ 'css' ] );
			}
			else {
				foreach ( $data[ 'view' ][ 'css' ] as $k => $style ) {
					if ( strpos( $style, '/' ) !== false ) {
						$name = substr( $style, strrpos( $style, '/' ) + 1 );
					}
					else {
						$name = $style;

						$style = $this->router->directory . 'css/' . $style;
					}

					if ( file_exists( $dest . $style ) === false || filemtime( VIEWPATH . $style ) !== filemtime( $dest . $style ) ) {
						$data[ 'view' ][ 'css' ][ $k ] = $style;

						$dir = $dest . substr( $style, 0, strrpos( $style, '/' ) );

						if ( file_exists( $dir ) === false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $style, $dest . $style );
					}

					if ( $name !== 'index.css' ) {
						unset( $data[ 'view' ][ 'css' ][ $k ] );
					}
				}
				unset( $style );

				foreach ( $data[ 'view' ][ 'js' ] as $script ) {
					if ( strpos( $script, '/' ) === false ) {
						$script = $this->router->directory . 'js/' . $script;
					}

					if ( file_exists( $dest . $script ) === false ||  filemtime( VIEWPATH . $script ) !== filemtime( $dest . $script ) ) {
						$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

						if ( file_exists( $dir ) === false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $script, $dest . $script );
					}
				}
			}

			if ( $data[ 'name' ] !== false ) {
				if ( $data[ 'name' ] === 'system/js/module' ) {
					$module = $this->router->directory . 'js/' . $this->router->method;

					if ( file_exists( VIEWPATH . $module . '.js' ) === true && is_file( VIEWPATH . $module . '.js' ) === true ) {
						$data[ 'name' ] = $module;
					}
				}
				else if ( strpos( $data[ 'name' ], '/' ) === false ) {
					$data[ 'name' ] = $this->router->directory . 'js/' . $data[ 'name' ];
				}

				if ( ENVIRONMENT === 'development' ) {
					$script = $data[ 'name' ] . '.js';

					if ( file_exists( $dest . $script ) === false || filemtime( VIEWPATH . $script ) !== filemtime( $dest . $script ) ) {
						$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

						if ( file_exists( $dir ) === false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $script, $dest . $script );
					}
				}
			}

			if ( array_key_exists( 'templates', $data ) === true && is_array( $data[ 'templates' ] ) === true ) {
				foreach ( $data[ 'templates' ] as &$template ) {
					$template = file_get_contents( VIEWPATH . $template );
				}
				unset( $template );
			}

			$this->set_data( $key, $data );

			if ( $key === 'system.data' && count( $data[ 'view' ][ 'fonts' ] ) > 0 ) {
				$this->set_data( 'system.options.fonts', $data[ 'view' ][ 'fonts' ] );
			}
		}
	}

	public function redirect( $aUrl ) {
		if ( strpos( $aUrl, 'http' ) === false ) {
			$aUrl = base_url( $aUrl );
		}

		$this->set_data( 'module.data', array(
			'redirect' => $aUrl,
		) );
	}

	public function dump( $data = array( ) ) {
		die( var_dump( $data ) );
	}
}

?>

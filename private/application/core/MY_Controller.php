<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Controller extends CI_Controller {
	private $_data;

	public function __construct( ) {
		parent::__construct( );

		$post = clean_array( $this->input->post( ) );
		if ( array_key_exists( 'system', $post ) === false ) {
			$post[ 'system' ] = true;
		}

		$this->_data = array(
			'post' => $post,
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
					'url' => uri_string( ),
				),
				'messages' => array( ),
			),
		);

		if ( $this->config->item( 'maintenance' ) === true && $this->router->directory !== 'maintenance/' ) {
			$this->redirect( 'maintenance' );
		}
		else if ( $this->_data[ 'post' ][ 'system' ] !== false ) {
			$this->_load_system( );
		}
	}

	/* internal methods */

	private function _load_system( ) {
		$data = array(
			'version' => $this->config->item( 'version' ),
			'verbose' => $this->config->item( 'verbose' ),
			'support_address' => $this->config->item( 'support_address' ),
			'support_message' => $this->config->item( 'support_message' ),
			'validation_container' => $this->config->item( 'validation_container' ),
			'flashdata_container' => $this->config->item( 'flashdata_container' ),
		);

		$this->set_data( 'system.options', $data );

		$config = file_get_contents( APPPATH . 'controllers/system/js/require.config.js' );
		$vpath = '';

		if ( ENVIRONMENT === 'production' || ENVIRONMENT === 'testing' ) {
			$vpath = str_replace( '.', '', $this->config->item( 'version' ) );
			$config = str_replace( '/files/cache', '/files/cache/' . $vpath, $config );
			$vpath .= '/';
		}
		else if ( ENVIRONMENT === 'development' ) {
			$config = substr_replace( $config, ",\n	urlArgs: 't=' + Date.now( )\n});", strrpos( $config, "\n" . '});' ), strlen( "\n});" ) );
		}

		$data = array(
			'config' => $config,
			'version' => $vpath,
		);

		$this->set_view( array(
			'favicon' => false,
			'title' => 'CI3-Cinder',
			'name' => false,
			'view' => array(
				'path' => 'system/views/index.html',
				'css' => array(
					'system/css/reset.css',
					'system/css/style.css',
				),
				'js' => array(
					'system/js/require.config.js',
					'system/js/require.js.min.js',
					'system/js/require.css.min.js',
					'system/js/require.domready.min.js',
					'system/js/jquery.min.js',
					'system/js/jquery.plugins.js',
					'system/js/jclass.min.js',
					'system/js/dot.min.js',
					'system/js/webfont.min.js',
					'system/js/app.js',
					'system/js/cache.js',
					'system/js/conduit.js',
					'system/js/model.js',
					'system/js/module.js',
					'system/js/upload.js',
					'system/js/view.js',
				),
				'data' => $data,
			),
		), 'system.data' );

		$icon = 'system/img/favicon.ico';

		if ( file_exists( FCPATH . 'files/cache/' . $icon ) === true && is_file( FCPATH . 'files/cache/' . $icon ) === true ) {
			$this->set_data( 'system.data.favicon', $icon );
		}

		$data = array(
			'system' => true,
		);

		$this->set_data( 'module.data', $data );
	}

	/* public methods */

	public function get_data( $key = null ) {
		$root = $this->_data;

		if ( $key !== null ) {
			$keys = explode( '.', $key );

			foreach ( $keys as $key ) {
				if ( isset( $root[ $key ] ) === true ) {
					$root = $root[ $key ];
				}
				else {
					return null;
				}
			}
		}

		return $root;
	}

	public function set_data( $key, $data = array( ) ) {
		$keys = explode( '.', $key );
		$root = &$this->_data;

		while ( count( $keys ) > 1 ) {
			$key = array_shift( $keys );

			if ( isset( $root[ $key ] ) === false ) {
				$root[ $key ] = array( );
			}

			$root = &$root[ $key ];
		}

		$key = reset( $keys );

		if ( empty( $data ) === false && isset( $root[ $key ] ) === true && is_array( $root[ $key ] ) === true ) {
			foreach ( $data as $k => $v ) {
				$root[ $key ][ $k ] = $v;
			}
		}
		else {
			$root[ $key ] = $data;
		}
	}

	public function set_view( $data = array( ), $key = 'module.data' ) {
		$module = $this->get_data( $key );

		if ( $key === 'system.data' || is_string( $module[ 'redirect' ] ) === false ) {
			$data = merge_array( array(
				'name' => null,
				'view' => array(
					'path' => null,
					'css' => array( ),
					'js' => array( ),
					'container' => $this->config->item( 'default_container' ),
					'data' => array( ),
					'hash' => false,
				)
			), $data );

			$dest = FCPATH . 'files/cache/';

			if ( ENVIRONMENT === 'production' || ENVIRONMENT === 'testing' ) {
				foreach ( $data[ 'view' ][ 'css' ] as $k => $style ) {
					if ( strpos( $style, '/' ) !== false ) {
						$name = substr( $style, strrpos( $style, '/' ) + 1 );
					}
					else {
						$name = $style;
					}

					if ( $name !== 'style.css' ) {
						unset( $data[ 'view' ][ 'css' ][ $k ] );
					}
					else if ( strpos( $style, '/' ) === false ) {
						$data[ 'view' ][ 'css' ][ $k ] = $this->router->directory . 'css/' . $style;
					}
				}

				$data[ 'view' ][ 'css' ] = array_values( $data[ 'view' ][ 'css' ] );
			}
			else if ( ENVIRONMENT === 'development' ) {
				foreach ( $data[ 'view' ][ 'css' ] as &$style ) {
					if ( strpos( $style, '/' ) === false ) {
						$style = $this->router->directory . 'css/' . $style;
					}

					if ( file_exists( $dest . $style ) === false || filemtime( VIEWPATH . $style ) !== filemtime( $dest . $style ) ) {
						$dir = $dest . substr( $style, 0, strrpos( $style, '/' ) );

						if ( file_exists( $dir ) === false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $style, $dest . $style );
					}
				}
				unset( $style );

				foreach ( $data[ 'view' ][ 'js' ] as $script ) {
					if ( strpos( $script, '/' ) === false ) {
						$script = $this->router->directory . 'js/' . $script;
					}

					if ( file_exists( $dest . $script ) === false ||  filemtime( VIEWPATH . $script ) !== filemtime( $dest . $script ) ) {
						$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

						if ( file_exists( $dir ) == false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $script, $dest . $script );
					}
				}
			}

			if ( $data[ 'name' ] !== false ) {
				if ( $data[ 'name' ] === null ) {
					$data[ 'name' ] = ( $this->router->method == 'index' ) ? 'module' : $this->router->method;
				}

				if ( strpos( $data[ 'name' ], '/' ) === false ) {
					$data[ 'name' ] = $this->router->directory . 'js/' . $data[ 'name' ];
				}

				if ( file_exists( VIEWPATH . $data[ 'name' ] . '.js' ) === false ) {
					$data[ 'name' ] = 'system/js/module';
				}

				if ( ENVIRONMENT === 'development' ) {
					$script = $data[ 'name' ] . '.js';

					if ( file_exists( $dest . $script ) === false || filemtime( VIEWPATH . $script ) !== filemtime( $dest . $script ) ) {
						$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

						if ( file_exists( $dir ) == false ) {
							mkdir( $dir, 0755, true );
						}

						copy( VIEWPATH . $script, $dest . $script );
					}
				}
			}

			$this->set_data( $key, $data );
		}
	}

	public function redirect( $aUrl ) {
		$this->set_data( 'module.data', array(
			'redirect' => base_url( $aUrl ),
		) );
	}
}

?>
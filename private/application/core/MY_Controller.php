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
			'pending' => array(
				'options' => array( ),
				'data' => array(
					'system' => false,
					'redirect' => false,
					'module' => false,
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
			'verbose' => $this->config->item( 'verbose' ),
			'cache_path' => $this->config->item( 'cache_web_path' ),
			'support_address' => $this->config->item( 'support_address' ),
			'support_message' => $this->config->item( 'support_message' ),
		);

		$this->set_data( 'system.options', $data );

		$this->set_view( array(
			'title' => 'CI3-Cinder',
			'module' => false,
			'view' => array(
				'path' => 'system/views/index.html',
				'css' => array(
					'system/css/reset.css',
					'system/css/style.css',
				),
				'js' => array(
					'system/js/require.min.js',
					'system/js/css.min.js',
					'system/js/jquery.min.js',
					'system/js/dot.min.js',
					'system/js/class.min.js',
					'system/js/cache.js',
					'system/js/conduit.js',
					'system/js/model.js',
					'system/js/view.js',
					'system/js/app.js',
					'system/js/module.js',
				),
			),
		), 'system' );

		$data = array(
			'system' => true,
		);

		$this->set_data( 'pending.data', $data );
	}

	/* public methods */

	public function get_data( $key = null ) {
		$root = $this->_data;

		if ( $key !== null ) {
			$keys = explode( '.', $key );

			while ( count( $keys ) > 1 ) {
				$key = array_shift( $keys );

				if ( !isset( $root[ $key ] ) ) {
					return null;
				}

				$root = $root[ $key ];
			}
		}

		return $root;
	}

	public function set_data( $key, $data = array( ) ) {
		$keys = explode( '.', $key );
		$root = &$this->_data;

		while ( count( $keys ) > 1 ) {
			$key = array_shift( $keys );

			if ( !isset( $root[ $key ] ) ) {
				$root[ $key ] = array( );
			}

			$root = &$root[ $key ];
		}

		$key = reset( $keys );

		if ( is_array( $data ) === true && is_array( $root[ $key ] ) === true ) {
			foreach ( $data as $k => $v ) {
				$root[ $key ][ $k ] = $v;
			}
		}
		else {
			$root[ $key ] = $data;
		}
	}

	public function set_view( $data = array( ), $key = 'pending' ) {
		$pending = $this->get_data( $key . '.data' );

		if ( $key === 'system' || is_string( $pending[ 'data' ][ 'redirect' ] ) === false ) {
			$data = merge_array( array(
				'module' => null,
				'view' => array(
					'path' => null,
					'css' => array( ),
					'js' => array( ),
					'container' => $this->config->item( 'default_container' ),
					'data' => array( ),
					'hash' => false,
				)
			), $data );

			if ( $data[ 'module' ] !== false ) {
				$data[ 'module' ] = $this->router->directory . 'js/';
				$data[ 'module' ].= ( $this->router->method == 'index' ) ? 'module' : $this->router->method;

				if ( file_exists( VIEWPATH . $data[ 'module' ] . '.js' ) === false ) {
					$data[ 'module' ] = 'system/js/module';
				}
			}

			$dest = $this->config->item( 'cache_file_path' );

			foreach ( $data[ 'view' ][ 'css' ] as &$style ) {
				if ( strpos( $style, '/' ) === false ) {
					$style = $this->router->directory . 'css/' . $style;
				}

				$path = VIEWPATH . $style;

				if ( ENVIRONMENT == 'development' || file_exists( $dest . $style ) == false ) {
					$dir = $dest . substr( $style, 0, strrpos( $style, '/' ) );

					if ( file_exists( $dir ) == false ) {
						mkdir( $dir, 0755, true );
					}
				}
			}
			unset( $style );

			foreach ( $data[ 'view' ][ 'js' ] as &$script ) {
				if ( strpos( $script, '/' ) === false ) {
					$script = $this->router->directory . 'js/' . $script;
				}

				$path = VIEWPATH . $script;

				if ( ENVIRONMENT == 'development' || file_exists( $dest . $script ) == false ) {
					$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

					if ( file_exists( $dir ) == false ) {
						mkdir( $dir, 0755, true );
					}

					copy( $path, $dest . $script );
				}
			}
			unset( $script );

			if ( $data[ 'module' ] !== false ) {
				$script = $data[ 'module' ] . '.js';
				$path = VIEWPATH . $script;

				if ( ENVIRONMENT == 'development' || file_exists( $dest . $script ) == false ) {
					$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

					if ( file_exists( $dir ) == false ) {
						mkdir( $dir, 0755, true );
					}

					copy( $path, $dest . $script );
				}
			}

			$this->set_data( $key . '.data', $data );
		}
	}

	public function redirect( $aUrl ) {
		$this->set_data( 'pending.data', array(
			'redirect' => base_url( $aUrl ),
		) );
	}
}

?>
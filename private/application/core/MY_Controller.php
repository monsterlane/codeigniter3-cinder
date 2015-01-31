<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Controller extends CI_Controller {
	protected $data;

	public function __construct( ) {
		parent::__construct( );

		$post = clean_array( $this->input->post( ) );
		if ( array_key_exists( 'system', $post ) === false ) {
			$post[ 'system' ] = true;
		}

		$this->data = array(
			'post' => $post,
			'system' => array( ),
			'pending' => array(
				'system' => false,
				'redirect' => false,
			),
		);

		if ( $this->config->item( 'maintenance_mode' ) === true && $this->router->directory !== 'maintenance/' ) {
			$this->redirect( 'maintenance' );
		}
		else if ( $this->data[ 'post' ][ 'system' ] !== false ) {
			$this->_load_system( );
		}
	}

	/* internal methods */

	private function _load_system( ) {
		$this->set_view( array(
			'title' => 'CI3-Cinder',
			'view' => 'system/views/index.html',
			'json' => array(
				'title' => 'CI3-Cinder',
				'cache_path' => $this->config->item( 'cache_web_path' ),
			),
			'css' => array(
				'system/css/reset.css',
				'system/css/style.css',
			),
			'js' => array(
				'system/js/require.min.js',
				'system/js/css.min.js',
				'system/js/jquery.min.js',
				'system/js/class.min.js',
				'system/js/dot.min.js',
				'system/js/app.js',
				'system/js/module.js',
				'system/js/cache.js',
				'system/js/conduit.js',
				'system/js/model.js',
				'system/js/view.js',
			),
			'options' => array(
				'verbose' => true,
				'support_address' => $this->config->item( 'support_address' ),
				'support_message' => $this->config->item( 'support_message' ),
			),
		), 'system' );

		$this->set_data( array(
			'system' => true,
		), 'pending' );
	}

	/* public methods */

	public function &get_data( $key = null ) {
		if ( $key !== null ) {
			if ( array_key_exists( $key, $this->data ) ) {
				return $this->data[ $key ];
			}
		}

		return $this->data;
	}

	public function &set_data( $data = array( ), $key = 'pending' ) {
		if ( array_key_exists( $key, $this->data ) === false ) {
			$this->data[ $key ] = array( );
		}

		foreach ( $data as $k => $v ) {
			$this->data[ $key ][ $k ] = $v;
		}

		return $this->data[ $key ];
	}

	public function set_view( $data = array( ), $key = 'pending' ) {
		$redirect = false;

		if ( $key === 'pending' ) {
			$pending = $this->get_data( 'pending' );

			if ( is_string( $pending[ 'redirect' ] ) === true ) {
				$redirect = true;
			}
		}

		if ( $redirect === false ) {
			$data = merge_array( array(
				'container' => $this->config->item( 'default_container' ),
				'url' => '/' . uri_string( ),
				'module' => null,
				'json' => array( ),
				'css' => array( ),
				'js' => array( ),
				'options' => array( ),
			), $data );

			$data =& $this->set_data( $data, $key );

			if ( $data[ 'module' ] !== false ) {
				$this->data[ $key ][ 'module' ] = $this->router->directory . 'js/module';
			}

			$dest = $this->config->item( 'cache_file_path' );

			foreach ( $this->data[ $key ][ 'css' ] as &$style ) {
				if ( strpos( $style, '/' ) === false ) {
					$style = $this->router->directory . 'css/' . $style;
				}

				$path = VIEWPATH . $style;

				if ( ENVIRONMENT == 'development' || file_exists( $dest . $style ) == false ) {
					$dir = $dest . substr( $style, 0, strrpos( $style, '/' ) );

					if ( file_exists( $dir ) == false ) {
						mkdir( $dir, 0755, true );
					}

					copy( $path, $dest . $style);
				}
			}
			unset( $style );

			foreach ( $this->data[ $key ][ 'js' ] as &$script ) {
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
		}
	}

	public function redirect( $aUrl ) {
		$this->set_data( array(
			'redirect' => base_url( $aUrl ),
		) );
	}
}

?>
<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/minify/min/lib/JSMin.php' );
require_once( APPPATH . 'third_party/minify/min/lib/CSSmin.php' );

class MY_Controller extends CI_Controller {
	protected $data;

	public function __construct( ) {
		parent::__construct( );

		$this->data = array( );

		if ( $this->input->post( 'system' ) !== 'false' ) {
			$this->_load_system( );
		}
	}

	/* internal methods */

	private function _load_system( ) {
		$this->set_view( array(
			'title' => 'CI3-Cinder',
			'view' => 'system/views/document.html',
			'json' => array(
				'title' => 'CI3-Cinder',
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
				'system/js/module.js',
				'system/js/conduit.js',
				'system/js/model.js',
				'system/js/parser.js',
				'system/js/cache.js',
			),
		), 'system' );
	}

	/* public methods */

	public function get_data( ) {
		return $this->data;
	}

	public function set_view( $data = array( ), $key = 'pending' ) {
		$this->data[ $key ] = merge_array( array(
			'container' => $this->config->item( 'default_container' ),
			'url' => '/' . uri_string( ),
			'module' => null,
			'json' => array( ),
			'css' => array( ),
			'js' => array( ),
		), $data );

		if ( array_key_exists( 'module', $data ) == false ) {
			$data[ 'module' ] = null;
		}

		if ( $this->data[ $key ][ 'module' ] == null && $data[ 'module' ] !== false ) {
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

?>
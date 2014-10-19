<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/minify/min/lib/JSMin.php' );
require_once( APPPATH . 'third_party/minify/min/lib/CSSmin.php' );

class MY_Controller extends CI_Controller {
	protected $data;

	public function __construct( ) {
		parent::__construct( );

		$this->data = array(
			'system' => array( ),
			'pending' => array( ),
		);

		$this->_load_system( );
	}

	/* internal methods */

	private function _load_system( ) {
		$this->set_view(array(
			'view' => 'system/views/document.html',
			'data' => array(
				'title' => 'CI3-Cinder',
			),
			'js' => array(
				'system/js/require.min.js',
				'system/js/jquery.min.js',
				'system/js/class.js',
				'system/js/module.js',
			),
		));
	}

	/* public methods */

	public function get_data( ) {
		return $this->data;
	}

	public function set_view( $data = array( ) ) {
		$this->add_view( $data );

		$this->data[ 'system' ] = array_pop( $this->data[ 'pending' ] );
		unset( $this->data[ 'system' ][ 'container' ] );
	}

	public function add_view( $data = array( ) ) {
		$data = merge_array(array(
			'container' => '#cinderBodyArea',
			'view' => null,
			'data' => array( ),
			'css' => array( ),
			'js' => array( ),
		), $data );

		$this->data[ 'pending' ][ ] = $data;

		$dest = $this->config->item( 'cache_file_path' );
		$copy = $this->config->item( 'cache_assets' );

		foreach ( $data[ 'js' ] as $script ) {
			$path = VIEWPATH . $script;

			if ( !file_exists( $dest . $script ) ) {
				$dir = $dest . substr( $script, 0, strrpos( $script, '/' ) );

				if ( !file_exists( $dir ) ) {
					mkdir( $dir, 0755, true );
				}

				if ( !file_exists( $dest . $script ) ) {
					$copy = true;
				}
			}
			else if ( $copy == false ) {
				$copy = true;
			}

			if ( $copy == true ) {
				copy( $path, $dest . $script );
			}
		}
	}
}

?>
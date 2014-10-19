<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/minify/min/lib/JSMin.php' );
require_once( APPPATH . 'third_party/minify/min/lib/CSSmin.php' );

class MY_Controller extends CI_Controller {
	protected $data;

	public function __construct( ) {
		parent::__construct( );

		$this->data = array(
			'views' => array( ),
		);

		$this->_load_system( );
	}

	/* internal methods */

	private function _load_system( ) {
		$this->load->partial(array(
			'container' => 'system',
			'view' => 'system/views/document.html',
			'data' => array(
				'title' => 'CI3-Cinder',
			),
			'js' => array(
				'system/js/require.min.js',
				'system/js/jquery.min.js',
				'system/js/class.js',
				'system/js/boot.js',
				'system/js/module.js',
			),
		));
	}

	/* public methods */

	public function get_data( ) {
		return $this->data;
	}

	public function add_view( $data = array( ) ) {
		$data = merge_array(array(
			'container' => 'body',
			'view' => null,
			'data' => array( ),
			'css' => array( ),
			'js' => array( ),
		), $data );

		$this->data[ 'views' ][ ] = $data;

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
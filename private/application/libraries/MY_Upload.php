<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Upload extends CI_Upload {
	private $_max_size;

	public function __construct( $config = array( ) ) {
		parent::__construct( $config );

		$this->_CI->load->helper( 'upload' );

		$this->_max_size = get_upload_max_filesize( );
	}

	/* overloaded methods */

	public function initialize( array $config = array( ), $reset = TRUE ) {
		parent::initialize( $config, $reset );

		$this->max_size = $this->_max_size;

		return $this;
	}

	/* public methods */

	public function get_max_filesize( ) {
		return $this->_max_size;
	}
}

?>

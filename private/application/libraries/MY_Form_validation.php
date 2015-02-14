<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Form_validation extends CI_Form_validation {
	public function __construct( ) {
		parent::__construct( );

		$this->set_error_delimiters( '<p class="error">', '</p>' );
	}
}

?>
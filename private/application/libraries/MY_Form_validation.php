<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Form_validation extends CI_Form_validation {
	public function __construct( $rules = array( ) ) {
		parent::__construct( $rules );

		$ci =& get_instance( );
		$ci->load->config( 'form_validation' );

		$this->set_error_delimiters( $ci->config->item( 'validation_error_open' ), $ci->config->item( 'validation_error_close' ) );
	}
}

?>
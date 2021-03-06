<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Email extends CI_Email {
	public function __construct( $config = array( ) ) {
		parent::__construct( $config );

		$ci =& get_instance( );
		$this->from( $ci->config->item( 'support_email' ), $ci->config->item( 'support_name' ) );
	}

	/* public methods */

	public function clear( $clear_attachments = false ) {
		parent::clear( $clear_attachments );

		$ci =& get_instance( );
		$this->from( $ci->config->item( 'support_email' ), $ci->config->item( 'support_name' ) );

		return $this;
	}
}

?>

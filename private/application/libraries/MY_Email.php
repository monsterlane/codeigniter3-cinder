<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Email extends CI_Email {
	private $_from_address;
	private $_from_name;

	public function __construct( $config = array( ) ) {
		parent::__construct( $config );

		$this->_from_address = ( array_key_exists( 'mail_from_address', $config ) && $config[ 'mail_from_address' ].'' != '' ) ? $config[ 'mail_from_address' ]: null;
		$this->_from_name = ( array_key_exists( 'mail_from_name', $config ) && $config[ 'mail_from_name' ].'' != '' ) ? $config[ 'mail_from_name' ]: null;

		$this->_set_from( );
	}

	private function _set_from( ) {
		if ( $this->_from_address != null && $this->_from_name != null ) {
			$this->from( $this->_from_address, $this->_from_name );
		}
		else if ( $this->_from_address != null ) {
			$this->from( $this->_from_address );
		}
	}

	public function clear( $clear_attachments = false ) {
		parent::clear( $clear_attachments );

		$this->_set_from( );

		return $this;
	}
}

?>
<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Form_validation extends CI_Form_validation {
	public function __construct( ) {
		parent::__construct( );

		$ci =& get_instance( );
		$ci->lang->load( 'form_validation_lang.php', 'english' );
	}

	/* public methods */

	public function valid_string( $str ) {
		if ( strpos( $str, '<' ) !== false || strpos( $str, '>' ) !== false ) {
			$this->set_message( 'valid_string', '{field} contains invalid character(s).' );

			return false;
		}

		return true;
	}

	public function valid_date( $str ) {
		if ( preg_match( '/([0-9]{2})\/([0-9]{2})\/([0-9]{4})\Z/', $str ) ) {
			$arr = explode( '/', $str );

			$mm = $arr[ 0 ];
			$dd = $arr[ 1 ];
			$yy = $arr[ 2 ];

			return checkdate( $mm, $dd, $yy );
		}
		else {
			return false;
		}
	}
}

?>

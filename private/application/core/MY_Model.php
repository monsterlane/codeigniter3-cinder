<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Model extends CI_Model {
	protected $table = null;
	protected $parimary_key = 'id';

	public function __construct( ) {
		parent::__construct( );

		$this->_set_table( );
	}

	private function _set_table( ) {
		if ( $this->table === null ) {
			$this->table = strtolower( get_class( $this ) );
		}
	}
}

?>
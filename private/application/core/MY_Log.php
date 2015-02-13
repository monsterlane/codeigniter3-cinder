<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Log extends CI_Log {
	protected $_log_db;

	public function database( $available = false ) {
		$this->_log_db = $available;
	}

	public function write_log( $level, $msg ) {
		parent::write_log( $level, $msg );

		$level = strtoupper( $level );
		if ( ( !isset( $this->_levels[ $level ] ) || ( $this->_levels[ $level ] > $this->_threshold ) ) && !isset( $this->_threshold_array[ $this->_levels[ $level ] ] ) ) {
			return false;
		}

		if ( $this->_log_db === true ) {
			$ci =& get_instance( );
			$ci->load->library( 'error' );

			if ( strpos( $msg, 'Query error:' ) !== false ) {
				$ci->error->mysql( $msg );
			}
			else {
				$ci->error->php( $msg );
			}
		}
	}
}

?>
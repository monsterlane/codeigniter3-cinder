<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Log extends CI_Log {
	protected $_log_db = false;

	public function database( $available ) {
		$ci =& get_instance( );

		if ( $ci->config->item( 'log_database' ) === true && isset( $ci->db ) === true ) {
			$this->_log_db = $available;
		}
	}

	public function write_log( $level, $msg ) {
		$ret = parent::write_log( $level, $msg );

		$level = strtoupper( $level );

		if ( $this->_levels[ $level ] == 1 && $this->_log_db === true ) {
			$ci =& get_instance( );
			$ci->load->library( 'error' );

			if ( strpos( $msg, 'Query error:' ) !== false ) {
				$ci->error->mysql( $msg );
			}
			else {
				$ci->error->php( $msg );
			}
		}

		return $ret;
	}
}

?>
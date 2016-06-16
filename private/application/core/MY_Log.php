<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Log extends CI_Log {
	private $_database = false;

	/* public methods */

	public function database( $mode ) {
		$this->_database = $mode;
	}

	public function write_db( $data = array( ) ) {
		if ( $this->_database === true && isset( $ci->db ) === true ) {
			$ci =& get_instance( );
			$ci->load->model( 'error' );

			$ci->error->insert( $data );
		}
	}

	public function write_log( $level, $msg ) {
		$ret = parent::write_log( $level, $msg );

		$level = strtoupper( $level );

		if ( $this->_levels[ $level ] >= 1 ) {
			if ( strpos( $msg, 'Query error:' ) !== false ) {
				$error = trim( substr( $msg, 0, strpos( $msg, '- Invalid query' ) ) );
				$query = trim( substr( $msg, strpos( $msg, '- Invalid query' ) + 2 ) );

				$data = array(
					'error_type_id' => 2,
					'message' => $error . "\n" . $query,
				);

				$this->write_db( $data );
			}
			else if ( strpos( $msg, 'PHP error' ) !== false || strpos( $msg, 'Severity: Warning' ) !== false ) {
				if ( strpos( $msg, APPPATH ) !== false ) {
					$p1 = explode( APPPATH, $msg );
				}
				else {
					$p1 = explode( BASEPATH, $msg );
				}

				$p2 = explode( ' ', $p1[ 1 ] );

				$data = array(
					'error_type_id' => 1,
					'message' => trim( $p1[ 0 ] ),
					'filename' => trim( $p2[ 0 ] ),
					'line' => trim( $p2[ 1 ] ),
				);

				$this->write_db( $data );
			}
		}

		return $ret;
	}
}

?>

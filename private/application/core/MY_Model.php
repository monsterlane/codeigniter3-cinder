<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Model extends CI_Model {
	protected $table = null;
	protected $parimary_key = 'id';
	protected $defaults = array( );

	protected function get_defaults( ) {
		$data = array( );

		foreach ( $this->defaults as $key => $val ) {
			if ( $val === 'db|date' ) {
				$data[ $key ] = date( 'Y-m-d' );
			}
			else if ( $val === 'db|datetime' ) {
				$data[ $key ] = date( 'Y-m-d H:i:s' );
			}
			else if ( $val === 'user|ip' ) {
				$data[ $key ] = $_SERVER[ 'REMOTE_ADDR' ];
			}
			else {
				$data[ $key ] = $val;
			}
		}

		return $data;
	}

	public function insert( $data = array( ) ) {
		$data = merge_array( $this->get_defaults( ), $data );

		$this->db->insert( $this->table, $data );
	}
}

?>
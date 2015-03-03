<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Model extends CI_Model {
	protected $table = null;
	protected $columns = array( );
	protected $primary_key = null;
	protected $defaults = array( );
	protected $delete_flag = false;

	protected $hooks = array(
		'before_insert' => array( ),
		'after_insert' => array( ),
		'before_update' => array( ),
		'after_update' => array( ),
		'before_get' => array( ),
		'after_get' => array( ),
		'before_delete' => array( ),
		'after_delete' => array( ),
		'before_search' => array( ),
		'after_search' => array( ),
	);

	public function __construct( ) {
		parent::__construct( );

		$this->get_schema( );
	}

	/* shared methods */

	protected function get_schema( ) {
		if ( $this->table !== null ) {
			$results = $this->db->query( 'SHOW FULL COLUMNS FROM ' . $this->db->protect_identifiers( $this->table, true, null, false ) )->result_array( );

			foreach ( $results as $result ) {
				$this->columns[ $result[ 'Field' ] ] = array(
					'type' => $result[ 'Type' ],
					'null' => ( $result[ 'Null' ] === 'NO' ) ? false : true,
					'default' => $result[ 'Default' ],
					'extra' => $result[ 'Extra' ],
					'comment' => $result[ 'Comment' ],
				);

				if ( $result[ 'Key' ] === 'PRI' ) {
					$this->primary_key = $result[ 'Field' ];
				}
				else if ( $result[ 'Comment' ] === 'deleted' ) {
					$this->delete_flag = $result[ 'Field' ];
				}
			}
		}
	}

	protected function get_defaults( ) {
		$data = array( );

		foreach ( $this->columns as $key => $field ) {
			if ( $field[ 'null' ] === false ) {
				if ( $field[ 'type' ] === 'date' ) {
					$data[ $key ] = date( 'Y-m-d' );
				}
				else if ( $field[ 'type' ] === 'datetime' ) {
					$data[ $key ] = date( 'Y-m-d H:i:s' );
				}
				else if ( $field[ 'comment' ] === 'user|ip' ) {
					$data[ $key ] = $_SERVER[ 'REMOTE_ADDR' ];
				}
			}
		}

		return $data;
	}

	protected function hook( $key, $data = array( ) ) {
		if ( array_key_exists( $key, $this->hooks ) === true ) {
			foreach ( $this->hooks[ $key ] as $hook ) {
				$data = call_user_func( array( $this, $hook ) );
			}
		}

		return $data;
	}

	/* public methods */

	public function post( $data = array( ), $id = null ) {
		$data = merge_array( $this->input->post( ), $data );
		$data = extract_array( $data, $this->columns );

		if ( $id === null && array_key_exists( $this->primary_key, $data ) === true ) {
			$id = $data[ $this->primary_key ];
			unset( $data[ $this->primary_key ] );
		}

		if ( $id !== null ) {
			$data = $this->update( $data, $id );
		}
		else {
			$data = $this->insert( $data );
		}

		return $data;
	}

	public function insert( $data = array( ) ) {
		$data = $this->hook( 'before_insert', $data );
		$data = merge_array( $this->get_defaults( ), $data );

		$this->db->insert( $this->table, $data );
		$data[ 'id' ] = $this->db->insert_id( );

		$this->hook( 'after_insert', $data );

		return $this->get( $data[ 'id' ] );
	}

	public function update( $data = array( ), $id = null ) {
		$data = $this->hook( 'before_update', $data );

		$this->db->update( $this->table, $data, array( $this->primary_key => $id ) );

		$data[ $this->primary_key ] = $id;
		$this->db->hook( 'after_update', $data );

		return $this->db->get( $id );
	}

	public function get( $id = null ) {
		$this->hook( 'before_get', $id );

		$data =  $this->db->get_where( $this->table, array( $this->primary_key => $id ) )->row_array( );
		$data = $this->hook( 'after_get', $data );

		return $data;
	}

	public function delete( $id = null ) {
		$this->hook( 'before_delete', $id );

		if ( $this->delete_flag !== false ) {
			$this->db->update( $this->table, array( $this->delete_flag, 1 ), array( $this->primary_key => $id ) );
		}
		else {
			$this->db->delete( $this->table, array( $this->primary_key => $id ) );
		}

		$this->hook( 'after_delete', $id );

		return true;
	}

	public function search( $params = array( ) ) {
		$this->hook( 'before_search', $params );

		$data = $this->db->get_where( $this->table, $params )->result_array( );

		$data = $this->hook( 'after_search', $data );

		return $data;
	}
}

?>
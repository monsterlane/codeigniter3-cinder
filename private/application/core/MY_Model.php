<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Model extends CI_Model {
	protected $table = null;
	protected $columns = array( );
	protected $primary_key = null;
	protected $delete_flag = false;
	protected $defaults = array( );
	protected $validate = array( );

	protected $hooks = array(
		'before.insert' => array( ),
		'before.update' => array( ),
		'before.get' => array( ),
		'before.delete' => array( ),
		'before.search' => array( ),
		'after.insert' => array( ),
		'after.update' => array( ),
		'after.get' => array( ),
		'after.delete' => array( ),
		'after.search' => array( ),
	);

	public function __construct( ) {
		parent::__construct( );

		$this->get_schema( );
	}

	/* shared methods */

	protected function get_schema( ) {
		if ( $this->table !== null && isset( $this->db ) === true ) {
			$results = $this->db->query( 'SHOW FULL COLUMNS FROM ' . $this->db->protect_identifiers( $this->table, true, null, false ) )->result_array( );

			foreach ( $results as $result ) {
				if ( $result[ 'Key' ] === 'PRI' ) {
					$this->primary_key = $result[ 'Field' ];
				}

				$null = ( $result[ 'Null' ] === 'NO' ) ? false : true;
				$required = false;

				if ( $result[ 'Field' ] !== $this->primary_key && $null === false && $result[ 'Default' ] === null ) {
					$required = true;
				}

				$field = array(
					'name' => $result[ 'Field' ],
					'type' => $result[ 'Type' ],
					'null' => $null,
					'default' => $result[ 'Default' ],
					'required' => $required,
					'extra' => $result[ 'Extra' ],
					'comment' => $result[ 'Comment' ],
				);

				if ( $field[ 'comment' ] !== '' ) {
					$params = explode( '|', strtolower( $field[ 'comment' ] ) );

					foreach ( $params as $param ) {
						if ( strpos( $param, '=' ) !== false ) {
							$var = explode( '=', $param );

							if ( $var[ 0 ] === 'required' && (bool)$var[ 1 ] === true ) {
								$field[ 'required' ] = true;
							}
							else if ( $var[ 0 ] === 'deleted' && (bool)$var[ 1 ] === true ) {
								$this->delete_flag = true;
							}
							else if ( in_array( $var[ 0 ], array( 'default', 'name' ) ) === true ) {
								$field[ $var[ 0 ] ] = $var[ 1 ];
							}
						}
					}
				}

				if ( $field[ 'null' ] === false && $field[ 'default' ] === null ) {
					if ( in_array( $field[ 'type' ], array( 'date', 'datetime' ) ) === true ) {
						$field[ 'default' ] = $field[ 'type' ];
					}
				}

				if ( $field[ 'default' ] === null && $field[ 'required' ] === true ) {
					$this->validate[ ] = array(
						'field' => $result[ 'Field' ],
						'label' => $field[ 'name' ],
						'rules' => 'trim|required',
					);
				}

				$this->columns[ $result[ 'Field' ] ] = $field;
			}
		}
	}

	protected function get_defaults( ) {
		$data = array( );

		foreach ( $this->columns as $key => $field ) {
			if ( $field[ 'default' ] !== null ) {
				if ( $field[ 'default' ] === 'date' ) {
					$data[ $key ] = date( 'Y-m-d' );
				}
				else if ( $field[ 'default' ] === 'datetime' ) {
					$data[ $key ] = date( 'Y-m-d H:i:s' );
				}
				else if ( $field[ 'default' ] === 'userip' ) {
					$data[ $key ] = $_SERVER[ 'REMOTE_ADDR' ];
				}
				else {
					$data[ $key ] = $field[ 'default' ];
				}
			}
		}

		return $data;
	}

	protected function hook( $key, $data = array( ) ) {
		if ( array_key_exists( $key, $this->hooks ) === true ) {
			foreach ( $this->hooks[ $key ] as $hook ) {
				$data = call_user_func_array( array( $this, $hook ), array( $data ) );
			}
		}

		return $data;
	}

	/* public methods */

	public function get_validation_rules( ) {
		return $this->validate;
	}

	public function validate( $validator ) {
		$validator->set_rules( $this->validate );

		if ( $validator->run( ) === false ) {
			return false;
		}
		else {
			return true;
		}
	}

	public function post( $data = array( ), $id = null ) {
		$data = merge_array( $this->input->post( ), $data );

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
		$data = $this->hook( 'before.insert', $data );

		$data = merge_array( $this->get_defaults( ), $data );
		$data = extract_array( $data, $this->columns );

		$this->db->insert( $this->table, $data );
		$data[ 'id' ] = $this->db->insert_id( );

		$data = $this->hook( 'after.insert', $data );

		return $this->get( $data[ 'id' ] );
	}

	public function update( $data = array( ), $id = null ) {
		$data = $this->hook( 'before.update', $data );

		$data = extract_array( $data, $this->columns );

		if ( $id === null && array_key_exists( $this->primary_key, $data ) === true ) {
			$id = $data[ $this->primary_key ];
			unset( $data[ $this->primary_key ] );
		}

		$this->db->update( $this->table, $data, array( $this->primary_key => $id ) );

		$data[ $this->primary_key ] = $id;

		$data = $this->db->hook( 'after.update', $data );

		return $this->db->get( $id );
	}

	public function get( $id = null ) {
		$id = $this->hook( 'before.get', $id );

		$data = $this->db->get_where( $this->table, array( $this->primary_key => $id ) )->row_array( );

		$data = $this->hook( 'after.get', $data );

		return $data;
	}

	public function delete( $id = null ) {
		$id = $this->hook( 'before.delete', $id );

		if ( $this->delete_flag !== false ) {
			$this->db->update( $this->table, array( $this->delete_flag, 1 ), array( $this->primary_key => $id ) );
		}
		else {
			$this->db->delete( $this->table, array( $this->primary_key => $id ) );
		}

		$id = $this->hook( 'after.delete', $id );

		return true;
	}

	public function search( $params = array( ) ) {
		$params = $this->hook( 'before.search', $params );

		$data = $this->db->get_where( $this->table, $params )->result_array( );

		$data = $this->hook( 'after.search', $data );

		return $data;
	}
}

?>
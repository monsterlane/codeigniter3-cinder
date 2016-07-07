<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Model extends CI_Model {
	protected $_table = null;
	protected $_columns = array( );
	protected $_primary_key = null;
	protected $_delete_flag = false;
	protected $_validate = array( );

	protected $_hooks = array(
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
		if ( $this->_table !== null ) {
			$results = $this->db->query( 'SHOW FULL COLUMNS FROM ' . $this->db->protect_identifiers( $this->_table, true, null, false ) )->result_array( );

			foreach ( $results as $result ) {
				if ( $result[ 'Key' ] === 'PRI' ) {
					$this->_primary_key = $result[ 'Field' ];
				}

				$null = ( $result[ 'Null' ] === 'NO' ) ? false : true;
				$required = false;

				if ( $result[ 'Field' ] !== $this->_primary_key && $null === false && $result[ 'Default' ] === null ) {
					$required = 'trim|required';
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
					$params = explode( "\n", strtolower( $field[ 'comment' ] ) );

					foreach ( $params as $param ) {
						if ( strpos( $param, '=' ) !== false ) {
							$var = explode( '=', $param );

							if ( $var[ 0 ] === 'required' ) {
								$field[ 'required' ] = $var[ 1 ];

								if ( strpos( $field[ 'required' ], 'required' ) === false ) {
									$field[ 'required' ] .= '|required';
								}
							}
							else if ( $var[ 0 ] === 'deleted' && (bool)$var[ 1 ] === true ) {
								$this->_delete_flag = true;
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

				if ( $field[ 'default' ] === null && $field[ 'required' ] !== false ) {
					$this->_validate[ ] = array(
						'field' => $result[ 'Field' ],
						'label' => $field[ 'name' ],
						'rules' => $field[ 'required' ],
					);
				}

				$this->_columns[ $result[ 'Field' ] ] = $field;
			}
		}
	}

	protected function get_defaults( ) {
		$data = array( );

		foreach ( $this->_columns as $key => $field ) {
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

	protected function set_defaults( $data = array( ) ) {
		return merge_array( $this->get_defaults( ), $data );
	}

	protected function hook( $key, $data = array( ) ) {
		if ( array_key_exists( $key, $this->_hooks ) === true ) {
			foreach ( $this->_hooks[ $key ] as $hook ) {
				$data = call_user_func_array( array( $this, $hook ), array( $data ) );
			}
		}

		return $data;
	}

	protected function extract( $data = array( ) ) {
		$keys = array_keys( $this->_columns );

		return extract_array( $data, $keys );
	}

	/* public methods */

	public function get_validation_rules( ) {
		return $this->_validate;
	}

	public function validate( $validator ) {
		$validator->set_rules( $this->_validate );

		if ( $validator->run( ) === false ) {
			return false;
		}
		else {
			return true;
		}
	}

	public function post( $data = array( ), $id = null ) {
		$data = merge_array( $this->input->post( ), $data );

		if ( $id === null && array_key_exists( $this->_primary_key, $data ) === true ) {
			$id = $data[ $this->_primary_key ];
			unset( $data[ $this->_primary_key ] );
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

		$data = $this->set_defaults( $data );
		$data = $this->extract( $data );

		$this->db->insert( $this->_table, $data );
		$data[ 'id' ] = $this->db->insert_id( );

		$data = $this->hook( 'after.insert', $data );

		return $this->get( $data[ 'id' ] );
	}

	public function update( $data = array( ), $id = null ) {
		$data = $this->hook( 'before.update', $data );

		$data = $this->extract( $data );

		if ( $id === null && array_key_exists( $this->_primary_key, $data ) === true ) {
			$id = $data[ $this->_primary_key ];
			unset( $data[ $this->_primary_key ] );
		}

		$this->db->update( $this->_table, $data, array( $this->_primary_key => $id ) );

		$data[ $this->_primary_key ] = $id;

		$data = $this->db->hook( 'after.update', $data );

		return $this->db->get( $id );
	}

	public function get( $id = null ) {
		$id = $this->hook( 'before.get', $id );

		$data = $this->db->get_where( $this->_table, array( $this->_primary_key => $id ) )->row_array( );

		$data = $this->hook( 'after.get', $data );

		return $data;
	}

	public function delete( $id = null ) {
		$id = $this->hook( 'before.delete', $id );

		if ( $this->_delete_flag !== false ) {
			$this->db->update( $this->_table, array( $this->_delete_flag, 1 ), array( $this->_primary_key => $id ) );
		}
		else {
			$this->db->delete( $this->_table, array( $this->_primary_key => $id ) );
		}

		$id = $this->hook( 'after.delete', $id );

		return true;
	}

	public function search( $params = array( ) ) {
		$params = $this->hook( 'before.search', $params );

		$data = $this->db->get_where( $this->_table, $params )->result_array( );

		$data = $this->hook( 'after.search', $data );

		return $data;
	}
}

?>

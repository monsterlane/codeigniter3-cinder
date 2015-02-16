<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Error {
	public function javascript( $data = array( ) ) {
		$ci =& get_instance( );

		if ( $ci->config->item( 'log_database' ) === true && isset( $ci->db ) === true ) {
			$data = clean_array( $ci->input->post( ) );
			$data = extract_array( $data, array( 'message', 'filename', 'line' ) );

			$data[ 'error_type_id' ] = 2;
			$data[ 'ip_address' ] = $_SERVER[ 'REMOTE_ADDR' ];
			$data[ 'created_datetime' ] = date( 'Y-m-d H:i:s' );

			$ci->db->insert( 'error', $data );
		}
	}

	public function php( $message = 'PHP error' ) {
		$ci =& get_instance( );

		if ( $ci->config->item( 'log_database' ) === true && isset( $ci->db ) === true ) {
			$p1 = explode( APPPATH, $message );
			$p2 = explode( ' ', $p1[ 1 ] );

			$message = trim( $p1[ 0 ] );
			$filename = trim( $p2[ 0 ] );
			$line = trim( $p2[ 1 ] );

			$data = array(
				'error_type_id' => 1,
				'message' => $message,
				'filename' => $filename,
				'line' => $line,
				'ip_address' => $_SERVER[ 'REMOTE_ADDR' ],
				'created_datetime' => date( 'Y-m-d H:i:s' ),
			);

			$ci->db->insert( 'error', $data );
		}
	}

	public function mysql( $message = 'Query error' ) {
		$ci =& get_instance( );

		if ( $ci->config->item( 'log_database' ) === true && isset( $ci->db ) === true ) {
			$query = substr( $message, 0, strpos( $message, '- Invalid query' ) );
			$query = trim( $query );

			$invalid = substr( $message, strpos( $message, '- Invalid query' ) + 2 );
			$invalid = trim( $invalid );

			$message = $query . "\n" . $invalid;

			$data = array(
				'error_type_id' => 3,
				'message' => $message,
				'ip_address' => $_SERVER[ 'REMOTE_ADDR' ],
				'created_datetime' => date( 'Y-m-d H:i:s' ),
			);

			$ci->db->insert( 'error', $data );
		}
	}
}

?>

<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Output extends CI_Output {
	public function json( $data = array( ) ) {
		$this->set_output( json_encode( $data ) );
	}

	public function minify( $output ) {
		if ( strlen( $output ) === 0 ) {
			return '';
		}

		$size_before = strlen( $output );

		if ( $output[ 0 ] === '{' || $output[ 0 ] === '[' ) {
			$json = json_decode( $output );

			if ( json_last_error( ) === JSON_ERROR_NONE && is_object( $json ) === true ) {
				if ( property_exists( $json, 'data' ) === true && is_object( $json->data ) === true && property_exists( $json->data, 'view' ) === true && is_object( $json->data->view ) === true && property_exists( $json->data->view, 'html' ) === true && is_string( $json->data->view->html ) === true ) {
					$json->data->view->html = preg_replace( '/(?:(?<=\>)|(?<=\/\>))(\s+)(?=\<\/?)/', '', $json->data->view->html );

					$output = json_encode( $json );
				}
			}
			else {
				$output = preg_replace( '/(?:(?<=\>)|(?<=\/\>))(\s+)(?=\<\/?)/', '', $output );
			}
		}
		else {
			$output = preg_replace( '/(?:(?<=\>)|(?<=\/\>))(\s+)(?=\<\/?)/', '', $output );
		}

		$size_removed = $size_before - strlen( $output );
		$savings_percent = round( ( $size_removed / $size_before ) * 100 );

		log_message( 'debug', 'Minifier shaved ' . ( $size_removed / 1000 ) . 'KB (' . $savings_percent . '%) off final HTML output.' );

		return $output;
	}
}

?>
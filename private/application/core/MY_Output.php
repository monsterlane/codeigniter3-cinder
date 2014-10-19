<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Output extends CI_Output {
	public function minify( $output, $type = 'text/html' ) {
		if ( $type == 'text/html' ) {
			if ( strlen( $output ) === 0 ) {
				return '';
			}

			$size_before = strlen( $output );

			if ( $output[ 0 ] == '{' || $output[ 0 ] == '[' ) {
				$json = json_decode( $output );

				if ( json_last_error( ) == JSON_ERROR_NONE ) {
					if ( is_object( $json ) && property_exists( $json, 'view' ) ) {
						$json->view = preg_replace( '/(?:(?<=\>)|(?<=\/\>))(\s+)(?=\<\/?)/', '', $json->view );
					}

					$output = json_encode( $json );
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
		}
		else {
			$output = parent::minify( $output, $type );
		}

		return $output;
	}
}

?>
<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function boot( ) {
	$ci =& get_instance( );
	$ci->log->database( $ci->config->item( 'log_database' ) );

	$https = false;
	if ( isset( $_SERVER[ 'HTTPS' ] ) && $_SERVER[ 'HTTPS' ] == 'on' ) {
		$https = true;
	}
	elseif ( ( empty( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) === false && $_SERVER[ 'HTTP_X_FORWARDED_PROTO' ] == 'https' ) || ( empty( $_SERVER[ 'HTTP_X_FORWARDED_SSL' ] ) === false && $_SERVER[ 'HTTP_X_FORWARDED_SSL' ] === 'on' ) ) {
		$https = true;
	}

	if ( $ci->config->item( 'maintenance' ) === true && $ci->router->directory !== 'maintenance/' ) {
		$ci->redirect( 'maintenance' );
	}
	else if ( $ci->get_option( 'require_auth' ) === true && $ci->session->userdata( 'authenticated' ) !== true && $ci->router->class !== $ci->router->login_controller ) {
		if ( $ci->router->class !== 'error_controller' ) {
			$ci->session->set_userdata( 'previous_page', str_replace( '_controller', '', $ci->router->class ) );
		}

		$ci->session->set_flashdata( 'message', 'You have been signed out due to inactivity.' );

		$ci->redirect( str_replace( '_controller', '', $ci->router->login_controller ) );
	}
	else if ( $ci->get_option( 'require_https' ) === true && $https === false ) {
		$ci->redirect( str_replace( 'http:', 'https:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'require_https' ) === false && $https === true ) {
		$ci->redirect( str_replace( 'https:', 'http:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'boot' ) === true ) {
		$ci->boot( );
	}
}

?>

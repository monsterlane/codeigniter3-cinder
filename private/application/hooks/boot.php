<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function boot( ) {
	$ci =& get_instance( );
	$ci->log->database( $ci->config->item( 'log_database' ) );

	if ( $ci->config->item( 'maintenance' ) === true && $ci->router->directory !== 'maintenance/' ) {
		$ci->redirect( 'maintenance' );
	}
	else if ( $ci->get_option( 'require_auth' ) === true && $ci->session->userdata( 'authenticated' ) !== true && $ci->router->class !== $ci->router->login_controller ) {
		$ci->session->set_userdata( 'previous_page', str_replace( '_controller', '', $ci->router->class ) );

		$ci->redirect( str_replace( '_controller', '', $ci->router->login_controller ) );
	}
	else if ( $ci->get_option( 'require_ssl' ) === true && empty( $_SERVER[ 'HTTPS' ] ) === true ) {
		$ci->redirect( str_replace( 'http:', 'https:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'require_ssl' ) === false && empty( $_SERVER[ 'HTTPS' ] ) === false ) {
		$ci->redirect( str_replace( 'https:', 'http:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'boot' ) === true ) {
		$ci->boot( );
	}
}

?>
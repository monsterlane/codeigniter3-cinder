<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function boot( ) {
	$ci =& get_instance( );
	$ci->log->loaded( true );

	if ( $ci->config->item( 'maintenance' ) === true && $ci->router->directory !== 'maintenance/' ) {
		$ci->redirect( 'maintenance' );
	}
	else if ( $ci->get_option( 'enforce_ssl' ) === true && empty( $_SERVER[ 'HTTPS' ] ) === true ) {
		$ci->redirect( str_replace( 'http:', 'https:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'enforce_ssl' ) === false && empty( $_SERVER[ 'HTTPS' ] ) === false ) {
		$ci->redirect( str_replace( 'https:', 'http:', current_url( ) ) );
	}
	else if ( $ci->get_option( 'boot' ) === true ) {
		$ci->boot( );
	}
}

?>
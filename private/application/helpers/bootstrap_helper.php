<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

function bootstrap_success( $msg ) {
	return '<div class="alert alert-success" role="alert">' . $msg . '</div>';
}

function bootstrap_info( $msg ) {
	return '<div class="alert alert-info" role="alert">' . $msg . '</div>';
}

function bootstrap_warning( $msg ) {
	return '<div class="alert alert-warning" role="alert">' . $msg . '</div>';
}

function bootstrap_error( $msg ) {
	return '<div class="alert alert-danger" role="alert">' . $msg . '</div>';
}

?>

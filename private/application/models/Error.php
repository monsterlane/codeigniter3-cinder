<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Error extends MY_Model {
	protected $table = 'error';

	protected $defaults = array(
		'ip_address' => 'user|ip',
		'created_datetime' => 'db|datetime',
	);
}

?>

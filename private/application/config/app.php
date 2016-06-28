<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

$config['version'] = '0.8.11';
$config['verbose'] = false;
$config['log_database'] = true;
$config['maintenance'] = false;

$config['require_auth'] = true;
$config['require_https'] = true;

$config['default_container'] = '#cinderModule';
$config['validation_container'] = 'div.purpose-validation';
$config['flashdata_container'] = 'div.purpose-flashdata';

$config['support_address'] = 'support@domain.com';
$config['support_message'] = 'Please refresh the page, if the problem persists please contact <a href="' . $config['support_address'] . '">support</a>.';

$config['files_file_path'] = FCPATH . 'files/';
$config['files_web_path'] = '/files/';

?>

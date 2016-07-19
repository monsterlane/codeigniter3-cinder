<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

$config['version'] = '0.9.1';
$config['verbose'] = false;
$config['log_database'] = true;
$config['maintenance'] = false;

$config['require_auth'] = true;
$config['require_https'] = true;

$config['default_container'] = '#cinderModule';
$config['validation_container'] = 'div.purpose-validation';
$config['flashdata_container'] = 'div.purpose-flashdata';

$config['support_name'] = 'App Team';
$config['support_email'] = 'support@domain.com';
$config['support_message'] = 'Please refresh the page, if the problem persists please contact <a href="' . $config['support_email'] . '">support</a>.';

$config['cache_file_path'] = FCPATH . 'files/cache/';
$config['cache_web_path'] = '/files/cache/';

$config['temp_file_path'] = FCPATH . 'files/temp/';
$config['temp_web_path'] = '/files/temp/';

?>

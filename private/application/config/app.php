<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

$config['maintenance_mode'] = false;

$config['default_container'] = '#cinderBodyArea';

$config['support_address'] = 'support@appdomain.com';
$config['support_message'] = 'Please refresh the page, if the problem persists please contact <a href="' . $config['support_address'] . '">support</a>.';

$config['files_file_path'] = FCPATH . 'files/';
$config['files_web_path'] = '/files/';

$config['cache_file_path'] = FCPATH . 'files/cache/';
$config['cache_web_path'] = '/files/cache/';

?>

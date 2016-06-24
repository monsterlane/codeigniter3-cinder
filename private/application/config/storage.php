<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

$config['storage_access_key'] = '';
$config['storage_secret_key'] = '';
$config['storage_region'] = 'us-east-1';
$config['storage_prefix'] = 'cr-';
$config['storage_web_path'] = '//s3.amazonaws.com/' . $config[ 'storage_prefix' ] . ENVIRONMENT . '/';

?>

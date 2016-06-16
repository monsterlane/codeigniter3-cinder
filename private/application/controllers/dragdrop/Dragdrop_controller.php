<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Dragdrop_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		$this->set_option( 'require_auth', true );
	}

	/* public methods */

	public function index( ) {
		$this->load->partial( array(
			'title' => 'Drag/drop',
			'view' => array(
				'js' => array(
					'module.js',
					'system/js/upload.js',
				),
				'data' => array(
					'title' => 'Drag/drop upload class example',
					'body' => 'Drag a file into the dotted area.'
				),
			),
		) );
	}

	public function upload( ) {
		$this->load->library( 'upload' );
		$this->load->helper( 'upload' );

		$config = array(
			'upload_path' => $this->config->item( 'files_file_path' ) . 'photos',
			'allowed_types' => 'gif|jpg|jpeg|png',
			'max_width' => 1000,
			'max_height' => 1000,
		);

		$this->upload->initialize( $config );

		if ( $this->upload->do_upload( ) === true ) {
			$file = $this->upload->data( );

			$data = array(
				'status' => true,
				'message' => $file[ 'file_name' ] . ' was uploaded successfully.',
			);
		}
		else {
			$data = array(
				'status' => false,
				'message' => strip_tags( $this->upload->display_errors( ) ),
			);
		}

		$this->set_data( 'module.data', $data );
	}
}

?>

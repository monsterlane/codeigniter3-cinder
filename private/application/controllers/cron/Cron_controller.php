<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Cron_controller extends MY_Controller {
	private $_start;
	private $_end;
	private $_cli;
	private $_lb;

	public function __construct( ) {
		parent::__construct( );

		if ( $this->input->is_cli_request( ) === true ) {
			$this->_cli = true;
			$this->_lb = "\n";
		}
		else {
			$this->_cli = false;
			$this->_lb = '<br/>';
		}

		$this->_message( 'CRON started' );

		if ( $this->_cli === false ) {
			$this->output->append_output( '<hr/>' );
		}

		$this->_start = time( );
	}

	/* internal methods */

	private function _done( ) {
		$this->_end = time( );

		if ( $this->_cli === false ) {
			$this->output->append_output( '<hr/>' );
		}

		$this->_message( 'CRON completed' );
	}

	private function _message( $str ) {
		$this->output->append_output( '[' . date( 'Y-m-d H:i:s' ) . '] ' . $str . $this->_lb );
	}

	/* public methods */

	public function job( ) {
		$this->_message( 'Doing something...' );

		$this->_done( );
	}
}

?>

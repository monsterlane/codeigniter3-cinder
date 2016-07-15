<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Migrations_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		$url = $this->uri->uri_string( );

		if ( ENVIRONMENT !== 'development' ) {
			if ( ENVIRONMENT === 'production' ) {
				if ( $this->config->item( 'maintenance' ) === true ) {
					if ( $url !== 'migrations/maintenance' ) {
						$this->redirect( 'migrations/maintenance' );
					}
				}
				else if ( $url === 'migrations/maintenance' ) {
					$this->redirect( 'migrations' );
				}
			}
			else if ( ENVIRONMENT === 'testing' ) {
				if ( $this->session->userdata( 'authenticated' ) !== true ) {
					if ( $url !== 'migrations/maintenance' ) {
						$this->redirect( 'migrations/maintenance' );
					}
				}
				else if ( $url === 'migrations/maintenance' ) {
					$this->redirect( 'migrations' );
				}
			}
		}
		else if ( $url === 'migrations/maintenance' ) {
			$this->redirect( 'migrations' );
		}
	}

	/* public methods */

	public function index( ) {
		$this->session->sess_write_close( );

		$this->load->library( 'migration' );

		$migrations = $this->migration->get_migrations( );
		$current_id = $this->migration->get_current_id( );

		$invalid_id = true;
		foreach ( $migrations as $version_id => $files ) {
			foreach ( $files as $file ) {
				if ( $file[ 'id' ] === $current_id ) {
					$invalid_id = false;

					break 2;
				}
			}
		}

		$this->load->partial( array(
			'title' => 'Database Migrations',
			'view' => array(
				'data' => array(
					'title' => 'Database Migrations',
					'environment' => ENVIRONMENT,
					'timestamp' => date( 'YmdHis' ),
					'invalid_id' => $invalid_id,
					'current_id' => $current_id,
					'branch_id' => $this->migration->get_branch_id( ),
					'migrations' => $migrations,
				),
			),
		) );
	}

	public function current( ) {
		$this->session->sess_write_close( );

		$this->load->library( 'migration' );

		$version = $this->migration->current( );

		if ( $version === false ) {
			$data = array(
				'status' => false,
				'message' => $this->migration->error_string( ),
			);
		}
		else {
			if ( $version === true ) {
				$version = $this->migration->get_current_id( );
			}

			$data = array(
				'status' => true,
				'current_id' => $version,
				'message' => 'You are now using the default branch version.',
			);
		}

		$this->set_data( 'module.data', $data );
	}

	public function version( $version_id ) {
		$this->session->sess_write_close( );

		$this->load->library( 'migration' );

		$version = $this->migration->version( $version_id );

		if ( $version === false ) {
			$data = array(
				'status' => false,
				'message' => $this->migration->error_string( ),
			);
		}
		else {
			if ( $version === true ) {
				$message = 'You are now using the default branch version.';

				$version = $this->migration->get_current_id( );
			}
			else if ($version === $this->migration->get_current_id( ) ) {
				$message = 'You are now using the default branch version.';
			}
			else {
				$message = 'You are now using version ' . $version . '.';
			}

			$data = array(
				'status' => true,
				'current_id' => $version,
				'message' => $message,
			);
		}

		$this->set_data( 'module.data', $data );
	}

	public function maintenance( ) {
		$this->session->sess_write_close( );

		$this->load->partial( array(
			'title' => 'Database Migrations',
			'view' => array(
				'data' => array(
					'title' => 'Database Migrations',
					'body' => 'Migrations are only available while the app is in maintenance mode.',
				),
			),
		) );
	}
}

?>

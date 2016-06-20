<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Migrations_controller extends MY_Controller {
	public function __construct( ) {
		parent::__construct( );

		$url = $this->uri->uri_string( );

		if ( ENVIRONMENT != 'development' ) {
			if ( ENVIRONMENT == 'production' ) {
				if ( $this->config->item( 'maintenance' ) === true ) {
					if ( $url != 'migrations/maintenance' ) {
						$this->redirect( 'migrations/maintenance' );
					}
				}
				else if ( $url == 'migrations/maintenance' ) {
					$this->redirect( 'migrations' );
				}
			}
			else if ( ENVIRONMENT == 'testing' ) {
				if ( $this->session->userdata( 'authenticated' ) !== true ) {
					if ( $url != 'migrations/maintenance' ) {
						$this->redirect( 'migrations/maintenance' );
					}
				}
				else if ( $url == 'migrations/maintenance' ) {
					$this->redirect( 'migrations' );
				}
			}
		}
		else if ( $url == 'migrations/maintenance' ) {
			$this->redirect( 'migrations' );
		}
	}

	/* public methods */

	public function index( ) {
		$this->load->library( 'migration' );

		// TODO check if current_id exists in list of migrations
		// <p class="error">You are running an unknown version for this branch. Migrations have been blocked to prevent erroneous database changes.<br/><br/>Switch back to the last branch you made database changes from and select the base version.</p>

		$this->load->partial( array(
			'title' => 'Database Migrations',
			'view' => array(
				'data' => array(
					'title' => 'Database Migrations',
					'environment' => ENVIRONMENT,
					'timestamp' => date( 'YmdHis' ),
					'current_id' => $this->migration->get_current_id( ),
					'branch_id' => $this->migration->get_branch_id( ),
					'migrations' => $this->migration->get_migrations( ),
				),
			),
		) );
	}

	public function current( ) {
		$this->load->library( 'migration' );

		// TODO run over ajax

		$version = $this->migration->current( );

		if ( $version == false ) {
			$this->session->set_flashdata( 'message', '<p class="error">' . $this->migration->error_string( ) . '</p>' );
		}
		else {
			$this->session->set_flashdata( 'message', '<p class="success">You are now using the default branch version.</p>' );
		}

		$this->redirect( 'migrations' );
	}

	public function version( $version_id ) {
		$this->load->library( 'migration' );

		// TODO run over ajax

		$version = $this->migration->version( $version_id );

		if ( $version == false ) {
			$this->session->set_flashdata( 'message', '<p class="error">' . $this->migration->error_string( ) . '</p>' );
		}
		else {
			$this->session->set_flashdata( 'message', '<p class="success">You are now using version ' . $version . '.</p>' );
		}

		$this->redirect( 'migrations' );
	}

	public function maintenance( ) {
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

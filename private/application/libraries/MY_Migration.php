<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class MY_Migration extends CI_Migration {
	/* overloaded methods */

	public function find_migrations( ) {
		$migrations = array( );

		foreach ( glob( $this->_migration_path . '*/*_*.php' ) as $file ) {
			$name = basename( $file, '.php' );

			if ( preg_match( $this->_migration_regex, $name ) ) {
				$number = $this->_get_migration_number( $name );

				if ( array_key_exists( $number, $migrations ) == true ) {
					$this->_error_string = sprintf( $this->lang->line( 'migration_multiple_version' ), $number );

					show_error( $this->_error_string );
				}

				$migrations[ $number ] = $file;
			}
		}

		ksort( $migrations );

		return $migrations;
	}

	/* public methods */

	public function get_current_id( ) {
		$result = $this->db->get( $this->_migration_table )->row_array( );

		return (int)$result[ 'version' ];
	}

	public function get_branch_id( ) {
		return $this->_migration_version;
	}

	public function get_migrations( ) {
		$migrations = $this->find_migrations( );
		$results = array( );

		foreach ( $migrations as $version_id => $name ) {
			$path = explode( '/', $name );

			$name = array_pop( $path );
			$name = str_replace( $version_id . '_', '', $name );
			$name = str_replace( '.php', '', $name );
			$name = str_replace( '_', ' ', $name );

			$version = array_pop( $path );

			if ( array_key_exists( $version, $results ) == false ) {
				$results[ $version ] = array( );
			}

			$results[ $version ][ ] = array(
				'id' => $version_id,
				'name' => $name,
			);
		}

		krsort( $results, SORT_NATURAL );

		return $results;
	}
}

?>

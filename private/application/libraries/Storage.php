<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

require_once( APPPATH . 'third_party/aws/aws-autoloader.php' );

use GuzzleHttp\Promise;

class Storage {
	private $_sdk;
	private $_connection;
	private $_secret_key;
	private $_access_key;
	private $_region;
	private $_bucket;

	public function __construct( $config = array( ) ) {
		$this->_secret_key = $config[ 'storage_secret_key' ];
		$this->_access_key = $config[ 'storage_access_key' ];
		$this->_region = $config[ 'storage_region' ];

		$this->_bucket = $this->get_default_bucket( );

		$this->_connect( );
	}

	/* internal methods */

	private function _connect( ) {
		$this->_sdk = new Aws\Sdk([
			'version' => 'latest',
			'region'  => $this->_region,
			'credentials' => array(
				'key' => $this->_access_key,
				'secret' => $this->_secret_key,
			),
		]);

		$this->_connection = $this->_sdk->createS3( );
	}

	/* sdk methods */

	public function __call( $name, $args ) {
		if ( empty( $args ) === false ) {
			$this->_connection->$name( $args[ 0 ] );
		}
		else {
			$this->_connection->$name( );
		}
	}

	public function get_connection( ) {
		return $this->_connection;
	}

	/* container methods */

	public function get_bucket( ) {
		return $this->_bucket;
	}

	public function get_default_bucket( ) {
		return 'py-' . ( ENVIRONMENT == 'testing' ? 'staging' : ENVIRONMENT );
	}

	public function get_buckets( ) {
		$request = $this->_connection->listBuckets( );
		$results = array( );

		foreach ( $request[ 'Buckets' ] as $bucket ) {
			$results[ ] = array(
				'name' => $bucket[ 'Name' ],
				'created_datetime' => $bucket[ 'CreationDate' ]->format( 'Y-m-d H:i:s' ),
			);
		}

		return $results;
	}

	public function set_bucket( $bucket = null ) {
		if ( $bucket != null ) {
			$this->_bucket = $bucket;
		}
	}

	public function get_contents( ) {
		$request = $this->_connection->listObjects([
			'Bucket' => $this->_bucket,
		]);

		foreach ( $request[ 'Contents' ] as $file ) {
			$results[ ] = array(
				'key' => $file[ 'Key' ],
				'size' => $file[ 'Size' ],
			);
		}

		return $results;
	}

	public function get_directory_size( $path = null ) {
		$done = false;
		$marker = '';
		$size = 0;

		while ( $done == false ) {
			$request = $this->_connection->listObjects([
				'Bucket' => $this->_bucket,
				'Marker' => $marker,
				'Prefix' => $path,
			]);

			if ( $request !== false ) {
				foreach ( $request[ 'Contents' ] as $file ) {
					$marker = $file[ 'Key' ];
					$size += $file[ 'Size' ];
				}

				if ( $request[ 'IsTruncated' ] == false ) {
					$done = true;
				}
			}
			else {
				$done = true;
			}
		}

		if ( $size > 1073741824 ) {
			$size = number_format( $size / 1073741824, 2 ) . 'gb';
		}
		else if ( $size > 1048576 ) {
			$size = number_format( $size / 1048576, 2 ) . 'mb';
		}
		else {
			$size = number_format( $size / 1024, 2 ) . 'kb';
		}

		return $size;
	}

	/* object methods */

	public function file_exists( $path = null ) {
		$result = $this->_connection->listObjects([
			'Bucket' => $this->_bucket,
			'Prefix' => $path,
		]);

		return ( $result[ 'Contents' ] !== null ) ? true : false;
	}

	public function get( $path = null ) {
		$result = $this->_connection->getObject([
			'Bucket' => $this->_bucket,
			'Key' => $path,
		]);

		if ( $result[ '@metadata' ][ 'statusCode' ] == 200 ) {
			$result[ 'Content' ] = $result[ 'Body' ]->getContents( );
		}

		return $result;
	}

	public function get_batch( $files = array( ) ) {
		$results = array( );

		foreach ( $files as $file ) {
			$results[ ] = $this->get( $file );
		}

		return $results;
	}

	public function put( $path = null, $content = null ) {
		$result = $this->_connection->putObject([
			'Bucket' => $this->_bucket,
			'Key' => $path,
			'Body' => $content,
		]);

		if ( $result[ '@metadata' ][ 'statusCode' ] == 200 ) {
			return true;
		}
		else {
			return false;
		}
	}

	public function delete( $path = null ) {
		$result = $this->_connection->deleteObject([
			'Bucket' => $this->_bucket,
			'Key' => $path,
		]);

		if ( $result[ '@metadata' ][ 'statusCode' ] == 200 ) {
			return true;
		}
		else {
			return false;
		}
	}

	public function copy( $path = null, $dest = null ) {
		if ( $this->file_exists( $path ) == true ) {
			$result = $this->_connection->copyObject([
				'Bucket' => $this->_bucket,
				'CopySource' => $this->_bucket . '/' . $path,
				'Key' => $dest,
			]);

			if ( $result[ '@metadata' ][ 'statusCode' ] == 200 ) {
				return true;
			}
			else {
				return false;
			}

		}
		else {
			return false;
		}
	}

	public function move( $path = null, $dest = null ) {
		$result = $this->copy( $path, $dest );

		if ( $result == true ) {
			return $this->delete( $path );
		}
		else {
			return false;
		}
	}

	public function download( $path = null, $filename = null ) {
		$ci =& get_instance( );
		$ci->load->helper( 'download' );

		$file = $this->get( $path );

		if ( $filename == null ) {
			$parts = explode( '/', $file[ '@metadata' ][ 'effectiveUri' ] );

			$filename = array_pop( $parts );
		}

		force_download( $filename, $file[ 'Content' ] );
	}

	public function download_zip( $files = array( ), $filename = 'files.zip' ) {
		$client = $this->_connection;
		$bucket = $this->_bucket;
		$data = array( );

		$promiseGenerator = function( ) use ( $client, $bucket, $files ) {
			foreach ( $files as $file ) {
				yield $client->getObjectAsync([
					'Bucket' => $bucket,
					'Key' => $file[ 'path' ],
				]);
			}
		};

		$fulfilled = function( $result ) use( $bucket, &$data ) {
			if ( $result[ '@metadata' ][ 'statusCode' ] == 200 ) {
				$key = str_replace( 'https://s3.amazonaws.com/' . $bucket . '/', '', $result[ '@metadata' ][ 'effectiveUri' ] );

				$data[ $key ] = $result[ 'Body' ]->getContents( );
			}
		};

		$rejected = function( $reason ) { };

		$promises = $promiseGenerator( count( $files ) );

		$each = Promise\each_limit( $promises, 50, $fulfilled, $rejected );
		$each->wait( );

		$path = tempnam( 'tmp', 'zip' );

		$zip = new ZipArchive;
		$zip->open( $path, ZipArchive::OVERWRITE );

		foreach ( $files as $file ) {
			$zip->addFromString( $file[ 'name' ], $data[ $file[ 'path' ] ] );
		}

		$zip->close( );

		header( 'Cache-Control: no-cache, must-revalidate' );
		header( 'Expires: Sat, 10 Dec 1993 12:00:00 GMT' );
		header( 'Content-Disposition: attachment; filename="' . $filename . '"' );
		header( 'Content-Type: application/zip' );
		header( 'Content-Length: ' . filesize( $path ) );
		header( 'Set-Cookie: fileDownload=true; path=/' );

		readfile( $path );

		unlink( $path );
	}
}

?>

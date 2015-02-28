<?php if ( !defined( 'BASEPATH' ) ) exit( 'No direct script access allowed' );

class Dom {
	private $_doc;

	public function load( $html ) {
		$this->_doc = new DOMDocument;
		$this->_doc->loadHTML( $html );
	}

	public function find( $selector, $node = null ) {
		$selector = $this->css_to_xpath( $selector );

		$xpath = new DOMXPath( $this->_doc );

		if ( $node !== null ) {
			$result = $xpath->query( $selector, $node );
		}
		else {
			$result = $xpath->query( $selector );
		}

		return $result;
	}

	public function css_to_xpath( $selector ) {
		// TODO
	}
}

?>

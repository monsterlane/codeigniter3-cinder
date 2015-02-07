
require.config({
	baseUrl: '/files/cache',
	map: {
		'*': {
			'css': 'system/js/require.css.min'
		}
	},
	paths: {
		'domready': 'system/js/require.domready.min',
		'jquery': 'system/js/jquery.min',
		'jclass': 'system/js/jclass.min'
	},
	urlArgs: Date.now( )
});

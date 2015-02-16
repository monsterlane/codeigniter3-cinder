
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
		'helpers': 'system/js/jquery.helpers',
		'jclass': 'system/js/jclass.min'
	}
});

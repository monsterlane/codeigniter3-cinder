
require.config({
	baseUrl: '/files/cache',
	map: {
		'*': {
			'css': 'system/js/require.css.min'
		}
	},
	paths: {
		domready: 'system/js/require.domready.min',
		font: 'system/js/require.webfont',
		jquery: 'system/js/jquery.min',
		plugins: 'system/js/jquery.plugins',
		jclass: 'system/js/jclass.min',
		parser: 'system/js/dot.min',
		upload: 'system/js/upload'
	}
});


define.amd.dust = true;

require.config({
	baseUrl: '/files/cache',
	map: {
		'*': {
			'css': 'system/js/require.css.min'
		}
	},
	paths: {
		bootstrap: 'system/js/bootstrap.min',
		domready: 'system/js/require.domready.min',
		dust: 'system/js/dust.core.min',
		font: 'system/js/require.webfont',
		jclass: 'system/js/jclass.min',
		jquery: 'system/js/jquery.min',
		plugins: 'system/js/jquery.plugins',
		timer: 'system/js/timer'
	},
	shim: {
		bootstrap: {
			deps: [ 'jquery' ]
		}
	}
});

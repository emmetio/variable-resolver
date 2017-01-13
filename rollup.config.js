export default {
	entry: './index.js',
	targets: [
		{format: 'cjs', dest: 'dist/variable-resolver.cjs.js'},
		{format: 'es',  dest: 'dist/variable-resolver.es.js'}
	]
};

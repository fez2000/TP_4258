<style lang="css">
	@import './annotationLayer.module.css';
</style>
<script>

	import componentFactory from '@/fonctions/pdf/componentFactory';
	import pdfjsWrapper from '@/fonctions/pdf/pdfjsWrapper';

	var PDFJS = require('pdfjs-dist/build/pdf.js');

	if ( process.env.VUE_ENV !== 'server' ) {

		if ( typeof window !== 'undefined' && 'Worker' in window ) {

			var PdfjsWorker = require('worker-loader!pdfjs-dist/build/pdf.worker.js');
			PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker();
		}
	}

	var component = componentFactory(pdfjsWrapper(PDFJS));
	component.PDFJS = PDFJS;

	export default component;

</script>
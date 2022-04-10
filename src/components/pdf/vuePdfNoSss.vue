
<script>

	import componentFactory from '@/fonctions/pdf/componentFactory.js'
	import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.js' ;
	if ( process.env.VUE_ENV !== 'server' ) {

		var pdfjsWrapper = require('@/fonctions/pdf/pdfjsWrapper.js').default;
	

		if ( typeof window !== 'undefined' && 'Worker' in window && navigator.appVersion.indexOf('MSIE 10') === -1 ) {

			var PdfjsWorker = require('worker-loader!pdfjs-dist/build/pdf.worker.js');
			PDFJS.GlobalWorkerOptions.workerPort = new PdfjsWorker();
		}

		var component = componentFactory(pdfjsWrapper(PDFJS));
	} else {

		var component = componentFactory({});
	}

	export default component;
</script>
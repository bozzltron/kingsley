const wiki = require('wikipedia');



(async () => {
	try {
		const summary = await wiki.summary('Joe Biden');
		console.log(summary);
		//Response of type @wikiSummary - contains the intro and the main image
	} catch (error) {
		console.log(error);
		//=> Typeof wikiError
	}
})();
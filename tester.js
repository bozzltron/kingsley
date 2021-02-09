var unirest = require("unirest");

var req = unirest("GET", "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI");

req.query({
	"q": "taylor swift",
	"pageNumber": "1",
	"pageSize": "10",
	"autoCorrect": "true",
	"fromPublishedDate": "null",
	"toPublishedDate": "null"
});

req.headers({
	"x-rapidapi-key": process.env.API_KEY,
	"x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(JSON.stringify(res.body,2,2));
});

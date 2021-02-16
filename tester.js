var unirest = require("unirest");

var req = unirest("GET", "https://google-search3.p.rapidapi.com/api/v1/search/q=I'mcapital+police+vote+of+no+confidence&num=5");

req.headers({
	"x-rapidapi-key": process.env.API_KEY,
	"x-rapidapi-host": "google-search3.p.rapidapi.com",
	"useQueryString": true
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});

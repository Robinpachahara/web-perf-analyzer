var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var crypto = require('crypto');
var parallel = require('async').parallel;
var lodash = require('lodash');

var tests = {};

// Clearing file and memory every 24hrs
setInterval(function() {
	tests = {};
	fs.writeFile('alltests.txt', "", function() {
	});
}, 24 * 60 * 60 * 1000);

// Self-certified local server
var options = {
	key : fs.readFileSync('server.key'),
	cert : fs.readFileSync('server.crt')
};

function httpGetParallelArgFactory(site, times) {
	console.log('site', site)
	var host = url.parse(site).host;
	var opts = {
		host : host,
		path : '/'
	};
	var parallelArg = [];
	for (var i = 0; i < times; i++) {
		parallelArg.push(function(cb) {
			var start = process.hrtime();
			http.get(opts, function(response) {
				response.on('data', function(data) {
				});
				response.on('end', function() {
					cb(null, process.hrtime(start)[1] * 1.e-6);
				});
			});
		});
	}
	return parallelArg;
}

function test(sites, times) {
	var pendingParallelArg = [];
	for (var i = 0; i < sites.length; i++) {
		var site = sites[i];
		(function(site) {
			pendingParallelArg.push(function(cb) {
				var startTestTime = +new Date();
				parallel(httpGetParallelArgFactory(site, times), function(err,
						results) {
					var endTestTime = +new Date();
					console.log("printing results", site, times, results);
					var max = lodash.max(results);
					var min = lodash.min(results);
					var avg = lodash.sum(results) / times;
					cb(null, {
						site : site,
						avg : avg,
						max : max,
						min : min,
						startTestTime : startTestTime,
						endTestTime : endTestTime,
						iterations : times
					});
				});
			});
		})(site);
	}
	return pendingParallelArg;
}
https.createServer(
		options,
		function(req, res) {
			var path = url.parse(req.url).pathname;
			var urlParams = url.parse(req.url, true).query;
			var status = 200;
			console.log("Current Path: ", path, req.method);
			if (req.method == "POST" && path == "/startTest") {
				var jsonData = "";
				var parsedJsonData;
				var testHandle = crypto.randomBytes(5).toString('hex');
				var response = {
					status : 'started',
					testHandle : testHandle
				};
				tests[testHandle] = {
					status : 'started',
					result : []
				};
				req.on("data", function(data) {
					jsonData += data;
				});
				req.on("end", function() {
					console.log(JSON.parse(jsonData));
					parsedJsonData = JSON.parse(jsonData);
					parallel(test(parsedJsonData.sitesToTest,
							parsedJsonData.iterations), function(err, results) {
						console.log(testHandle);
						console.log(results);
						tests[testHandle].status = 'finished';
						tests[testHandle].result = results;
						fs.appendFile('alltests.txt', JSON.stringify({
							testHandle : testHandle,
							result : tests[testHandle].result
						}), function() {
						});
					});
				});
			} else if (req.method == "GET" && path == "/testStatus") {
				var response = {
					status : tests[urlParams.testHandle].status,
					testHandle : urlParams.testHandle
				};
			} else if (req.method == "GET" && path == "/testResults") {
				if (tests[urlParams.testHandle].status == "finished") {
					var response = tests[urlParams.testHandle].result;
				} else {
					status = 400;
					var response = {};
				}
			} else if (req.method == "GET" && path == "/allTests") {
				var response = {
					handles : Object.keys(tests)
				};
			} else {
				status = 404;
				console.log("in default", path);
			}
			res.writeHead(status);
			res.end(JSON.stringify(response));
		}).listen(8000);

var lp = require('./');
var repeat = require('repeat-function');
var assert = require('assert');

describe('Linear Partitioning', function () {

	var ar = [1,2,3,4,5,6,7,8,9];

	it('should work with just 1s', function () {
		assert.deepEqual(lp([1,1,1,1,1,1,1,1,1], 3), [[1,1,1],[1,1,1],[1,1,1]]);
	});

	it('should work with 1..9', function () {
		assert.deepEqual(lp(ar, 3), [[1,2,3,4,5],[6,7],[8,9]]);
	})

	it('should work with 0 buckets', function() {
		assert.deepEqual(lp(ar, 0), []);
	})

	it('should work with more buckets than the size of the list', function() {
		assert.deepEqual(lp([1,2,3], 4), [[1],[2],[3],[]]);
	})

	it('runs on a bunch of random floats', function() {
		lp(repeat(56, Math.random), 33);
	});

});

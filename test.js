var lp = require('./');
var repeat = require('repeat-function');
var assert = require('assert');
var coffee_partition = require('./alternate_implementations_for_testing/partition.js');

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

	// See: https://github.com/the-swerve/linear-partitioning/issues/1 
	var weird_example = [0.5759878419452887, 1.0425531914893618, 0.8064516129032258, 0.7072135785007072, 0.3473336479471449, 0.6665, 2, 1.5066339066339067, 0.6408364083640836, 0.9742647058823529, 0.5703373647358371, 0.8057142857142857, 0.6533333333333333, 1.501466275659824, 0.6713333333333333, 1.393939393939394, 1.7777777777777777, 2.7015873015873018, 0.8764044943820225, 1.5005861664712778, 0.6323333333333333, 0.8166666666666667, 0.6666666666666666, 0.7692307692307693, 0.736875, 1.3333333333333333, 0.8301610541727672, 0.75, 0.7936507936507936, 0.5167322834645669, 0.7545126353790613, 0.7692307692307693, 0.707635009310987, 2, 0.6666666666666666, 0.7368055555555556, 0.74, 0.6614583333333334, 0.7692307692307693, 1.5060240963855422, 0.653, 1.7760416666666667, 1.5060240963855422, 1.3212435233160622, 0.9815157116451017, 0.6214833759590793, 1.3333333333333333, 0.8771929824561403, 0.7173601147776184, 0.6666666666666666, 0.8896797153024911, 1, 0.7604562737642585, 0.67, 1.5, 0.6521885521885522];

	var coffee_result = coffee_partition(weird_example, 33);
	var actual_result = lp(weird_example, 33);

	it('should have less than or equal the maximum bucket sum of the coffeescript version for the weird example', function() {
		var sum = function(ns) { return ns.reduce(function(sum, n) {return sum + n;}) };
		var coffee_max_sum = Math.max.apply(Math, coffee_result.map(sum));
		var our_max_sum    = Math.max.apply(Math, actual_result.map(sum));

		assert.equal(our_max_sum <= coffee_max_sum, true);
	});

	it('should match the result of the coffeescript version on the weird example', function() {
		assert.deepEqual(actual_result, coffee_result);
	});

	it('should match the result of the coffeescript version on a bunch of random floats', function() {
		var rand = repeat(56, Math.random);
		var ours = lp(rand, 33);
		var coff = coffee_partition(rand, 33);
		assert.deepEqual(ours, coff);
	});

});


// Explanation: http://www8.cs.umu.se/kurser/TDBAfl/VT06/algorithms/BOOK/BOOK2/NODE45.HTM

var range = require('range-function');
var repeat = require('repeat-function');

// Partition seq into k buckets

var partition = function(seq, k) {

	if (k == 0) return [];
	if (k == 1) return [seq];

	if (k >= seq.length) {
		// return the lists of each single element in sequence, plus empty lists for any extra buckets.
		return seq.map(function(x) { return [x]; }).concat(repeat(k - seq.length, []));
	}

	var seq = seq.slice(0);
	var dividers = [];
	sums = prefix_sums(seq, k);
	conds = boundary_conditions(seq, k, sums);

	// evaluate main recurrence
	range(2, seq.length, 'inclusive').map(function(i) {
		range(2, k, 'inclusive').map(function(j) {

			conds[i][j] = undefined;

			range(1, i-1, 'inclusive').map(function(x) {

				s = Math.max(conds[x][j-1], sums[i] - sums[x]);
				dividers[i] = dividers[i] || []; // Initialize a new row in the dividers matrix (unless it's already initialized).

				// Continue to find the cost of the largest range in the optimal partition.
				if (conds[i][j] == undefined || conds[i][j] > s) {
					conds[i][j] = s;
					dividers[i][j] = x;
				}

			});
		});
	});

	return(reconstruct_partition(seq, dividers, k, []));
};

/* Work our way back up through the dividers, referencing each divider that we
 * saved given a value for k and a length of seq, using each divider to make
 * the partitions. */
var reconstruct_partition = function(seq, dividers, k, partitions) {
	partitions = [];

	while (k > 1) {
		if (dividers[seq.length]) { 
			var divider = dividers[seq.length][k];
			var part = seq.splice(divider);
			partitions.unshift(part);
		}
		--k;
	}

	partitions.unshift(seq);

	return partitions;
};

/*
Given a list of numbers of length n, loop through it with index 'i'
Make each element the sum of all the numbers from 0...i
For example, given [1,2,3,4,5]
The prefix sums are [1,3,6,10,15]
*/
var prefix_sums = function(seq, k) {

	sums = [0];

	range(1, seq.length, 'inclusive').map(function(i) {
		sums[i] = sums[i - 1] + seq[i - 1];
	});

	return sums;
};

/* This matrix holds the maximum sums over all the ranges given the length of
 * seq and the number of buckets (k) */
var boundary_conditions = function(seq, k, sums) {
	conds = [];

	range(1, seq.length, 'inclusive').map(function(i) {
		conds[i] = [];
		conds[i][1] = sums[i];
	});

	range(1, k, 'inclusive').map(function(j) {
		conds[1][j] = seq[0];
	});

	return conds;
};

module.exports = partition;

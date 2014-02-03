
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("linear-partitioning/linear-partitioning.js", function(exports, require, module){
// Explanation: http://www8.cs.umu.se/kurser/TDBAfl/VT06/algorithms/BOOK/BOOK2/NODE45.HTM

// Partition seq into k buckets


var partition = function (seq, k) {

	if (k === 0) return [];
	if (k === 1) return [seq];

	if (k >= seq.length) {
		// return the lists of each single element in sequence, plus empty lists for any extra buckets.
		var repeated =  [];
		for (var q = 0; q < k - seq.length; ++q) repeated.push([]);
		return seq.map(function(x) { return [x]; }).concat(repeated);
	}

	var sequence = seq.slice(0);
	var dividers = [];
	var sums = prefix_sums(sequence, k);
	var conds = boundary_conditions(sequence, k, sums);

	// evaluate main recurrence
	for(var i = 2; i <= sequence.length; ++i) {
		for(var j = 2; j <= k; ++j) {

			conds[i][j] = undefined;

			for(var x = 1; x < i; ++x) {

				var s = Math.max(conds[x][j-1], sums[i] - sums[x]);
				dividers[i] = dividers[i] || []; // Initialize a new row in the dividers matrix (unless it's already initialized).

				// Continue to find the cost of the largest range in the optimal partition.
				if (conds[i][j] === undefined || conds[i][j] > s) {
					conds[i][j] = s;
					dividers[i][j] = x;
				}

			}
		}
	}

	return(reconstruct_partition(sequence, dividers, k));
};

/* Work our way back up through the dividers, referencing each divider that we
 * saved given a value for k and a length of seq, using each divider to make
 * the partitions. */
var reconstruct_partition = function(seq, dividers, k) {
	var partitions = [];

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
var prefix_sums = function(seq) {

	var sums = [0];

	for(var i = 1; i <= seq.length; ++i) {
		sums[i] = sums[i - 1] + seq[i - 1];
	}

	return sums;
};

/* This matrix holds the maximum sums over all the ranges given the length of
 * seq and the number of buckets (k) */
var boundary_conditions = function(seq, k, sums) {
	var conds = [];

	for(var i = 1; i <= seq.length; ++i) {
		conds[i] = [];
		conds[i][1] = sums[i];
	}

	for(var j = 1; j <= k; ++j) {
		conds[1][j] = seq[0];
	}

	return conds;
};

module.exports = partition;

});
require.alias("linear-partitioning/linear-partitioning.js", "linear-partitioning/index.js");
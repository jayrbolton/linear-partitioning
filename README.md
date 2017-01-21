# linear partitioning

Input: given an array of S non-negative numbers and an integer k (the number of partitions we want)

Output: Partition S into k ranges, so as to minimize the maximum sum over all the ranges. 

```js
var partition = require('linear-partitioning');

partition([1,2,3,4,5,6,7,8,9], 3);
// returns  [[1,2,3,4,5], [6,7], [8,9]]
```

See http://www8.cs.umu.se/kurser/TDBAfl/VT06/algorithms/BOOK/BOOK2/NODE45.HTM


## development

Run tests with `npm run test` or `tape test | faucet`

Run benchmarks with `node benchmarks`

#### benchmarks

This library was a re-implementation of a horrendous coffeescript function that people used to use. Here are benchmark results when compared to that older implementation:

```
Winner: ours
Compared with next highest (coffeescript), it's:
91.73% faster
12.09 times as fast
1.08 order(s) of magnitude faster
A LOT FASTER
```

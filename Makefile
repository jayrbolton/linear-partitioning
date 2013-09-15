test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter spec \
		--ui bdd

clean:
	@rm -rf node_modules

compile:
	@coffee --compile --bare cs/linear_partition.coffee

.PHONY: test clean

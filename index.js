'use strict';

const pEachSeries = async (iterable, iterator) => {
	let index = 0;

	for (const value of iterable) {
		// eslint-disable-next-line no-await-in-loop
		await iterator(await value, index++);
	}

	return iterable;
};

module.exports = pEachSeries;
module.exports.default = pEachSeries;

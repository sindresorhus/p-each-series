import test from 'ava';
import delay from 'delay';
import timeSpan from 'time-span';
import pEachSeries from '.';

const fixtureError = new Error('fixture');

test('main', async t => {
	let currentIndex = 0;
	const delayMs = 100;
	const end = timeSpan();
	const input = [Promise.resolve(1), 2, 3, Promise.resolve(4)];

	const result = await pEachSeries(input, async (value, index) => {
		t.is(value, index + 1);
		t.is(currentIndex, index);
		currentIndex++;

		// Ensure it can also return non-Promise values
		if (index === 0) {
			return 'foo';
		}

		await delay(delayMs);

		return 'foo';
	});

	t.deepEqual(result, input);
	t.true(end() > (delayMs - 20));
});

test('rejection input rejects the promise', async t => {
	await t.throwsAsync(pEachSeries([1, Promise.reject(fixtureError)], () => {}), fixtureError.message);
});

test('handles empty iterable', async t => {
	t.deepEqual(await pEachSeries([]), []);
});

test('allows stopping midway through', async t => {
	const iteratedItems = [];

	await pEachSeries([
		'a',
		'b',
		'c',
		'd'
	], value => {
		iteratedItems.push(value);

		if (value === 'c') {
			return pEachSeries.stop;
		}
	});

	t.deepEqual(iteratedItems, ['a', 'b', 'c']);
});

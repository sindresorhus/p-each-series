import test from 'ava';
import delay from 'delay';
import timeSpan from 'time-span';
import m from './';

const fixtureErr = new Error('fixture');

test('main', async t => {
	let index = 0;
	const ms = 100;
	const end = timeSpan();
	const input = [Promise.resolve(1), 2, 3, Promise.resolve(4)];

	const val = await m(input, async (x, i) => {
		t.is(x, i + 1);
		t.is(index, i);
		index++;

		// ensure it can also return non-Promise values
		if (i === 0) {
			return 'foo';
		}

		await delay(ms);

		return 'foo';
	});

	t.deepEqual(val, input);
	t.true(end() > (ms - 20));
});

test('rejection input rejects the promise', async t => {
	t.throws(m([1, Promise.reject(fixtureErr)], () => {}), fixtureErr.message);
});

test('handles empty iterable', async t => {
	t.deepEqual(await m([]), []);
});

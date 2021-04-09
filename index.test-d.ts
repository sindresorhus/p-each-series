import {expectType} from 'tsd';
import pEachSeries from './index.js';

const keywords = [Promise.resolve('foo'), 'rainbow', 'pony'];

expectType<Promise<string[]>>(
	pEachSeries(keywords, value => {
		expectType<string>(value);
		return false;
	})
);
expectType<Promise<string[]>>(
	pEachSeries(keywords, async value => {
		expectType<string>(value);
		return false;
	})
);
expectType<Promise<string[]>>(
	pEachSeries(new Set(keywords), async value => {
		expectType<string>(value);
		return false;
	})
);

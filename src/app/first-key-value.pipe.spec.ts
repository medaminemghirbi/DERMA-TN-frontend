import { FirstKeyValuePipe } from './first-key-value.pipe';

describe('FirstKeyValuePipe', () => {
  it('create an instance', () => {
    const pipe = new FirstKeyValuePipe();
    expect(pipe).toBeTruthy();
  });
});

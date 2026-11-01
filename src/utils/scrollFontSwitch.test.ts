import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  crossedScrollBand,
  getScrollSide,
} from './scrollFontSwitch';

describe('scroll font switch dead zone', () => {
  const deadZone = 72;

  it('treats small movements around the reading line as neutral', () => {
    const start = getScrollSide(8, deadZone);
    const nudgedAcross = getScrollSide(-16, deadZone);

    assert.equal(start, 0);
    assert.equal(nudgedAcross, 0);
    assert.equal(crossedScrollBand(start, nudgedAcross), false);
  });

  it('does not shuffle when a heading first leaves the neutral zone', () => {
    const neutral = getScrollSide(10, deadZone);
    const settledOnLeft = getScrollSide(-78, deadZone);

    assert.equal(neutral, 0);
    assert.equal(settledOnLeft, -1);
    assert.equal(crossedScrollBand(neutral, settledOnLeft), false);
  });

  it('shuffles only after travelling from one stable side to the other', () => {
    const right = getScrollSide(90, deadZone);
    const insideBand = getScrollSide(20, deadZone);
    const left = getScrollSide(-90, deadZone);

    assert.equal(right, 1);
    assert.equal(insideBand, 0);
    assert.equal(left, -1);
    assert.equal(crossedScrollBand(right, left), true);
  });

  it('does not retrigger while remaining on the same side', () => {
    const first = getScrollSide(90, deadZone);
    const stillRight = getScrollSide(140, deadZone);

    assert.equal(crossedScrollBand(first, stillRight), false);
  });
});

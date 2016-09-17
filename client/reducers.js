import update from 'react-addons-update';
import { findIndex, map, some, reject, cloneDeep } from 'lodash';

export function addInstrumentToSong(prev, instrument) {
  const sequencerIdx = findIndex(prev.song.sequencers, s => s.id == instrument.sequencerId);

  // This will be called twice when we're notified of our own mutations
  if (some(prev.song.sequencers[sequencerIdx].instruments, i => i.id == instrument.id)) {
    return prev;
  }

  return update(prev, {
    song: {
      sequencers: {
        [sequencerIdx]: {
          instruments: {
            $unshift: [instrument],
          },
        },
      },
    },
  });
}

export function updateInstrumentInSong(prev, newInstrument) {
  let next = cloneDeep(prev);

  next.song.sequencers.forEach(sequencer => {
    sequencer.instruments.forEach((instrument, index) => {
      if (instrument.id == newInstrument.id) {
        sequencer.instruments[index] = newInstrument;
      }
    });
  });

  return next;
}

export function deleteInstrumentFromSong(prev, instrument) {
  let next = cloneDeep(prev);

  next.song.sequencers.forEach(sequencer => {
    sequencer.instruments = reject(sequencer.instruments, i => i.id == instrument.id);
  });

  return next;
}

export function addSequencerToSong(prev, sequencer) {
  // This will be called twice when we're notified of our own mutations
  if (some(prev.song.sequencers, s => s.id == sequencer.id)) {
    return prev;
  }

  return update(prev, { song: { sequencers: { $unshift: [sequencer] } } });
}

export function updateSequencerInSong(prev, newSequencer) {
  let next = cloneDeep(prev);

  next.song.sequencers.forEach((sequencer, index) => {
    if (sequencer.id == newSequencer.id) {
      next.song.sequencers[index] = newSequencer;
    }
  });

  return next;
}

export function deleteSequencerFromSong(prev, sequencer) {
  let next = cloneDeep(prev);

  next.song.sequencers = reject(next.song.sequencers, s => s.id == sequencer.id);

  return next;
}

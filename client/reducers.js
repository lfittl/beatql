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

export function deleteInstrumentFromSong(prev, instrument) {
  const deletedId = instrument.id;
  let next = cloneDeep(prev);

  prev.song.sequencers.forEach(sequencer => {
    sequencer.instruments = reject(sequencer.instruments, instrument => instrument.id == deletedId);
  });

  return prev;
}

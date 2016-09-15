INSERT INTO songs (song_id, tempo) VALUES ('00c60941-3c2f-4935-b2f3-589b4594d302', 190);

INSERT INTO sequencers (sequencer_id, song_id, resolution, bars) VALUES
('0b63f696-61ab-4350-997e-3c6d0a26c31c', '00c60941-3c2f-4935-b2f3-589b4594d302', 16, 2);
INSERT INTO instruments (sequencer_id, instrument_type, data) VALUES
('0b63f696-61ab-4350-997e-3c6d0a26c31c', 'Sampler', '{ "sample": "samples/kick.wav", "steps": [0, 4, 14] }');
INSERT INTO instruments (sequencer_id, instrument_type, data) VALUES
('0b63f696-61ab-4350-997e-3c6d0a26c31c', 'Sampler', '{ "sample": "samples/snare.wav", "steps": [8, 24] }');

INSERT INTO sequencers (sequencer_id, song_id, resolution, bars) VALUES
('c299f600-939e-4cab-94dc-16746740cb59', '00c60941-3c2f-4935-b2f3-589b4594d302', 16, 4);
INSERT INTO instruments (sequencer_id, instrument_type, data) VALUES
('c299f600-939e-4cab-94dc-16746740cb59', 'Sampler', '{ "sample": "samples/hihat.wav",
  "steps": [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60] }');

INSERT INTO sequencers (sequencer_id, song_id, resolution, bars) VALUES
('58ac51bb-4a88-476d-b7df-130c801f2b90', '00c60941-3c2f-4935-b2f3-589b4594d302', 16, 8);
INSERT INTO instruments (sequencer_id, instrument_type, data) VALUES
('58ac51bb-4a88-476d-b7df-130c801f2b90', 'Synth', '{ "type": "sawtooth", "volume": 15,
  "envelope": { "attack": 0.01, "sustain": 0.2, "decay": 0, "release": 0.1 },
  "steps": [ [0, 2, "a#2"], [4, 2, "a#2"], [8, 1, "a#3"], [10, 1, "a#3"], [12, 1, "a#3"],
  [14, 1, "a#3"], [16, 2, "g#2"], [20, 2, "g#2"], [24, 1, "g#3"], [26, 1, "g#3"], [28, 1, "g#3"],
  [30, 1, "g#3"], [32, 2, "f#2"], [36, 2, "f#2"], [40, 1, "f#3"], [42, 1, "f#3"], [44, 1, "f#3"],
  [46, 1, "f#3"], [48, 2, "d#2"], [52, 2, "d#2"], [56, 1, "d#3"], [58, 1, "d#3"], [60, 1, "d#3"],
  [62, 1, "d#3"], [64, 8, "a#2"], [72, 8, "a#3"], [80, 8, "g#2"], [88, 8, "g#3"], [96, 8, "f#2"],
  [104, 8, "f#3"], [112, 8, "d#2"], [120, 8, "d#3"] ] }');

INSERT INTO sequencers (sequencer_id, song_id, resolution, bars) VALUES
('314805ef-8cc7-41c8-bd33-d7120504309b', '00c60941-3c2f-4935-b2f3-589b4594d302', 16, 4);
INSERT INTO instruments (sequencer_id, instrument_type, data) VALUES
('314805ef-8cc7-41c8-bd33-d7120504309b', 'Synth', '{ "type": "sine", "volume": 40,
  "envelope": { "attack": 0.1, "sustain": 0.5, "decay": 0, "release": 1 },
  "steps": [ [0, 1, "a#1"], [16, 1, "g#1"], [32, 1, "f#1"], [48, 1, "d#1"] ] }');

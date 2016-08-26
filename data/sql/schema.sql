CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS songs(
  song_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  tempo integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sequencers(
  sequencer_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  song_id uuid NOT NULL,
  resolution integer NOT NULL,
  bars integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instruments(
  instrument_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  sequencer_id uuid NOT NULL,
  instrument_type text NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE INDEX ON sequencers(song_id);
CREATE INDEX ON instruments(sequencer_id);

CREATE OR REPLACE FUNCTION notify_changes() RETURNS TRIGGER AS $$
  DECLARE
    data json;
    payload json;
  BEGIN
    IF (TG_OP = 'DELETE') THEN
        data = row_to_json(OLD);
    ELSE
        data = row_to_json(NEW);
    END IF;

    payload = json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'data', data);

    PERFORM pg_notify('changes', payload::text);

    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER instrument_changes AFTER INSERT OR UPDATE OR DELETE ON instruments FOR EACH ROW EXECUTE PROCEDURE notify_changes();
CREATE TRIGGER sequencer_changes AFTER INSERT OR UPDATE OR DELETE ON sequencers FOR EACH ROW EXECUTE PROCEDURE notify_changes();
CREATE TRIGGER song_changes AFTER INSERT OR UPDATE OR DELETE ON songs FOR EACH ROW EXECUTE PROCEDURE notify_changes();

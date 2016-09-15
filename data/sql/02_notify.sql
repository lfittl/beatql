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

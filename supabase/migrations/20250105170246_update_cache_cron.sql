create extension pg_cron with schema pg_catalog;

grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create extension if not exists pg_net;

-- Function to be called every 30 mins
create or replace function update_cache() returns void as
$$
begin
    perform net.http_post(
            url := 'https://52b4-71-89-13-105.ngrok-free.app/api/cache',
            headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization',
                                          'Bearer ' || 'ECQvifre5MIeFbFafT9UTP_70p4yjKBST3ifPT0Y_pM'),
            timeout_milliseconds := 60000
        );
end;
$$ language plpgsql;

-- Cron Job name cannot be edited
select cron.schedule('update-drive-cache', '* * * * *', 'CALL update_cache()');

select cron.alter_job(
  job_id := (select jobid from cron.job where jobname = 'update-drive-cache'),
  schedule := '0 * * * *'
);


create type photo_type as enum ('live', 'portrait', 'festival');

create table drive_cache
(
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now(),
    drive_created_at timestamptz not null,
    drive_id         text primary key,
    page             photo_type  not null,
    name             text        not null,
    thumbnail_link   text        not null,
    parent_folder_id text        not null,
    width            integer     not null,
    height           integer     not null,
    image_metadata   jsonb       not null
);

alter table drive_cache
    enable row level security;

create function update_updated_at() returns trigger as
$$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_updated_at
    before update
    on drive_cache
    for each row
execute function update_updated_at();
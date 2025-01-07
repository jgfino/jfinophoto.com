create type photo_page as enum ('live', 'portrait', 'festival');

create table photos
(
    created_at           timestamptz  not null default now(),
    updated_at           timestamptz  not null default now(),

    drive_id             text       not null,
    page                 photo_page not null,
    primary key (drive_id, page),

    path                 text[]     not null,
    parent_folder_id     text       not null,
    thumbnail_link       text       not null,
    thumbnail_updated_at timestamptz  not null,

    width                integer    not null,
    height               integer    not null,

    position             serial     not null
);

alter table photos
    enable row level security;

create or replace function update_updated_at() returns trigger as
$$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_updated_at
    before update
    on photos
    for each row
execute function update_updated_at();


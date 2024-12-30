create type photo_page as enum ('live', 'portrait', 'festival');

create table photos
(
    created_at           timestamp  not null default now(),
    updated_at           timestamp  not null default now(),

    drive_id             text       not null,
    page                 photo_page not null,
    primary key (drive_id, page),

    path                 text[]     not null,
    parent_folder_id     text       not null,
    thumbnail_link       text       not null,
    thumbnail_updated_at timestamp  not null,

    width                integer    not null,
    height               integer    not null,

    position             integer    not null
);

alter table photos
    enable row level security;

-- Grid ordering

create or replace function handle_insert_order() returns trigger as
$$
begin
    update photos
    set position = position + 1
    where position >= new.position
      and page = new.page;

    return new;
end;
$$ language plpgsql security definer;

create trigger handle_insert_order
    before insert
    on photos
    for each row
execute function handle_insert_order();

create or replace function handle_delete_order() returns trigger as
$$
begin
    update photos
    set position = position - 1
    where position > old.position
      and page = old.page;

    return old;
end;
$$ language plpgsql;

create trigger handle_delete_order
    after delete
    on photos
    for each row
execute function handle_delete_order();

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


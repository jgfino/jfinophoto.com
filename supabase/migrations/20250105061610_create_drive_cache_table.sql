create table drive_cache
(
    type       photo_page primary key,
    data       text      not null,
    created_at timestamptz not null default now()
);

alter table drive_cache enable row level security;
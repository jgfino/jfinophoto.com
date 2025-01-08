create table portfolio
(
    created_at timestamptz not null default now(),
    photo      text        not null references drive_cache (drive_id),
    page       photo_type  not null,

    primary key (photo, page)
);

alter table portfolio
    enable row level security;

create trigger update_updated_at
    before update
    on portfolio
    for each row
execute function update_updated_at();


create table profiles (
    id uuid references auth.users(id) primary key,
    name text not null
);

alter table profiles enable row level security;
-- Execute este arquivo UMA vez no SQL Editor depois de schema.sql.
create table if not exists public.room_games (
  room_code text primary key references public.game_rooms(code) on delete cascade,
  players jsonb not null default '[]'::jsonb,
  current_player integer not null default 0,
  round integer not null default 1,
  floor text not null default 'wood',
  difficulty text not null default 'easy',
  score jsonb not null default '{}'::jsonb,
  board jsonb not null default '{}'::jsonb,
  phase text not null default 'waiting' check (phase in ('waiting','turn','moving','finished')),
  updated_at timestamptz not null default now()
);
alter table public.room_games enable row level security;
create policy "partidas visíveis" on public.room_games for select using (true);
create policy "partidas criáveis" on public.room_games for insert with check (true);
create policy "partidas atualizáveis" on public.room_games for update using (true) with check (true);
alter publication supabase_realtime add table public.room_games;


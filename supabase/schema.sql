-- Execute este arquivo no SQL Editor do projeto Supabase antes de publicar o lobby global.
create table if not exists public.game_rooms (
  code text primary key check (char_length(code) between 4 and 8),
  host_name text not null,
  active_players jsonb not null default '[]'::jsonb,
  spectators jsonb not null default '[]'::jsonb,
  challenge_queue jsonb not null default '[]'::jsonb,
  status text not null default 'waiting' check (status in ('waiting','playing')),
  updated_at timestamptz not null default now()
);

alter table public.game_rooms enable row level security;

-- Protótipo sem autenticação: qualquer visitante pode ver e atualizar salas.
-- Troque por políticas ligadas a Supabase Auth antes de uma publicação pública ampla.
create policy "salas visíveis" on public.game_rooms for select using (true);
create policy "salas criáveis" on public.game_rooms for insert with check (true);
create policy "salas atualizáveis" on public.game_rooms for update using (true) with check (true);

alter publication supabase_realtime add table public.game_rooms;

-- Uma partida ativa por sala. O cliente publica apenas eventos; este registro é
-- a fonte de verdade que todos os jogadores e espectadores reproduzem.
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

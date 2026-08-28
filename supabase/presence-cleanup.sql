-- Execute uma vez no Supabase SQL Editor.
alter table public.game_rooms
  add column if not exists member_presence jsonb not null default '{}'::jsonb;

-- Remove salas que não recebem qualquer sinal há mais de 12 horas.
-- A limpeza individual dos membros acontece no navegador a cada atualização.
create or replace function public.cleanup_abandoned_rooms()
returns void language sql as $$
  delete from public.game_rooms
  where updated_at < now() - interval '12 hours';
$$;


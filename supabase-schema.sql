-- photos テーブル作成
create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  storage_url text not null,
  taken_at timestamptz,
  latitude double precision,
  longitude double precision,
  location_name text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- ストレージバケット作成（Supabaseダッシュボードで行う場合はスキップ）
-- Storage > New bucket > "travel-photos" (public: true)

-- RLSポリシー（今回は全公開で設定。認証追加時に修正）
alter table photos enable row level security;

create policy "Anyone can read photos"
  on photos for select using (true);

create policy "Anyone can insert photos"
  on photos for insert with check (true);

create policy "Anyone can update photos"
  on photos for update using (true);

create policy "Anyone can delete photos"
  on photos for delete using (true);

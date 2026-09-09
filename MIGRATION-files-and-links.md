## Adding file/link support (run once)

Your `media_items` table already exists, so `lib/schema.sql`'s `create table if
not exists` won't retroactively add the new columns. Run this once in Neon's
SQL editor:

```sql
alter table media_items alter column r2_key drop not null;
alter table media_items add column if not exists link_url text;
alter table media_items add column if not exists original_filename text;
alter table media_items drop constraint if exists media_items_type_check;
alter table media_items add constraint media_items_type_check
  check (type in ('image', 'video', 'file', 'link'));
```

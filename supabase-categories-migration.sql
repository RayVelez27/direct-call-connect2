-- ============================================================
-- Plezyy — Categories Schema Migration
-- Run this in the Supabase SQL Editor after the main schema.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- 1. CATEGORY HEADINGS (top-level sections)
--    e.g. "Main", "Specials", "Popular", "Appearance", etc.
-- ────────────────────────────────────────────────────────────

create table public.category_headings (
  id            serial primary key,
  name          text not null unique,       -- "Popular", "Appearance", etc.
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.category_headings enable row level security;

create policy "Category headings are viewable by everyone"
  on public.category_headings for select using (true);


-- ────────────────────────────────────────────────────────────
-- 2. CATEGORY GROUPS (sub-sections within a heading)
--    e.g. "Age", "Ethnicity", "Body Type" under "Appearance"
--    Use empty string title for ungrouped items.
-- ────────────────────────────────────────────────────────────

create table public.category_groups (
  id            serial primary key,
  heading_id    integer not null references public.category_headings (id) on delete cascade,
  title         text not null default '',   -- "" for ungrouped, "Age", "Hair", etc.
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.category_groups enable row level security;

create policy "Category groups are viewable by everyone"
  on public.category_groups for select using (true);

create index idx_category_groups_heading on public.category_groups (heading_id);


-- ────────────────────────────────────────────────────────────
-- 3. CATEGORY ITEMS (individual tags creators can select)
--    e.g. "Big Tits", "Anal", "MILF", "Colombian"
-- ────────────────────────────────────────────────────────────

create table public.category_items (
  id            serial primary key,
  group_id      integer not null references public.category_groups (id) on delete cascade,
  name          text not null,
  slug          text not null unique,       -- URL-safe key: "big-tits", "teen-18-plus"
  display_order integer not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.category_items enable row level security;

create policy "Category items are viewable by everyone"
  on public.category_items for select using (true);

create index idx_category_items_group on public.category_items (group_id);
create index idx_category_items_slug  on public.category_items (slug);


-- ────────────────────────────────────────────────────────────
-- 4. CREATOR ↔ CATEGORY JUNCTION TABLE
--    Links creators to the categories they belong to.
--    Counts are derived via COUNT(*) — no more hardcoded numbers.
-- ────────────────────────────────────────────────────────────

create table public.creator_categories (
  id            bigserial primary key,
  creator_id    uuid not null references public.creator_profiles (id) on delete cascade,
  category_id   integer not null references public.category_items (id) on delete cascade,
  created_at    timestamptz not null default now(),

  unique (creator_id, category_id)
);

alter table public.creator_categories enable row level security;

-- Everyone can see which creators have which categories
create policy "Creator categories are viewable by everyone"
  on public.creator_categories for select using (true);

-- Creators can manage their own categories
create policy "Creators can insert their own categories"
  on public.creator_categories for insert
  with check (
    creator_id in (
      select id from public.creator_profiles where user_id = auth.uid()
    )
  );

create policy "Creators can delete their own categories"
  on public.creator_categories for delete
  using (
    creator_id in (
      select id from public.creator_profiles where user_id = auth.uid()
    )
  );

create index idx_creator_categories_creator  on public.creator_categories (creator_id);
create index idx_creator_categories_category on public.creator_categories (category_id);


-- ────────────────────────────────────────────────────────────
-- 5. VIEW: categories with live creator counts
--    Use this from the frontend instead of the JSON file.
-- ────────────────────────────────────────────────────────────

create or replace view public.categories_with_counts as
select
  ch.id          as heading_id,
  ch.name        as heading,
  ch.display_order as heading_order,
  cg.id          as group_id,
  cg.title       as group_title,
  cg.display_order as group_order,
  ci.id          as item_id,
  ci.name        as item_name,
  ci.slug        as item_slug,
  ci.display_order as item_order,
  coalesce(cc.creator_count, 0) as creator_count
from public.category_items ci
join public.category_groups cg on cg.id = ci.group_id
join public.category_headings ch on ch.id = cg.heading_id
left join (
  select category_id, count(*) as creator_count
  from public.creator_categories
  group by category_id
) cc on cc.category_id = ci.id
order by ch.display_order, cg.display_order, ci.display_order;


-- ────────────────────────────────────────────────────────────
-- 6. SEED DATA — all categories from categories.json
-- ────────────────────────────────────────────────────────────

-- Headings
insert into public.category_headings (name, display_order) values
  ('Main',                  1),
  ('Specials',              2),
  ('Popular',               3),
  ('Appearance',            4),
  ('Activities on Request', 5),
  ('Specifics',             6),
  ('Countries & Languages', 7),
  ('Fetishes & Kinks',      8);

-- Groups  (heading_id references above in insertion order)
-- Main (heading 1)
insert into public.category_groups (heading_id, title, display_order) values
  (1, '', 1);

-- Specials (heading 2)
insert into public.category_groups (heading_id, title, display_order) values
  (2, '', 1);

-- Popular (heading 3)
insert into public.category_groups (heading_id, title, display_order) values
  (3, '', 1);

-- Appearance (heading 4)
insert into public.category_groups (heading_id, title, display_order) values
  (4, 'Age',         1),
  (4, 'Ethnicity',   2),
  (4, 'Body Type',   3),
  (4, 'Hair',        4),
  (4, 'Body Traits', 5);

-- Activities on Request (heading 5)
insert into public.category_groups (heading_id, title, display_order) values
  (5, 'Private show', 1),
  (5, 'Activities',   2),
  (5, 'Device',       3);

-- Specifics (heading 6)
insert into public.category_groups (heading_id, title, display_order) values
  (6, 'Subcultures',      1),
  (6, 'Broadcast',        2),
  (6, 'Show Type',        3),
  (6, 'Gender Identity',  4),
  (6, 'Orientation',      5);

-- Countries & Languages (heading 7)
insert into public.category_groups (heading_id, title, display_order) values
  (7, 'North America', 1),
  (7, 'South America', 2),
  (7, 'Europe',        3),
  (7, 'Asia & Pacific', 4),
  (7, 'Africa',        5),
  (7, 'Middle East',   6),
  (7, 'Languages',     7);

-- Fetishes & Kinks (heading 8)
insert into public.category_groups (heading_id, title, display_order) values
  (8, '', 1);

-- ── Category Items ──────────────────────────────────────────
-- group_id values are based on insertion order above:
--  1  = Main (ungrouped)
--  2  = Specials (ungrouped)
--  3  = Popular (ungrouped)
--  4  = Age
--  5  = Ethnicity
--  6  = Body Type
--  7  = Hair
--  8  = Body Traits
--  9  = Private show
--  10 = Activities
--  11 = Device
--  12 = Subcultures
--  13 = Broadcast
--  14 = Show Type
--  15 = Gender Identity
--  16 = Orientation
--  17 = North America
--  18 = South America
--  19 = Europe
--  20 = Asia & Pacific
--  21 = Africa
--  22 = Middle East
--  23 = Languages
--  24 = Fetishes & Kinks (ungrouped)

-- Main
insert into public.category_items (group_id, name, slug, display_order) values
  (1, 'My Favorites',      'my-favorites',      1),
  (1, 'Recommended',       'recommended',       2),
  (1, 'Watch History',     'watch-history',     3),
  (1, 'Gallery',           'gallery',           4),
  (1, 'Best for Privates', 'best-for-privates', 5);

-- Specials
insert into public.category_items (group_id, name, slug, display_order) values
  (2, 'Easter Celebration',   'easter-celebration',   1),
  (2, 'American',             'american-special',     2),
  (2, 'Ukrainian',            'ukrainian-special',    3),
  (2, 'New Models',           'new-models-special',   4),
  (2, 'VR Cams',              'vr-cams-special',      5),
  (2, 'BDSM',                 'bdsm-special',         6),
  (2, 'Ticket & Group Shows', 'ticket-group-special', 7);

-- Popular
insert into public.category_items (group_id, name, slug, display_order) values
  (3, 'Interactive Toy', 'interactive-toy', 1),
  (3, 'Mobile',          'mobile',          2),
  (3, 'Group Sex',       'group-sex',       3),
  (3, 'Big Tits',        'big-tits',        4),
  (3, 'Hairy Pussy',     'hairy-pussy',     5),
  (3, 'Outdoor',         'outdoor',         6),
  (3, 'Big Ass',         'big-ass',         7),
  (3, 'Anal',            'anal',            8),
  (3, 'Squirt',          'squirt',          9),
  (3, 'Fuck Machine',    'fuck-machine',    10),
  (3, 'Hardcore',        'hardcore',        11),
  (3, 'Blowjob',         'blowjob',         12),
  (3, 'Pregnant',        'pregnant',        13),
  (3, 'Small Tits',      'small-tits',      14),
  (3, 'Fisting',         'fisting',         15),
  (3, 'Masturbation',    'masturbation',    16),
  (3, 'Shaven',          'shaven',          17),
  (3, 'Deepthroat',      'deepthroat',      18),
  (3, 'Office',          'office',          19),
  (3, 'Foot Fetish',     'foot-fetish',     20);

-- Age
insert into public.category_items (group_id, name, slug, display_order) values
  (4, 'Teen 18+',  'teen-18-plus',  1),
  (4, 'Young 22+', 'young-22-plus', 2),
  (4, 'MILF',      'milf',          3),
  (4, 'Mature',    'mature',        4),
  (4, 'Granny',    'granny',        5);

-- Ethnicity
insert into public.category_items (group_id, name, slug, display_order) values
  (5, 'Arab',   'arab',   1),
  (5, 'Asian',  'asian',  2),
  (5, 'Ebony',  'ebony',  3),
  (5, 'Indian', 'indian', 4),
  (5, 'Latina', 'latina', 5),
  (5, 'Mixed',  'mixed',  6),
  (5, 'White',  'white',  7);

-- Body Type
insert into public.category_items (group_id, name, slug, display_order) values
  (6, 'Skinny',   'skinny',   1),
  (6, 'Athletic', 'athletic', 2),
  (6, 'Medium',   'medium',   3),
  (6, 'Curvy',    'curvy',    4),
  (6, 'BBW',      'bbw',      5);

-- Hair
insert into public.category_items (group_id, name, slug, display_order) values
  (7, 'Blonde',   'blonde',   1),
  (7, 'Black',    'black',    2),
  (7, 'Brunette', 'brunette', 3),
  (7, 'Redhead',  'redhead',  4),
  (7, 'Colorful', 'colorful', 5);

-- Body Traits
insert into public.category_items (group_id, name, slug, display_order) values
  (8, 'Bald',           'bald',           1),
  (8, 'Big Ass',        'big-ass-trait',  2),
  (8, 'Big Clit',       'big-clit',       3),
  (8, 'Big Nipples',    'big-nipples',    4),
  (8, 'Big Tits',       'big-tits-trait', 5),
  (8, 'Hairy armpits',  'hairy-armpits',  6),
  (8, 'Hairy Pussy',    'hairy-pussy-trait', 7),
  (8, 'Shaven',         'shaven-trait',   8),
  (8, 'Small Tits',     'small-tits-trait', 9),
  (8, 'Trimmed',        'trimmed',        10);

-- Private show
insert into public.category_items (group_id, name, slug, display_order) values
  (9, '8-12 tk',              'private-8-12',        1),
  (9, '16-24 tk',             'private-16-24',       2),
  (9, '32-60 tk',             'private-32-60',       3),
  (9, '90+ tk',               'private-90-plus',     4),
  (9, 'Video Call (Cam2Cam)', 'video-call-cam2cam',  5),
  (9, 'Recordable Privates',  'recordable-privates', 6),
  (9, 'Spy on Shows',         'spy-on-shows',        7);

-- Activities
insert into public.category_items (group_id, name, slug, display_order) values
  (10, '69 Position',        '69-position',        1),
  (10, 'Ahegao',             'ahegao',             2),
  (10, 'Anal',               'anal-activity',      3),
  (10, 'Anal Toys',          'anal-toys',          4),
  (10, 'Ass to Mouth',       'ass-to-mouth',       5),
  (10, 'Blowjob',            'blowjob-activity',   6),
  (10, 'Bukkake',            'bukkake',            7),
  (10, 'Camel Toe',          'camel-toe',          8),
  (10, 'Cock Rating',        'cock-rating',        9),
  (10, 'Cosplay',            'cosplay',            10),
  (10, 'Cowgirl',            'cowgirl',            11),
  (10, 'Creampie',           'creampie',           12),
  (10, 'Cumshot',            'cumshot',            13),
  (10, 'Deepthroat',         'deepthroat-activity', 14),
  (10, 'Dildo or Vibrator',  'dildo-or-vibrator',  15),
  (10, 'Dirty Talk',         'dirty-talk',         16),
  (10, 'Doggy Style',        'doggy-style',        17),
  (10, 'Double Penetration', 'double-penetration', 18),
  (10, 'Erotic Dance',       'erotic-dance',       19),
  (10, 'Facesitting',        'facesitting',        20),
  (10, 'Facial',             'facial',             21),
  (10, 'Fingering',          'fingering',          22),
  (10, 'Fisting',            'fisting-activity',   23),
  (10, 'Flashing',           'flashing',           24),
  (10, 'Footjob',            'footjob',            25),
  (10, 'Foursome',           'foursome',           26),
  (10, 'Fuck Machine',       'fuck-machine-activity', 27),
  (10, 'Gagging',            'gagging',            28),
  (10, 'Gangbang',           'gangbang',           29),
  (10, 'Gape',               'gape',               30),
  (10, 'Glory Hole',         'glory-hole',         31),
  (10, 'Handjob',            'handjob',            32),
  (10, 'Hardcore',           'hardcore-activity',  33),
  (10, 'Humiliation',        'humiliation',        34),
  (10, 'Jerk-off Instruction', 'jerk-off-instruction', 35),
  (10, 'Massage',            'massage',            36),
  (10, 'Masturbation',       'masturbation-activity', 37),
  (10, 'Nipple Toys',        'nipple-toys',        38),
  (10, 'Oil Show',           'oil-show',           39),
  (10, 'Orgasm',             'orgasm',             40),
  (10, 'Pegging',            'pegging',            41),
  (10, 'Pussy Licking',      'pussy-licking',      42),
  (10, 'Role Play',          'role-play',          43),
  (10, 'Sex Toys',           'sex-toys',           44),
  (10, 'Sexting',            'sexting',            45),
  (10, 'Shower',             'shower',             46),
  (10, 'Spanking',           'spanking',           47),
  (10, 'Squirt',             'squirt-activity',    48),
  (10, 'Strapon',            'strapon',            49),
  (10, 'Striptease',         'striptease',         50),
  (10, 'Swing',              'swing',              51),
  (10, 'Threesome',          'threesome',          52),
  (10, 'Tittyfuck',          'tittyfuck',          53),
  (10, 'Topless',            'topless',            54),
  (10, 'Twerk',              'twerk',              55),
  (10, 'Upskirt',            'upskirt',            56),
  (10, 'Yoga',               'yoga',               57);

-- Device
insert into public.category_items (group_id, name, slug, display_order) values
  (11, 'Anal Toys',         'anal-toys-device',    1),
  (11, 'Dildo or Vibrator', 'dildo-vibrator-device', 2),
  (11, 'Fuck Machine',      'fuck-machine-device', 3),
  (11, 'Interactive Toy',   'interactive-toy-device', 4),
  (11, 'Kiiroo',            'kiiroo',              5),
  (11, 'Lovense',           'lovense',             6),
  (11, 'Nipple Toys',       'nipple-toys-device',  7),
  (11, 'Sex Toys',          'sex-toys-device',     8),
  (11, 'Strapon',           'strapon-device',      9);

-- Subcultures
insert into public.category_items (group_id, name, slug, display_order) values
  (12, 'Anime Girls', 'anime-girls', 1),
  (12, 'Club Girls',  'club-girls',  2),
  (12, 'E-girl',      'e-girl',      3),
  (12, 'Emo',         'emo',         4),
  (12, 'Gamers',      'gamers',      5),
  (12, 'Glamour',     'glamour',     6),
  (12, 'Goth',        'goth',        7),
  (12, 'Gym Babe',    'gym-babe',    8),
  (12, 'Housewives',  'housewives',  9),
  (12, 'K-pop',       'k-pop',       10),
  (12, 'Nerds',       'nerds',       11),
  (12, 'Punks',       'punks',       12),
  (12, 'Queers',      'queers',      13),
  (12, 'Romantic',    'romantic',    14),
  (12, 'Student',     'student',     15),
  (12, 'Tomboys',     'tomboys',     16);

-- Broadcast
insert into public.category_items (group_id, name, slug, display_order) values
  (13, 'HD',         'hd',          1),
  (13, 'Mobile',     'mobile-broadcast', 2),
  (13, 'Recordable', 'recordable',  3),
  (13, 'VR Cams',    'vr-cams',     4);

-- Show Type
insert into public.category_items (group_id, name, slug, display_order) values
  (14, 'Easter Celebration',   'easter-celebration-show', 1),
  (14, 'ASMR',                 'asmr',                    2),
  (14, 'Cooking',              'cooking',                 3),
  (14, 'Flirting',             'flirting',                4),
  (14, 'Group Sex',            'group-sex-show',          5),
  (14, 'Interracial',          'interracial',             6),
  (14, 'New Models',           'new-models-show',         7),
  (14, 'Office',               'office-show',             8),
  (14, 'Old & Young 22+',      'old-and-young',           9),
  (14, 'Outdoor',              'outdoor-show',            10),
  (14, 'Pornstars',            'pornstars',               11),
  (14, 'POV',                  'pov',                     12),
  (14, 'Ticket & Group Shows', 'ticket-group-shows',      13),
  (14, 'Video Games',          'video-games',             14),
  (14, 'VTubers',              'vtubers',                 15);

-- Gender Identity
insert into public.category_items (group_id, name, slug, display_order) values
  (15, 'Non-binary', 'non-binary', 1);

-- Orientation
insert into public.category_items (group_id, name, slug, display_order) values
  (16, 'Lesbian', 'lesbian', 1);

-- North America
insert into public.category_items (group_id, name, slug, display_order) values
  (17, 'American', 'american', 1),
  (17, 'Canadian', 'canadian', 2),
  (17, 'Mexican',  'mexican',  3);

-- South America
insert into public.category_items (group_id, name, slug, display_order) values
  (18, 'Argentinian', 'argentinian', 1),
  (18, 'Brazilian',   'brazilian',   2),
  (18, 'Chilean',     'chilean',     3),
  (18, 'Colombian',   'colombian',   4),
  (18, 'Ecuadorian',  'ecuadorian',  5),
  (18, 'Peruvian',    'peruvian',    6),
  (18, 'Venezuelan',  'venezuelan',  7);

-- Europe
insert into public.category_items (group_id, name, slug, display_order) values
  (19, 'Austrian',   'austrian',   1),
  (19, 'Belgian',    'belgian',    2),
  (19, 'Czech',      'czech',      3),
  (19, 'Danish',     'danish',     4),
  (19, 'Dutch',      'dutch',      5),
  (19, 'French',     'french',     6),
  (19, 'German',     'german',     7),
  (19, 'Greek',      'greek',      8),
  (19, 'Hungarian',  'hungarian',  9),
  (19, 'Italian',    'italian',    10),
  (19, 'Nordic',     'nordic',     11),
  (19, 'Polish',     'polish',     12),
  (19, 'Portuguese', 'portuguese', 13),
  (19, 'Romanian',   'romanian',   14),
  (19, 'Serbian',    'serbian',    15),
  (19, 'Spanish',    'spanish',    16),
  (19, 'Swiss',      'swiss',      17),
  (19, 'UK Models',  'uk-models',  18),
  (19, 'Ukrainian',  'ukrainian',  19);

-- Asia & Pacific
insert into public.category_items (group_id, name, slug, display_order) values
  (20, 'Australian',  'australian',  1),
  (20, 'Chinese',     'chinese',     2),
  (20, 'Filipino',    'filipino',    3),
  (20, 'Indian',      'indian-country', 4),
  (20, 'Japanese',    'japanese',    5),
  (20, 'Korean',      'korean',      6),
  (20, 'Sri Lankan',  'sri-lankan',  7),
  (20, 'Thai',        'thai',        8),
  (20, 'Vietnamese',  'vietnamese',  9);

-- Africa
insert into public.category_items (group_id, name, slug, display_order) values
  (21, 'African',      'african',       1),
  (21, 'Kenyan',       'kenyan',        2),
  (21, 'Malagasy',     'malagasy',      3),
  (21, 'South African', 'south-african', 4),
  (21, 'Ugandan',      'ugandan',       5),
  (21, 'Zimbabwean',   'zimbabwean',    6);

-- Middle East
insert into public.category_items (group_id, name, slug, display_order) values
  (22, 'Arab',    'arab-country',    1),
  (22, 'Turkish', 'turkish',         2);

-- Languages
insert into public.category_items (group_id, name, slug, display_order) values
  (23, 'Portuguese Speaking', 'portuguese-speaking', 1),
  (23, 'Russian Speaking',    'russian-speaking',    2),
  (23, 'Spanish Speaking',    'spanish-speaking',    3);

-- Fetishes & Kinks
insert into public.category_items (group_id, name, slug, display_order) values
  (24, 'BDSM',        'bdsm',        1),
  (24, 'Cock Rating', 'cock-rating-fetish', 2),
  (24, 'Corset',      'corset',      3),
  (24, 'Cuckold',     'cuckold',     4),
  (24, 'Foot Fetish', 'foot-fetish-kink', 5),
  (24, 'Heels',       'heels',       6),
  (24, 'Jeans',       'jeans',       7),
  (24, 'Latex',       'latex',       8),
  (24, 'Leather',     'leather',     9),
  (24, 'Mistress',    'mistress',    10),
  (24, 'Nylon',       'nylon',       11),
  (24, 'Piercing',    'piercing',    12);

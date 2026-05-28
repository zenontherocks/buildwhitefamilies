-- AUTH
CREATE TABLE IF NOT EXISTS auth_codes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  code       TEXT    NOT NULL,
  expires_at INTEGER NOT NULL,
  used       INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE INDEX IF NOT EXISTS idx_auth_email   ON auth_codes(email);
CREATE INDEX IF NOT EXISTS idx_auth_expires ON auth_codes(expires_at);

-- CORE IDENTITY
CREATE TABLE IF NOT EXISTS users (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  email                 TEXT    NOT NULL UNIQUE,
  name                  TEXT    NOT NULL DEFAULT '',
  gender                TEXT    NOT NULL DEFAULT 'man' CHECK(gender IN ('man','woman')),
  created_at            INTEGER NOT NULL DEFAULT (unixepoch()),
  last_active           INTEGER NOT NULL DEFAULT (unixepoch()),
  users_contacted_count INTEGER NOT NULL DEFAULT 0,
  is_active             INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);
CREATE INDEX IF NOT EXISTS idx_users_created_at  ON users(created_at);

-- DESCRIPTIVE PROFILE
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id  INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  -- Physical (range-queried)
  age_years  INTEGER,
  height_cm  INTEGER,
  weight_kg  INTEGER,

  -- Family intent
  children_count INTEGER DEFAULT 0,
  wants_children TEXT CHECK(wants_children IN ('yes','no','open','undecided')),

  -- Faith
  denomination      TEXT,
  church_attendance TEXT CHECK(church_attendance IN ('daily','weekly','monthly','occasionally','rarely')),
  faith_importance  TEXT CHECK(faith_importance IN ('central','important','moderate','cultural')),

  -- Location & language
  location_country TEXT,
  location_region  TEXT,
  language_primary TEXT,
  languages_spoken TEXT,

  -- Background
  education  TEXT,
  occupation TEXT,

  -- Habits
  smoking  TEXT CHECK(smoking  IN ('never','occasionally','regularly')),
  drinking TEXT CHECK(drinking IN ('never','occasionally','regularly')),
  diet     TEXT,

  -- Communication
  comm_style                TEXT,
  preferred_initial_contact TEXT,

  -- Free text
  about_me       TEXT,
  about_my_match TEXT,

  -- Photos (JSON array of R2 keys)
  photos TEXT,

  profile_visible INTEGER NOT NULL DEFAULT 1
);

-- Range indexes
CREATE INDEX IF NOT EXISTS idx_prof_age      ON user_profiles(age_years);
CREATE INDEX IF NOT EXISTS idx_prof_height   ON user_profiles(height_cm);
CREATE INDEX IF NOT EXISTS idx_prof_weight   ON user_profiles(weight_kg);
CREATE INDEX IF NOT EXISTS idx_prof_children ON user_profiles(children_count);

-- Categorical indexes
CREATE INDEX IF NOT EXISTS idx_prof_denomination   ON user_profiles(denomination);
CREATE INDEX IF NOT EXISTS idx_prof_wants_children ON user_profiles(wants_children);
CREATE INDEX IF NOT EXISTS idx_prof_faith          ON user_profiles(faith_importance);
CREATE INDEX IF NOT EXISTS idx_prof_location       ON user_profiles(location_country, location_region);
CREATE INDEX IF NOT EXISTS idx_prof_language       ON user_profiles(language_primary);
CREATE INDEX IF NOT EXISTS idx_prof_smoking        ON user_profiles(smoking);
CREATE INDEX IF NOT EXISTS idx_prof_drinking       ON user_profiles(drinking);

-- MATCH REQUESTS
CREATE TABLE IF NOT EXISTS match_requests (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL REFERENCES users(id),
  target_id    INTEGER NOT NULL REFERENCES users(id),
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  status       TEXT    NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','mutual','withdrawn')),
  UNIQUE(requester_id, target_id)
);
CREATE INDEX IF NOT EXISTS idx_match_requester ON match_requests(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_match_target    ON match_requests(target_id, status);

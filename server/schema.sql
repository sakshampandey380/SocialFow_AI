CREATE DATABASE IF NOT EXISTS social_media_automation_agent;
USE social_media_automation_agent;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  bio TEXT NULL,
  avatar_url VARCHAR(255) NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Calcutta',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_users_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS social_accounts (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  platform VARCHAR(32) NOT NULL,
  account_name VARCHAR(120) NOT NULL,
  account_identifier VARCHAR(120) NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NULL,
  token_expiry DATETIME NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ix_social_accounts_user_platform (user_id, platform),
  INDEX ix_social_accounts_platform (platform),
  CONSTRAINT fk_social_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(160) NULL,
  content TEXT NOT NULL,
  hook VARCHAR(255) NULL,
  hashtags TEXT NULL,
  tone VARCHAR(32) NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  scheduled_time DATETIME NULL,
  published_at DATETIME NULL,
  timezone VARCHAR(64) NOT NULL DEFAULT 'UTC',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX ix_posts_user_created (user_id, created_at),
  INDEX ix_posts_status_schedule (status, scheduled_time),
  CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS media (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  post_id CHAR(36) NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(24) NOT NULL,
  is_profile_pic TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_media_user_created (user_id, created_at),
  INDEX ix_media_post_id (post_id),
  CONSTRAINT fk_media_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_media_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS post_platforms (
  id CHAR(36) PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  platform VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  platform_post_id VARCHAR(255) NULL,
  error_message TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY ix_post_platform_unique (post_id, platform),
  INDEX ix_post_platform_status (status),
  CONSTRAINT fk_post_platforms_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id CHAR(36) PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'queued',
  retries INT NOT NULL DEFAULT 0,
  last_error TEXT NULL,
  scheduled_at DATETIME NULL,
  processed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_jobs_status_schedule (status, scheduled_at),
  INDEX ix_jobs_post_id (post_id),
  CONSTRAINT fk_jobs_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_contents (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  prompt TEXT NOT NULL,
  generated_caption TEXT NOT NULL,
  hashtags TEXT NOT NULL,
  hook VARCHAR(255) NULL,
  tone VARCHAR(32) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_ai_contents_user_created (user_id, created_at),
  CONSTRAINT fk_ai_contents_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workflows (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  name VARCHAR(120) NOT NULL,
  trigger_event VARCHAR(64) NOT NULL,
  action TEXT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_workflows_user_active (user_id, is_active),
  CONSTRAINT fk_workflows_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(32) NOT NULL DEFAULT 'info',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_notifications_user_unread (user_id, is_read),
  INDEX ix_notifications_created_at (created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analytics (
  id CHAR(36) PRIMARY KEY,
  post_id CHAR(36) NOT NULL,
  platform VARCHAR(32) NOT NULL,
  likes INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  shares INT NOT NULL DEFAULT 0,
  reach INT NOT NULL DEFAULT 0,
  impressions INT NOT NULL DEFAULT 0,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX ix_analytics_post_platform (post_id, platform),
  INDEX ix_analytics_recorded_at (recorded_at),
  CONSTRAINT fk_analytics_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

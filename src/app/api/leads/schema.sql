-- ─────────────────────────────────────────────────────────────────────────────
--  Portfolio Leads — Schema MySQL 8.0+
--  Rodar uma vez no banco da Hostinger para criar as tabelas
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS portfolio_leads
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_leads;

-- ─── Tabela principal de leads ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                  CHAR(36)      NOT NULL DEFAULT (UUID()),
  nome                VARCHAR(120)  NOT NULL,
  telefone            VARCHAR(20)   NOT NULL,
  contact_preference  ENUM('phone-call', 'whatsapp', 'both') NOT NULL,
  service_type        ENUM(
    'landing-page',
    'institutional-site',
    'custom-system',
    'marketplace',
    'freelance',
    'it-services',
    'other'
  )                                 NOT NULL,
  full_name           VARCHAR(120)      NULL,
  company_name        VARCHAR(120)      NULL,
  company_services    TEXT              NULL,
  created_at          DATETIME(3)   NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_telefone   (telefone),
  INDEX idx_service    (service_type),
  INDEX idx_created    (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Respostas de briefing (1 lead → N respostas) ─────────────────────────────
CREATE TABLE IF NOT EXISTS briefing_answers (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  lead_id       CHAR(36)         NOT NULL,
  answer_key    VARCHAR(80)      NOT NULL,
  answer_value  TEXT             NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_lead (lead_id),

  CONSTRAINT fk_briefing_lead
    FOREIGN KEY (lead_id)
    REFERENCES leads(id)
    ON DELETE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

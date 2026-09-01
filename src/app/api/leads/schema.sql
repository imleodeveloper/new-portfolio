-- ─────────────────────────────────────────────────────────────────────────────
--  Portfolio Leads — Schema MySQL 8.0+
--  Para criar do zero: rodar todo o arquivo no banco da Hostinger
--  Para migrar a partir do schema anterior (com briefing_answers separada):
--    ALTER TABLE leads ADD COLUMN briefing_answers JSON NULL AFTER company_services;
--    DROP TABLE IF EXISTS briefing_answers;
-- ─────────────────────────────────────────────────────────────────────────────

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
  company_name        VARCHAR(120)      NULL,
  company_services    TEXT              NULL,
  briefing_answers    JSON              NULL,
  created_at          DATETIME(3)   NOT NULL,

  PRIMARY KEY (id),
  INDEX idx_telefone   (telefone),
  INDEX idx_service    (service_type),
  INDEX idx_created    (created_at)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

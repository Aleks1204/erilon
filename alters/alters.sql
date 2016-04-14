alter TABLE "AttachedSkills" ADD COLUMN spells_connected BOOLEAN;
UPDATE "AttachedSkills" SET spells_connected = FALSE;
UPDATE "AttachedSkills" SET spells_connected = TRUE WHERE name LIKE 'Магия%';
ALTER TABLE "Spells" RENAME COLUMN experience TO cost;
ALTER TABLE "Personages" ADD COLUMN notes TEXT;
ALTER TABLE "Personages" ADD "PlayerId" int NULL;
alter TABLE "AttachedSkills" ADD COLUMN spells_connected BOOLEAN;
UPDATE "AttachedSkills" SET spells_connected = FALSE;
UPDATE "AttachedSkills" SET spells_connected = TRUE WHERE name LIKE 'Магия%';
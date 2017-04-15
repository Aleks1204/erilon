alter TABLE "AttachedSkills" ADD COLUMN spells_connected BOOLEAN;
UPDATE "AttachedSkills" SET spells_connected = FALSE;
UPDATE "AttachedSkills" SET spells_connected = TRUE WHERE name LIKE 'Магия%';
ALTER TABLE "Spells" RENAME COLUMN experience TO cost;
ALTER TABLE "Personages" ADD "PlayerId" int NULL;
ALTER TABLE "Players" ADD "RoleId" int NULL;
ALTER TABLE "AttachedSkills" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Merits" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Flaws" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Notices" ADD COLUMN experience INTEGER;
ALTER TABLE "PersonageAttributes" ADD COLUMN position INTEGER;
ALTER TABLE "Personages" ADD COLUMN deleted BOOLEAN;
ALTER TABLE "AttachedSkills" ALTER COLUMN description TYPE TEXT
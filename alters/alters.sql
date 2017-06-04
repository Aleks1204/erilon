alter TABLE "AttachedSkills" ADD COLUMN spells_connected BOOLEAN;
UPDATE "AttachedSkills" SET spells_connected = FALSE;
UPDATE "AttachedSkills" SET spells_connected = TRUE WHERE name LIKE 'Магия%';
ALTER TABLE "Spells" RENAME COLUMN experience TO cost;
ALTER TABLE "Personages" ADD "PlayerId" int NULL;
ALTER TABLE "Players" ADD "RoleId" int NULL;
ALTER TABLE "AttachedSkills" ADD COLUMN category VARCHAR(255);
ALTER TABLE "TriggerSkills" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Merits" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Flaws" ADD COLUMN category VARCHAR(255);
ALTER TABLE "Notices" ADD COLUMN experience INTEGER;
ALTER TABLE "PersonageAttributes" ADD COLUMN position INTEGER;
ALTER TABLE "Personages" ADD COLUMN deleted BOOLEAN;
ALTER TABLE "AttachedSkills" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "SkillLevels" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "Attributes" ADD COLUMN description TEXT;
ALTER TABLE "Flaws" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "Inherents" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "Merits" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "Races" ADD COLUMN description TEXT;
ALTER TABLE "TriggerSkills" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "RaceInherents" ADD COLUMN race_min INTEGER;
ALTER TABLE "RaceInherents" ADD COLUMN race_max INTEGER;
CREATE TABLE "AttachedSkillAttribute"
(
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT,
  "AttachedSkillId" INT NOT NULL,
  "AttributeId" INT NOT NULL,
  CONSTRAINT AttachedSkillAttribute_Attribute__fk FOREIGN KEY ("AttributeId") REFERENCES "Attributes" (id),
  CONSTRAINT AttachedSkillAttribute_AttachedSkill__fk FOREIGN KEY ("AttachedSkillId") REFERENCES "AttachedSkills" (id)
);
CREATE UNIQUE INDEX "AttachedSkillAttribute_id_uindex" ON "AttachedSkillAttribute" (id);
ALTER TABLE "TriggerSkills" ADD "TriggerSkillId" INT NULL;
ALTER TABLE "TriggerSkills"
  ADD CONSTRAINT TriggerSkills_TriggerSkills_id_fk
FOREIGN KEY ("TriggerSkillId") REFERENCES "TriggerSkills" (id);
ALTER TABLE "Spells" ADD "SpellId" INT NULL;
ALTER TABLE "Spells"
  ADD CONSTRAINT Spells_Spells_id_fk
FOREIGN KEY ("SpellId") REFERENCES "Spells" (id);
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
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT AttachedSkillAttribute_Attribute_fk FOREIGN KEY ("AttributeId") REFERENCES "Attributes" (id),
  CONSTRAINT AttachedSkillAttribute_AttachedSkill_fk FOREIGN KEY ("AttachedSkillId") REFERENCES "AttachedSkills" (id)
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
ALTER TABLE "Spells" ADD modification_needed BOOLEAN DEFAULT FALSE  NOT NULL;
ALTER TABLE "Personages" ADD avatar VARCHAR(255) NULL;
CREATE TABLE "PlayerAttributes"
(
  id SERIAL PRIMARY KEY NOT NULL,
  position INT NOT NULL,
  "AttributeId" INT NOT NULL,
  "PlayerId" INT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "PlayerAttributes_Attributes_id_fk" FOREIGN KEY ("AttributeId") REFERENCES "Attributes" (id),
  CONSTRAINT "PlayerAttributes_Players_id_fk" FOREIGN KEY ("PlayerId") REFERENCES "Players" (id)
);
CREATE UNIQUE INDEX "PlayerAttributes_id_uindex" ON "PlayerAttributes" (id);
ALTER TABLE "Players" ADD avatar VARCHAR(255) NULL;
ALTER TABLE "Notices" ALTER COLUMN description TYPE TEXT;
ALTER TABLE "Races" ADD COLUMN falling_damage_coefficient INTEGER;
ALTER TABLE "Merits" RENAME COLUMN action_level_bonus TO permanent_bonus;
ALTER TABLE "Flaws" RENAME COLUMN action_level_bonus TO permanent_bonus;
ALTER TABLE "Merits" ADD COLUMN situation_bonus TEXT DEFAULT '' NOT NULL;
ALTER TABLE "Flaws" ADD COLUMN situation_bonus TEXT DEFAULT '' NOT NULL;
ALTER TABLE "Inherents" RENAME COLUMN action_level_bonus TO permanent_bonus;
ALTER TABLE "Inherents" ADD COLUMN situation_bonus TEXT DEFAULT '' NOT NULL;
ALTER TABLE "AttachedSkillAttributes" ADD COLUMN name TEXT DEFAULT '' NOT NULL;
ALTER TABLE "Personages" ADD "RoomId" INT NULL;
ALTER TABLE "Personages" ADD CONSTRAINT Personages_Rooms_id_fk FOREIGN KEY ("RoomId") REFERENCES "Rooms" (id);
CREATE TABLE "Rooms"
(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    description TEXT,
    "PlayerId" INT,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT Rooms_Players_id_fk FOREIGN KEY ("PlayerId") REFERENCES "Players" (id)
);
CREATE UNIQUE INDEX Rooms_id_uindex ON "Rooms" (id);
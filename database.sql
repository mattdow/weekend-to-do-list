CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"taskname" VARCHAR (255) NOT NULL,
	"priority" VARCHAR (12),
	"dueDate" DATE,
	"contextTag" VARCHAR (50),
	"completeStatus" BOOLEAN
);

INSERT INTO "tasks"
	("taskname", "priority", "dueDate", "contextTag", "completeStatus")
VALUES
	('Oil Change', 'high', '10-21-2021', 'errand', false),
	('LinkedIn post', 'medium', '10-17-2021', 'office', false),
	('Touch base with Paul', 'low', '11-01-2021', 'home', false); 

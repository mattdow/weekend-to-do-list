CREATE TABLE "tasks" (
	"id" SERIAL PRIMARY KEY,
	"taskname" VARCHAR (255) NOT NULL,
	"priority" INTEGER,
	"dueDate" DATE,
	"contextTag" VARCHAR (50),
	"completeStatus" BOOLEAN
);

INSERT INTO "tasks"
	("taskname", "priority", "dueDate", "contextTag", "completeStatus")
VALUES
	('Oil Change', 1, '10-21-2021', 'errand', false),
	('LinkedIn post', 2, '10-17-2021', 'office', false),
	('Touch base with Paul', 3, '11-01-2021', 'home', false); 
	

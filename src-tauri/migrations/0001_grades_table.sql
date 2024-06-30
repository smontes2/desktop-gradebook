create table grade (
	class varchar not null,
	class_grade varchar not null
);

create unique index grade_class_grade on grade (class);

create table gpa (
	class_gpa varchar not null,
	class_time varchar not null,
	class_credits varchar not null

);
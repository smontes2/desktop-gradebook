create table grade (
	class varchar not null,
	class_grade varchar not null
);

create unique index grade_class_grade on grade (class, class_grade);
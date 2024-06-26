create table classes (
	class varchar not null,
	class_assignment TEXT[],
	class_grade INT[],
	class_weights INT[]
);

create unique index classes_assignment_grade on classes (class);
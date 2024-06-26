use std::error::Error;

// use sqlx::Row;


async fn establish_connection() -> Result<sqlx::PgPool, Box<dyn Error>>{
	let url = "postgres://postgres:postgres@localhost:5432/gradebook";
	let pool = sqlx::postgres::PgPool::connect(url).await?;

	sqlx::migrate!("./migrations").run(&pool).await?;

	Ok(pool)
}

#[tauri::command]
pub async fn fetch_classes() -> Result<Vec<(String, String)>, String> {
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let classes: Vec<(String, String)> = sqlx::query_as::<_,(String, String)>("SELECT class, class_grade FROM grade")
		.fetch_all(&pool).await.map_err(|e| e.to_string())?;

	Ok(classes)
}

#[tauri::command]
pub async fn fetch_assignment_data(class: String) -> Result<Vec<(Vec<String>,Vec<i32>, Vec<i32>)>, String> {
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let assignment_data: Vec<(Vec<String>,Vec<i32>, Vec<i32>)> = sqlx::query_as::<_,(Vec<String>,Vec<i32>, Vec<i32>)>("SELECT class_assignment, class_grade, class_weights FROM classes WHERE class = $1")
		.bind(class).fetch_all(&pool).await.map_err(|e| e.to_string())?;

	Ok(assignment_data)
}

#[tauri::command]
pub async fn create_grade_table(class: String, class_grade: String) -> Result<(), String>{
    let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let exists: (bool,) = sqlx::query_as("SELECT EXISTS(SELECT 1 FROM grade WHERE class = $1)")
		.bind(&class).fetch_one(&pool).await.map_err(|e| e.to_string())?;

	if exists.0 {
		return Err("Class already exists".to_string());
	}
    sqlx::query("INSERT INTO grade (class, class_grade) VALUES ($1, $2)")
        .bind(&class)
        .bind(&class_grade).execute(&pool).await.map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn create_classes_table(class: String, class_assignment: Vec<String>, class_grade: Vec<i32>, class_weight: Vec<i32>) -> Result<(), String>{
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let exist: (bool,) = sqlx::query_as("SELECT EXISTS(SELECT 1 FROM classes WHERE class = $1)")
		.bind(&class).fetch_one(&pool).await.map_err(|e| e.to_string())?;

	if exist.0 {
		return Err("Class already exists".to_string());
	}

	sqlx::query("INSERT INTO classes (class, class_assignment, class_grade, class_weights) VALUES ($1, $2, $3, $4)")
		.bind(&class).bind(&class_assignment).bind(&class_grade).bind(&class_weight)
		.execute(&pool).await.map_err(|e| e.to_string())?;

	Ok(())
}

#[tauri::command]
pub async fn delete(class: String) -> Result<(), String>{
	let query = "DELETE FROM grade WHERE class = $1";
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	sqlx::query(query).bind(&class).execute(&pool).await.map_err(|e| e.to_string())?;

	sqlx::query("DELETE FROM classes WHERE class = $1").bind(&class).execute(&pool).await.map_err(|e| e.to_string())?;

	Ok(())
}


use std::error::Error;

// use sqlx::Row;


async fn establish_connection() -> Result<sqlx::PgPool, Box<dyn Error>>{
	let url = "postgres://postgres:postgres@localhost:5432/gradebook";
	let pool = sqlx::postgres::PgPool::connect(url).await?;

	sqlx::migrate!("./migrations").run(&pool).await?;

	Ok(pool)
}

#[tauri::command]
pub async fn fetch_classes() -> Result<Vec<(String,)>, String> {
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let classes: Vec<(String,)> = sqlx::query_as::<_,(String,)>("SELECT class FROM grade")
		.fetch_all(&pool).await.map_err(|e| e.to_string())?;

	Ok(classes)
}

#[tauri::command]
pub async fn create(class: String, class_grade: String) -> Result<(), String>{
    let query = "INSERT INTO grade (class, class_grade) VALUES ($1, $2)";
    let pool = establish_connection().await.map_err(|e| e.to_string())?;

	let exists: (bool,) = sqlx::query_as("SELECT EXISTS(SELECT 1 FROM grade WHERE class = $1)")
		.bind(&class).fetch_one(&pool).await.map_err(|e| e.to_string())?;

	if exists.0 {
		return Err("Class already exists".to_string());
	}
    sqlx::query(query)
        .bind(&class)
        .bind(&class_grade).execute(&pool).await.map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn delete(class: String) -> Result<(), String>{
	let query = "DELETE FROM grade WHERE class = $1";
	let pool = establish_connection().await.map_err(|e| e.to_string())?;

	sqlx::query(query).bind(class).execute(&pool).await.map_err(|e| e.to_string())?;

	Ok(())
}


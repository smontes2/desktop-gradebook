// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


#[tauri::command]
fn calculate_weighted_grade(grades: Vec<(f32, f32)>) -> f32{
    let mut total_weighted_grades = 0.0;
    let mut total_weights = 0.0;

    for (grade, weight) in grades.iter(){
        total_weighted_grades += grade * weight;
        total_weights += weight;
    }

    if total_weights == 0.0{
        return 0.0;
    }

    total_weighted_grades/total_weights
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![calculate_weighted_grade])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

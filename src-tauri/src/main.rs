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

#[tauri::command]
fn calculate_letter_grade(num: f32) -> String{

    if num >= 93.0 && num <= 100.0{
        "A".to_string()
    }
    else if num >= 90.0 && num <= 92.0 {
        "A-".to_string()
    }
    else if num >= 87.0 && num <= 89.0 {
        "B+".to_string()
    }
    else if num >= 83.0 && num < 87.0 {
        "B".to_string()
    }
    else if num >= 80.0 && num < 83.0 {
        "B-".to_string()
    }
    else if num >= 77.0 && num < 80.0 {
        "C+".to_string()
    }
    else if num >= 73.0 && num < 77.0 {
        "C".to_string()
    }
    else if num >= 70.0 && num < 73.0 {
        "C-".to_string()
    }
    else if num >= 67.0 && num < 70.0 {
        "D+".to_string()
    }
    else if num >= 65.0 && num < 67.0   {
        "D".to_string()
    }
    else{
        "F".to_string()
    }

}

#[tauri::command]
fn calculate_gpa(gpa_data: Vec<(String, f32)>, old_qp: f32, old_credits: f32) -> (String, String){
    let mut letter_grade_worth ;
    let mut total = 0.0;
    let mut total_credits = 0.0;

    if old_qp != 0.0 && old_credits != 0.0{
       total = old_qp;
       total_credits = old_credits; 
    }

    for (grades, credits) in gpa_data.iter(){
        if grades == "A"{
            letter_grade_worth = 4.0;
        }
        else if grades == "A-"{
            letter_grade_worth = 3.7;
        }
        else if grades == "B+"{
            letter_grade_worth = 3.3;
        }
        else if grades == "B"{
            letter_grade_worth = 3.0;
        }
        else if grades == "B-"{
            letter_grade_worth = 2.7;
        }
        else if grades == "C+"{
            letter_grade_worth = 2.3;
        }
        else if grades == "C"{
            letter_grade_worth = 2.0;
        }
        else if grades == "C-"{
            letter_grade_worth = 1.7;
        }
        else if grades == "D+"{
            letter_grade_worth = 1.3;
        }
        else if grades == "D"{
            letter_grade_worth = 1.0;
        }
        else{
            letter_grade_worth = 0.0;
        }

        total_credits += credits;
        total += letter_grade_worth * credits;
    }

    total = total / total_credits;
    return (total.to_string(), total_credits.to_string());
    
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![calculate_weighted_grade, calculate_letter_grade, calculate_gpa])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

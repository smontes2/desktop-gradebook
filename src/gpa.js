const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const grades = document.getElementsByName("grades");
  const credits = document.getElementsByName("credits");
  const calculatedGPA = document.getElementById("calculatedGPA");
  const totalCredits = document.getElementById("totalCreditsInput");

  function calculate() {
    const gradesAndCredits = [];

    grades.forEach((input, index) => {
      const gradeValue = input.value;
      const creditValue = parseFloat(credits[index].value);
      if (!isNaN(creditValue)) {
        gradesAndCredits.push([gradeValue, creditValue]);
      }
    });

    invoke("calculate_gpa", { gpaData: gradesAndCredits }).then((result) => {
      calculatedGPA.value = result[0];
      totalCredits.value = result[1];
    });
  }
  function clear() {
    grades.forEach((input, index) => {
      input.value = "";
      credits[index].value = "";
    });

    calculatedGPA.value = "";
    totalCredits.value = "";
  }
  document.getElementById("calculate").addEventListener("click", calculate);
  document.getElementById("clear").addEventListener("click", clear);
});

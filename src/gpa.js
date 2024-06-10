const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const grades = document.getElementsByName("grades");
  const credits = document.getElementsByName("credits");
  const calculatedGPA = document.getElementById("calculatedGPA");
  const totalCredits = document.getElementById("totalCreditsInput");
  const prevSemGPA = document.getElementById("prevSemGPA");
  const prevSemCredits = document.getElementById("prevSemCredits");

  function calculate() {
    const gradesAndCredits = [];
	let currentQP = 0;
	let currentCredits = 0;
	if (prevSemGPA.value != 0 && prevSemCredits.value != 0){
		currentQP = prevSemGPA.value * prevSemCredits.value;
		currentCredits = parseFloat(prevSemCredits.value);
	}
	
		

    grades.forEach((input, index) => {
      const gradeValue = input.value;
      const creditValue = parseFloat(credits[index].value);
      if (!isNaN(creditValue)) {
        gradesAndCredits.push([gradeValue, creditValue]);
      }
    });

    invoke("calculate_gpa", { gpaData: gradesAndCredits, oldQp: currentQP, oldCredits: currentCredits}).then((result) => {
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

	prevSemGPA.value = "";
	prevSemCredits.value = "";
  }
  document.getElementById("calculate").addEventListener("click", calculate);
  document.getElementById("clear").addEventListener("click", clear);
});

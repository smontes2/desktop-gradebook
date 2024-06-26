const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const classes = document.getElementsByName("class");
  const grades = document.getElementsByName("grades");
  const credits = document.getElementsByName("credits");
  const calculatedGPA = document.getElementById("calculatedGPA");
  const totalCredits = document.getElementById("totalCreditsInput");
  const prevSemGPA = document.getElementById("prevSemGPA");
  const prevSemCredits = document.getElementById("prevSemCredits");
  const rowBody = document.getElementById("row");

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

  function addRow(){
	const newRow = document.createElement("tr");
	const grades = ['-', 'A', 'A-','B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

	const textCell = document.createElement("td");
	const textInput = document.createElement("input");
	const gradeSelectCell = document.createElement("td");
	const gradeSelectInput = document.createElement("select");
	const creditCell = document.createElement("td");
	const creditInput = document.createElement("input");

	textInput.name = "class";
	gradeSelectInput.name = "grades";
	gradeSelectInput.id = "grades";
	creditInput.name = "credits";
	creditInput.type = "number";
	
	for (let i = 0; i < grades.length; i ++){
		const option = document.createElement("option");

		option.value = grades[i];
		option.text = grades[i];

		gradeSelectInput.appendChild(option);
	}

	textCell.appendChild(textInput);
	gradeSelectCell.appendChild(gradeSelectInput);
	creditCell.appendChild(creditInput);

	newRow.appendChild(textCell);
	newRow.appendChild(gradeSelectCell);
	newRow.appendChild(creditCell);

	rowBody.appendChild(newRow);

  }

  function removeRow(rowIndex){
	if(rowBody.rows.length > 4){
		rowBody.deleteRow(rowIndex);
	}
  }

  function importGrades(){
	invoke("fetch_classes").then((result) => {
		for(let i = 0; i < result.length; i ++){
			if (classes){
				classes[i].value = result[i][0];
				grades[i].value = result[i][1];
			}
	
		}
	})
  }
  document.getElementById("deleteRow").addEventListener("click",function(){
	removeRow(-1);
  });
  document.getElementById("calculate").addEventListener("click", calculate);
  document.getElementById("clear").addEventListener("click", clear);
  document.getElementById("addRow").addEventListener("click", addRow);
  document.getElementById("importGradesBtn").addEventListener("click", importGrades);
});

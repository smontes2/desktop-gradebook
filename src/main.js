const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const rowContainer = document.getElementById("row");
  const grade = document.getElementsByName("grade");
  const weight = document.getElementsByName("weight");
  const assignment = document.getElementsByName("assignment");
  const calculatedLetterGrade = document.getElementById(
    "calculatedLetterGrade"
  );
  const calculatedNumberGrade = document.getElementById(
    "calculatedNumberGrade"
  );
  const prevCalc = document.getElementById("prevCalc");
  const existingClass = document.getElementById("existingClass");
  const addToGradesBtn = document.getElementById("addToGradesBtn");
   
  
  invoke("fetch_classes").then((result) => {
    
    for(let i = 0; i < result.length; i ++){
      const classOption = document.createElement("option");
      
      classOption.value = result[i][0];
      classOption.text = result[i][0];
      classOption.id = "classOption";

      existingClass.appendChild(classOption);
    }
  });

  function addToGrades(){
    const calculatedGrade = document.getElementById("calculatedLetterGrade");
    const existingClass = document.getElementById("existingClass");
    let className;

    if (existingClass.value == "-"){
     className = document.getElementById("className");
    }
    else{
      className = existingClass; 
    }

    const assignmentArray = [];
    const gradeArray = [];
    const weightArray = [];

    assignment.forEach((input, index) =>{
      assignmentArray.push(input.value);
      if(!isNaN(parseFloat(grade[index].value)) && !isNaN(parseFloat(weight[index].value))){
        gradeArray.push(parseFloat(grade[index].value));
        weightArray.push(parseFloat(weight[index].value));
      }

    })
    
      invoke("create_grade_table", {class: className.value, classGrade: calculatedGrade.value})
      invoke("create_classes_table" ,{class: className.value, classAssignment: assignmentArray, classGrade: gradeArray, classWeight: weightArray})
   
    // location.reload();

  }

  function calculateTotal() {
    const gradesAndWeights = [];

    grade.forEach((input, index) => {
      const gradeValue = parseFloat(input.value);
      const weightValue = parseFloat(weight[index].value);
      if (!isNaN(gradeValue) && !isNaN(weightValue)) {
        gradesAndWeights.push([gradeValue, weightValue]);
      }
    });

    invoke("calculate_weighted_grade", { grades: gradesAndWeights }).then(
      (result) => {
        calculatedNumberGrade.value = result;
        return invoke("calculate_letter_grade", { num: result }).then(
          (letterGradeResult) => {
            calculatedLetterGrade.value = letterGradeResult;
          }
        );
      }
    );
  }

  function addRow(numberOfRows) {
    for(let i = 0; i < numberOfRows; i ++){
      const newRow = document.createElement("tr");

      const textCell = document.createElement("td");
      const textInput = document.createElement("input");
      const gradeCell = document.createElement("td");
      const gradeInput = document.createElement("input");
      const weightCell = document.createElement("td");
      const weightInput = document.createElement("input");

      textInput.name = "assignment";
      gradeInput.name = "grade";
      weightInput.name = "weight";

      textInput.id = "assignment";
      gradeInput.id = "grade";
      weightInput.id = "weight";
      
      gradeInput.type = "number";
      weightInput.type = "number";

      textCell.appendChild(textInput);
      newRow.appendChild(textCell);
      gradeCell.appendChild(gradeInput);
      newRow.appendChild(gradeCell);
      weightCell.appendChild(weightInput);
      newRow.appendChild(weightCell);

      rowContainer.appendChild(newRow); 
    }
  }

  function removeRow(rowIndex) {
    if (rowContainer.rows.length > 4) {
      rowContainer.deleteRow(rowIndex);
    }
  }

  function clear() {
    grade.forEach((input, index) => {
      input.value = "";
      weight[index].value = "";
      assignment[index].value = "";
    });

    calculatedLetterGrade.value = "";
    calculatedNumberGrade.value = "";
  }

  function change(){
    const className = document.getElementById("existingClass");
    const assignmentElements = document.getElementsByName("assignment");

    if (className.value != "-"){
      addToGradesBtn.textContent = "Update";
    }
    else{
      addToGradesBtn.textContent = "Add To Grades";
      clear();
    }

   

    invoke("fetch_assignment_data", {class: className.value}).then((result) => {
     
      if(result[0][0].length > 4){
        addRow(result[0][0].length - 4);
      }
      assignmentElements.forEach((input, index)=>{
        input.value = result[0][0][index];
        grade[index].value = result[0][1][index];
        weight[index].value = result[0][2][index];
      })
    });
  }

  document.getElementById("remove_row").addEventListener("click", function () {
    removeRow(-1);
  });

  document.getElementById("clear").addEventListener("click", clear);

  document.getElementById("add_row").addEventListener("click", function(){
    addRow(1);
  });

  document
    .getElementById("calculate")
    .addEventListener("click", calculateTotal);

  // document.getElementById("addClassBtn").addEventListener("click", function () {
  //   const userInput = document.getElementById("userInput");
  //   const clonedUserInput = userInput.cloneNode(true);
  //   userInput.appendChild(clonedUserInput);
  // });

  document.getElementById("addToGradesBtn").addEventListener("click", addToGrades);

  document.getElementById("existingClass").addEventListener("change", change);
});

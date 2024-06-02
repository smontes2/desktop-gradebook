const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const gradeTable = document.getElementById("gradeTable");
  const rowContainer = document.getElementById("row");
  const grade = document.getElementsByName("grade");
  const weight = document.getElementsByName("weight");
  const assignment = document.getElementsByName("assignment");
  const gradeResult = document.getElementById("gradeResult");
  const prev_calc = document.getElementsByName("prev_calc");

  function calculateTotal(){

    const gradesAndWeights = [];

    grade.forEach((input, index) => {
      const gradeValue = parseFloat(input.value);
      const weightValue = parseFloat(weight[index].value);
      if(!isNaN(gradeValue) && !isNaN(weightValue)){
        gradesAndWeights.push([gradeValue, weightValue]);
      }
    });

    invoke("calculate_weighted_grade", {grades: gradesAndWeights}).then(result => {
      const output = document.createElement("h3");
      output.textContent = result;
      gradeResult.appendChild(output);
    })
  }

  function addRow() {
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

    textCell.appendChild(textInput);
    newRow.appendChild(textCell);
    gradeCell.appendChild(gradeInput);
    newRow.appendChild(gradeCell);
    weightCell.appendChild(weightInput);
    newRow.appendChild(weightCell);

    rowContainer.appendChild(newRow);
  }

  function removeRow(rowIndex){
    if (rowContainer.rows.length > 4){
      rowContainer.deleteRow(rowIndex);
    }
  }

  function clear(){
    grade.forEach((input, index) =>{
      input.value = "";
      weight[index].value = "";
      assignment[index].value = "";
    });    
  }

  document.getElementById("remove_row").addEventListener("click", function(){
    removeRow(-1);
  });

  document.getElementById("clear").addEventListener("click", clear);

  document.getElementById("add_row").addEventListener("click", addRow);

  document.getElementById("calculate").addEventListener("click", calculateTotal);
  
});

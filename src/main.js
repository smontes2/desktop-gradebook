const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const gradeTable = document.getElementById("gradeTable");
  const rowContainer = document.getElementById("row");
  const grade = document.getElementsByName("grade");
  const weight = document.getElementsByName("weight");

  function calculateTotal(){
    grade.forEach((input, index) => {
      console.log(`Input ${index + 1}:`, input.value);
    });
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

  document.getElementById("remove_row").addEventListener("click", function(){
    removeRow(-1);
  });

  document.getElementById("add_row").addEventListener("click", addRow);

  document.getElementById("calculate").addEventListener("click", calculateTotal);
  
});

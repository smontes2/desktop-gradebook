const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const classes = document.getElementById("classes");
  const classAndGradeList = document.getElementById("classTable");

  invoke("fetch_classes").then((result) => {
    for(let i = 0; i < result.length; i ++){

  

      const classTableRow = document.createElement("tr");
      const classTableClassData = document.createElement("td");
      const classTableValue = document.createElement("input");
      const classTableGradeData = document.createElement("td");
      const classTableGradeValue = document.createElement("input");
      const deleteBtnData = document.createElement("td");
      const deleteBtn = document.createElement("button");

      deleteBtn.innerHTML = "&times";
      deleteBtn.classList.add("deleteBtn"); 

      classTableValue.value = result[i][0];
      classTableGradeValue.value = result[i][1];
      classTableValue.readOnly = true;
      classTableGradeValue.readOnly = true;
      classTableClassData.appendChild(classTableValue);
      classTableRow.appendChild(classTableClassData);
      classTableGradeData.appendChild(classTableGradeValue);
      classTableRow.appendChild(classTableGradeData);
      deleteBtnData.appendChild(deleteBtn);
      classTableRow.appendChild(deleteBtnData);

      classAndGradeList.appendChild(classTableRow);
  

      deleteBtn.addEventListener("click", function() { deleteClass(result[i][0]); }); 
    }
  });

  function deleteClass(className) {
    invoke("delete", { class: className });
    location.reload();
  }
});
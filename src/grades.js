const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const classes = document.getElementById("classes");
  const classAndGradeList = document.getElementById("classTable");
  const greeting = document.getElementById("greeting");
  const currentGpa = document.getElementById("currentGpa");
  const time = document.getElementById("time");
  const date = new Date();

  if(date.getHours() >= 4 && date.getHours() <= 12){
	greeting.textContent = "Good Morning, Samuel";
  }
  else if(date.getHours() > 12 && date.getHours() <= 16){
	greeting.textContent = "Good Afternoon, Samuel";
  }
  else{
	greeting.textContent = "Good Evening, Samuel";
  }

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
	  
	  getGpa();
    }
  });

  async function getGpa(){
	await invoke("fetch_gpa_data").then((result) =>{
		currentGpa.value = result[0];
		time.textContent = "Here are your grades as of " + result[1].substring(0,11);
	})
  }

  async function deleteClass(className) {
    await invoke("delete", { class: className });
    location.reload();
  }
});
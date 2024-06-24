const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () => {
  const classes = document.getElementById("classes");


  invoke("fetch_classes").then((result) => {
	for(let i = 0; i < result.length; i ++){
		const fetchClass = document.createElement("option");

		fetchClass.value = result[i];
		fetchClass.text = result[i];

		classes.appendChild(fetchClass);
	}
  });

  console.log(classes.value);

  function deleteClass() {
    invoke("delete", { class: classes.value });
  }

  document.getElementById("deleteBtn").addEventListener("click", deleteClass);

});

const { invoke } = window.__TAURI__.tauri;

document.addEventListener("DOMContentLoaded", () =>{
	const className = document.getElementById("className");
	function deleteClass(){
		invoke("delete", {class: className.value})
	}


	document.getElementById("deleteBtn").addEventListener("click", deleteClass);
});
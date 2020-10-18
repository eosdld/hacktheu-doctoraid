var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
    console.log(el("image-picked"));
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  console.log(uploadFiles);
  console.log(uploadFiles[0]);
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing..."

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);

  var xhr = new XMLHttpRequest();
  //var loc = window.location;
  //xhr.open("GET", "https://cors-escape.herokuapp.com/https://maximum.blog/@shalvah/posts");
  xhr.open("POST", 'https://us-west3-doctoraid-292917.cloudfunctions.net/covid_19_detector', true);
  xhr.send(fileData);

  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      // console.log(response);
      // console.log(response.Confidence);
      el("result-label").innerHTML = `Result = ${response}%`;
    }
    el("analyze-button").innerHTML = "Analyze";
  };
}


// Launch on terminal to eliminate CORPS problem
// start chrome --user-data-dir="C://Chrome dev session" --disable-web-security

// MacOSx
// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
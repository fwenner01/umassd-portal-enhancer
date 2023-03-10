function calculateGradePercentages() {
  var mybbCanvas = document.getElementById('mybbCanvas');

  if(!mybbCanvas) {
    return
  }

  mybbCanvas.addEventListener("load", function() {
    var doc = mybbCanvas.contentDocument;

    var rightStream = doc.getElementById('right_stream_mygrades');

    rightStream.addEventListener("load", function() {
      var doc2 = rightStream.contentDocument;
    
      const cellGrades = doc2.querySelectorAll('.cell.grade');
    
      cellGrades.forEach(cellGrade => {
        score = cellGrade.innerText.split("/");
        if(score.length > 1 && score[1].includes('\n')) {
          score[1] = score[1].split("\n")[0];

        }
        percent = (Number(score[0])/Number(score[1])) * 100;
        if(!isNaN(percent)) {
          newText = "\n(" + percent.toString() + "%)";
          cellGrade.innerHTML +=  "<span style='color:blue; font-size:13px;'>" + newText + "</span>";
        }
      });
    })

  });
}

function saveText(port, courseId) {
  console.log("SAVING")
  var content;
  iframe = document.getElementById("textEditor")
  if(iframe) {
      editor = iframe.contentWindow.document.getElementById('editor')
      content = editor.value
  }
  else {
      content = ""
  }
  port.postMessage({action: "saveText", text: content, course: courseId})
  //global_text = content
  return content
}

function addTextEditorElements(iframe) {
  // add editor container
  container = iframe.contentDocument.createElement("div");
  container.setAttribute("id", "editor-container");
  container.style.position = "absolute";
  container.style.top = "50%";
  container.style.left = "50%";
  container.style.transform = "translate(-50%, -50%)";
  container.style.width = "90%";
  container.style.height = "90%";
  container.style.backgroundColor = "white";
  container.style.border = "1px solid black";
  container.style.padding = "20px";
  container.style.boxSizing = "border-box";

  // add text area
  editor = iframe.contentDocument.createElement("textarea");
  editor.setAttribute("id", "editor");
  editor.style.width = "100%";
  editor.style.height = "calc(100% - 40px)";
  editor.style.resize = "none";

  container.appendChild(editor)

  // add button container
  buttons = iframe.contentDocument.createElement("div");
  buttons.setAttribute("id", "editor-buttons");
  buttons.style.textAlign = "center";
  buttons.style.marginTop = "10px";

  // add save button
  saveButton = iframe.contentDocument.createElement("button");
  saveButton.setAttribute("id", "save-button");
  saveButton.innerHTML = "Save";

  buttons.appendChild(saveButton)

  // add clear button
  clearButton = iframe.contentDocument.createElement("button");
  clearButton.setAttribute("id", "clear-button");
  clearButton.innerHTML = "Clear";

  buttons.appendChild(clearButton)

  container.appendChild(buttons)

  iframe.contentDocument.body.appendChild(container);
}

function openTextEditor(global_text, port, courseId) {
  //const editorHTML = getEditorHTML();
  const editorIframe = document.createElement("iframe");
  //editorIframe.srcdoc = editorHTML
  editorIframe.setAttribute("id", "textEditor");
  editorIframe.style.position = "absolute";
  editorIframe.style.top = "50%"
  editorIframe.style.left = "50%"
  editorIframe.style.width = "60%";
  editorIframe.style.height = "60%";
  editorIframe.style.transform = "translate(-50%, -50%)";
  editorIframe.style.position = "fixed";
  editorIframe.style.backgroundColor = "rgba(0,0,0,0.5)";
  editorIframe.style.zIndex = "9999";
  document.body.appendChild(editorIframe);

  editorIframe.addEventListener("load", function() {

    addTextEditorElements(editorIframe)

    var editor = editorIframe.contentDocument.getElementById("editor")
    editor.focus()
    editor.value = global_text

    saveButton = editorIframe.contentDocument.getElementById('save-button')
    saveButton.onclick = function() {
      global_text = saveText(port, courseId)
      document.body.removeChild(editorIframe)
      //editorIframe.style.display = "none";
    }
  })
}

function modifyMenuPalette() {
  var menuPalette = document.getElementById("courseMenuPalette_contents");

  if(!menuPalette) {
    return
  }

  // get course ID from the page URL
  var url = window.location.href
  var courseId = url.split("course_id=")
  var index = courseId[1].search("&")
  if(index != -1) {
    courseId = courseId[1].substring(0, index)
  }

  var global_text = ""

  var port = browser.runtime.connect({name: "my-port"});

  port.onMessage.addListener(function(message) {
    if(message.text === undefined) {
      global_text = ""
    }
    else {
      global_text = message.text
    }
    openTextEditor(global_text, port, courseId)
  });

  // create 'Notes' span inside of an anchor
  var li = document.createElement("li");
  var a = document.createElement("a");
  a.onclick = function(){
      port.postMessage({action: "loadText", course: courseId});
  }
  var span = document.createElement("span");
  span.innerHTML = "Notes"
  a.appendChild(span)
  li.appendChild(a)
  menuPalette.appendChild(li);
}

calculateGradePercentages();
modifyMenuPalette();
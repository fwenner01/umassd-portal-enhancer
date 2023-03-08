function calculateGradePercentages() {
  var mybbCanvas = document.getElementById('mybbCanvas');

  mybbCanvas.addEventListener("load", function() {
    var doc = mybbCanvas.contentDocument;
    console.log(doc);

    var rightStream = doc.getElementById('right_stream_mygrades');
    console.log(rightStream);

    rightStream.addEventListener("load", function() {
      var doc2 = rightStream.contentDocument;
    
      console.log(doc2)
    
      const cellGrades = doc2.querySelectorAll('.cell.grade');
    
      cellGrades.forEach(cellGrade => {
        console.log(cellGrade.innerText);
        score = cellGrade.innerText.split("/")
        if(score.length > 1 && score[1].includes('\n')) {
          score[1] = score[1].split("\n")[0]

        }
        percent = (Number(score[0])/Number(score[1])) * 100
        if(!isNaN(percent)) {
          newText = "\n(" + percent.toString() + "%)"
          cellGrade.innerHTML +=  "<span style='color:blue; font-size:13px;'>" + newText + "</span>"
        }
      });
    })

  });
}

calculateGradePercentages();
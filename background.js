browser.runtime.onConnect.addListener(function(port) {
  console.log("Connected:", port.name);

  port.onMessage.addListener(function(message) {
    if(message.action === "saveText") {
      console.log("SAVING")
      var dict = {}
      dict[message.course] = message.text
      browser.storage.local.set(dict)
    }
    if(message.action === "loadText") {
      console.log("LOADING")
      course = message.course
      browser.storage.local.get(course, function(result) {
        console.log(result)
        loadedText = result[course]
        port.postMessage({text: loadedText})
      })
    }
  });
});
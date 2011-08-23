// courtesy Tim Down
// http://stackoverflow.com/questions/4489119/jquery-javascript-search-dom-for-text-and-insert-html
function replaceText(node, text, replacementNodeTemplate) {
  if (node.nodeType == 3) {
    while (node) {
      var textIndex = node.data.indexOf(text), currentNode = node;
      if (textIndex == -1) {
        node = null;
      } else {
        // Split the text node after the text
        var splitIndex = textIndex + text.length;
        var replacementNode = replacementNodeTemplate.cloneNode(true);
        if (splitIndex < node.length) {
          node = node.splitText(textIndex + text.length);
          node.parentNode.insertBefore(replacementNode, node);
        } else {
          node.parentNode.appendChild(replacementNode);
          node = null;
        }
        currentNode.deleteData(textIndex, text.length);
      }
    }
  } else {
    var child = node.firstChild, nextChild;
    while (child) {
      nextChild = child.nextSibling;
      replaceText(child, text, replacementNodeTemplate);
      child = nextChild;
    }
  }
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  var edits = request.edits;
  if (edits && edits.length) {
    for (var i = 0; i < edits.length; i++) {
      var edit = edits[i];
      var span = document.createElement("span");
      span.style.color = "red";
      span.style.fontWeight = "bold";
      span.title = edit.original;
      span.appendChild(document.createTextNode(edit.proposal));
      replaceText(document.body, edit.original, span);
    }
  }
  sendResponse({});
});

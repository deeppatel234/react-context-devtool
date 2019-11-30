/* global chrome */

var devPanelConnection = null;

chrome.runtime.onConnect.addListener(function(devToolsConnection) {
  console.log(devToolsConnection);
  devPanelConnection = devToolsConnection;
  // assign the listener function to a variable so we can remove it later
  var devToolsListener = function(message, sender, sendResponse) {
      // Inject a content script into the identified tab
      // chrome.tabs.executeScript(message.tabId,
      //     { file: message.scriptToInject });
      console.log('fron background scipt', message);
  }
  // add the listener
  devToolsConnection.onMessage.addListener(devToolsListener);

  devToolsConnection.onDisconnect.addListener(function() {
       devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});


chrome.runtime.onMessage.addListener((request, sender) => {
  console.log(request, sender);
  if (devPanelConnection) {
    devPanelConnection.postMessage(request);
  }
});

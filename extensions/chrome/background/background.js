/* global chrome */

const connections = {};
const catchData = {};

chrome.runtime.onConnect.addListener(port => {
  const panelListener = message => {
    if (message.type === "INIT") {
      connections[message.tabId] = port;
      if (catchData[message.tabId]) {
        port.postMessage(getCatchData(message.tabId));
      }
      return;
    }
  };

  port.onMessage.addListener(panelListener);

  port.onDisconnect.addListener(function() {
    port.onMessage.removeListener(panelListener);

    // remove connection object
    const tabs = Object.keys(connections);
    for (let i=0, len=tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]]
        break;
      }
    }
  });
});

chrome.tabs.onRemoved.addListener(tabId => {
  if (catchData[tabId]) {
    delete catchData[tabId];
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (sender.tab) {
    const tabId = sender.tab.id;
    saveCatchData(request, tabId);
    if (tabId in connections) {
      connections[tabId].postMessage(getCatchData(tabId));
    }
  }
  return true;
});


const saveCatchData = (dataToCatch, tabId) => {
  if (!catchData[tabId]) {
    catchData[tabId] = {};
  }

  const { id } = dataToCatch;

  if (!catchData[tabId][id]) {
    catchData[tabId][id] = { oldValue: {}, newValue: {}};
  }

  catchData[tabId][id].oldValue = catchData[tabId][id].newValue;
  catchData[tabId][id].newValue = dataToCatch;

  console.log(catchData);
};

const getCatchData = (tabId) => {
  return catchData[tabId];
};
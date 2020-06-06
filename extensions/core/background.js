/* global chrome */

const connections = {};
const catchData = {};

chrome.runtime.onConnect.addListener(port => {
  const panelListener = message => {
    if (message.type === "REACT_CONTEXT_DEVTOOL_INIT") {
      connections[message.tabId] = port;
      if (catchData[message.tabId]) {
        port.postMessage({
          type: 'REACT_CONTEXT_DEVTOOL_DEVPANEL_DATA',
          data: getCatchData(message.tabId),
        });
      }
      return;
    }
  };

  port.onMessage.addListener(panelListener);

  port.onDisconnect.addListener(function() {
    port.onMessage.removeListener(panelListener);

    // remove connection object
    const tabs = Object.keys(connections);
    for (let i = 0, len = tabs.length; i < len; i++) {
      if (connections[tabs[i]] == port) {
        delete connections[tabs[i]];
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
  if (request.type === 'REACT_CONTEXT_DEVTOOL_DETECTED') {
    setAppPopup(true, sender.tab.id);
    return true;
  }

  if (request.type === 'REACT_CONTEXT_DEVTOOL_POPUP_DATA_REQUEST') {
    sendMessageToPopup(request.tabId);
    return true;
  }
  if (request.type === 'REACT_CONTEXT_DEVTOOL_DATA' && sender.tab) {
    const tabId = sender.tab.id;
    saveCatchData(request.data, sender.tab);
    sendMessageToDevPanel(tabId);
    sendMessageToPopup(tabId);
  }
  return true;
});

const sendMessageToPopup = tabId => {
  chrome.runtime.sendMessage({
    type: 'REACT_CONTEXT_DEVTOOL_POPUP_DATA',
    data: getCatchData(tabId),
    tabId,
  });
};

const sendMessageToDevPanel = tabId => {
  if (tabId in connections) {
    connections[tabId].postMessage({
      type: 'REACT_CONTEXT_DEVTOOL_DEVPANEL_DATA',
      data: getCatchData(tabId),
    });
  }
};

const saveCatchData = (dataToCatch, { id: tabId, title }) => {
  if (!catchData[tabId]) {
    catchData[tabId] = {
      tab: {
        id: tabId,
        title
      },
      context: {}
    };
  }

  const { id } = dataToCatch;

  if (!catchData[tabId].context[id]) {
    catchData[tabId].context[id] = {
      oldValue: {},
      newValue: {}
    };
  }

  catchData[tabId].context[id].oldValue = catchData[tabId].context[id].newValue;
  catchData[tabId].context[id].newValue = dataToCatch;
};

const getCatchData = tabId => {
  return catchData[tabId];
};

const setAppPopup = (isActive, tabId) => {
  chrome.browserAction.setIcon({
    tabId,
    path: {
      '16': `assets/icons/icon16${isActive ? '' : '-disabled'}.png`,
      '32': `assets/icons/icon32${isActive ? '' : '-disabled'}.png`,
      '48': `assets/icons/icon48${isActive ? '' : '-disabled'}.png`,
      '128': `assets/icons/icon128${isActive ? '' : '-disabled'}.png`,
    },
  });
  chrome.browserAction.setPopup({
    tabId,
    popup: 'popup/popup.html',
  });
}

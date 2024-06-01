import { sendMessage, onMessage } from "@ext-browser/messaging/background";
import { getCurrentTab } from "./utils";

const catchData = {};

export const saveCatchData = async ({ id: tabId, title }, data = {}) => {
  console.log("data", data);

  if (!catchData[tabId]) {
    catchData[tabId] = {
      tabId,
      tab: {},
      context: {},
      useReducer: {},
      reactInfo: {},
      reactDevtoolPayload: {},
      isReactDetected: false,
    };
  }

  catchData[tabId].tab.title = title;

  if (data.context) {
    const cacheContext = catchData[tabId].context;

    Object.keys(data.context).forEach((key) => {
      if (!cacheContext[key]) {
        cacheContext[key] = {
          oldValue: {},
          newValue: {},
        };
      }

      cacheContext[key].oldValue = cacheContext[key].newValue;
      cacheContext[key].newValue = data.context[key];
    });

    Object.keys(cacheContext).forEach((key) => {
      if (!data.contextKeys.includes(key)) {
        delete cacheContext[key];
      }
    });
  }

  if (data.useReducer) {
    const cacheUseReducer = catchData[tabId].useReducer;

    Object.keys(data.useReducer).forEach((key) => {
      cacheUseReducer[key] = data.useReducer[key];
    });

    Object.keys(cacheUseReducer).forEach((key) => {
      if (!data.useReducerKeys.includes(key)) {
        delete cacheUseReducer[key];
      }
    });
  }

  if (data.reactInfo) {
    catchData[tabId].reactInfo = data.reactInfo;
  }

  if (data.isReactDetected) {
    catchData[tabId].isReactDetected = data.isReactDetected;
  }

  if (data.reactDevtoolPayload) {
    catchData[tabId].reactDevtoolPayload = data.reactDevtoolPayload;
  }

  try {
    await sendMessage(`devtool:${tabId}`, "CONTEXT_DATA", catchData[tabId]);
  } catch (err) {}

  try {
    await sendMessage("popup", "CONTEXT_DATA", catchData[tabId]);
  } catch (err) {}
};

export const removeCatchData = (tabId) => {
  delete catchData[tabId];
};

onMessage("GET_CONTEXT_DATA", async (data, { fromTabId }) => {
  let tabId = fromTabId;

  if (data?.currentTab) {
    const tab = await getCurrentTab();
    tabId = tab?.id;
  }

  return catchData[tabId] || null;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  removeCatchData(tabId)
});

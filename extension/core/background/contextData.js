import { sendMessage } from "@ext-browser/messaging/background";

const catchData = {};

export const saveCatchData = ({ id: tabId, title }, data) => {
  const parsedData = JSON.parse(data);
  console.log(parsedData);

  if (!catchData[tabId]) {
    catchData[tabId] = {
      tab: {},
      context: {},
      useReducer: {},
      reactInfo: {},
    };
  }

  catchData[tabId].tab.title = title;

  if (parsedData.context) {
    const cacheContext = catchData[tabId].context;

    Object.keys(parsedData.context).forEach((key) => {
      if (!cacheContext[key]) {
        cacheContext[key] = {
          oldValue: {},
          newValue: {},
        };
      }

      cacheContext[key].oldValue = cacheContext[key].newValue;
      cacheContext[key].newValue = parsedData.context[key];
    });

    Object.keys(cacheContext).forEach((key) => {
      if (!parsedData.contextKeys.includes(key)) {
        delete cacheContext[key];
      }
    });
  }

  if (parsedData.useReducer) {
    const cacheUseReducer = catchData[tabId].useReducer;

    Object.keys(parsedData.useReducer).forEach((key) => {
      cacheUseReducer[key] = parsedData.useReducer[key];
    });

    Object.keys(cacheUseReducer).forEach((key) => {
      if (!parsedData.useReducerKeys.includes(key)) {
        delete cacheUseReducer[key];
      }
    });
  }

  if (parsedData.reactInfo) {
    catchData[tabId].reactInfo = parsedData.reactInfo;
  }

  sendMessage("popup", "context-data", catchData[tabId]);
  sendMessage(`devtool:${tabId}`, "context-data", catchData[tabId]);
};

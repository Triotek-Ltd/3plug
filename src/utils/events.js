const eventHandlers = {
  before_save: [],
  after_save: [],
  validate: [],
  refresh: [], // Added refresh event
};

export const registerEvent = (event, handler) => {
  if (eventHandlers[event]) {
    eventHandlers[event].push(handler);
  }
};

export const triggerEvent = async (event, frm, updateForm, doc, updateDoc) => {
  if (eventHandlers[event]) {
    for (const handler of eventHandlers[event]) {
      await handler(frm, updateForm, doc, updateDoc);
    }
  }
};

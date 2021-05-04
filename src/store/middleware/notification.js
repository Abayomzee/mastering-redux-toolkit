const notification = (store) => (next) => (action) => {
  if (action.type === "error")
    console.log(`Toastify: ${action.payload.message}`);

  next(action);
};

export default notification;

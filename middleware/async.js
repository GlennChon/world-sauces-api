module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      console.log(ex.errors[field].message);
      next(ex);
    }
  };
};

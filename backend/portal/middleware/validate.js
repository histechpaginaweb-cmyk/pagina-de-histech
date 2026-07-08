// Middleware de validación con Zod. Valida body / query / params y deja el
// resultado tipado en req.valid.
const { HttpError } = require("../lib/http");

function validate(schemas) {
  return (req, _res, next) => {
    try {
      req.valid = {};
      if (schemas.body) req.valid.body = schemas.body.parse(req.body);
      if (schemas.query) req.valid.query = schemas.query.parse(req.query);
      if (schemas.params) req.valid.params = schemas.params.parse(req.params);
      return next();
    } catch (err) {
      if (err?.name === "ZodError") {
        const details = err.flatten ? err.flatten().fieldErrors : err.issues;
        return next(new HttpError(400, "Datos inválidos", details));
      }
      return next(err);
    }
  };
}

module.exports = { validate };

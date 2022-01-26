const BaseSerializer = require('./BaseSerializer');

class TokenSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model != null ? { ...model } : null;

    super('sucess', serializedModel);
  }
}

module.exports = TokenSerializer;

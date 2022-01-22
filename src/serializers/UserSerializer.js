const BaseSerializer = require('./BaseSerializer');

class UserSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model != null ? { ...model } : null;

    serializedModel.password = undefined;

    super('sucess', serializedModel);
  }
}

module.exports = UserSerializer;

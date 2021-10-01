class Entity {
  constructor(entity, store) {
    this.entity = entity;
    this.store = store;

    const entityProfiles = {
      [ENTITY_TYPE_ANY]: [accessors.id, accessors.date, accessors.type],
      [ENTITY_TYPE_ENTITY]: [accessors.name],
      [ENTITY_TYPE_COMMENT]: [accessors.text, accessors.tags],
      [ENTITY_TYPE_TAG]: [accessors.name],
      [ENTITY_TYPE_USER]: [accessors.name],
      [ENTITY_TYPE_TAG_APPLICATION]: [accessors.ratifications, accessors.tag, accessors.subject],
    };

    this.accessors = [...entityProfiles[ENTITY_TYPE_ANY], ...(entityProfiles[entity.type] || [])];

    this.accessors.forEach((accessor) => {
      const getterName = this.accessorToGetterName(accessor);
      this[getterName] = accessor.get.bind(this);
    });
  }

  accessorToGetterName({ getterName }) {
    return 'get' + getterName.charAt(0).toUpperCase() + getterName.slice(1);
  }

  get viewModel() {
    const { entity, store } = this;
    if (!entity) return false;
    const viewModel = {};
    const defaultView = function (accessor) {
      const getterName = this.accessorToGetterName(accessor);
      return this[getterName];
    }.bind(this);
    this.accessors.forEach((accessor) => {
      const { getterName } = accessor;
      viewModel[getterName] = (accessor.view || defaultView(accessor)).call(this);
    });
    return viewModel;
  }

  set entity(entity) {
    if (!entity) {
      throw new Error('Entity data invalid: ', entity);
    } else if (this._entity !== undefined) {
      throw new Error('Entity already set');
    } else {
      this._entity = entity;
    }
  }

  get entity() {
    return this._entity;
  }
}

module.exports = Entity;

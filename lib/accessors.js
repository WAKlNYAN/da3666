const generalAccessors = {
  id: {
    getterName: 'id',
    get: function () {
      const { id } = this.entity;
      return id;
    },
  },
  date: {
    getterName: 'date',
    get: function () {
      const { created } = this.entity.date;
      return created;
    },
  },
  type: {
    getterName: 'type',
    view: function () {
      if (!this.getType().getName) debugger;
      return this.getType().getName();
    },
    get: function () {
      const { entity, store } = this;
      const typeId = entity.type === -1 ? this.getId() : entity.type;
      return store.getEntityById(typeId);
    },
  },
  name: {
    getterName: 'name',
    get: function () {
      const { name } = this.entity;
      return name;
    },
  },
  text: {
    getterName: 'text',
    get: function () {
      const { text } = this.entity;
      return text;
    },
  },
  tags: {
    getterName: 'tags',
    get: function () {
      const { entity, store } = this;
      const tags = [];
      store
        .getEntities((compareEntity) => compareEntity.type === ENTITY_TYPE_TAG_APPLICATION && compareEntity.subjectId === entity.id)
        .forEach((tagApp) => {
          const tagAppRats = tagApp.getRatifications();
          const tag = store.getEntityById(tagApp.getId());
          tags.push({
            tag,
            ratifications: tagAppRats,
          });
        });
      return tags;
    },
    view: function () {
      const tags = {};
      this.getTags().forEach((tag) => {
        console.log('tag', tag);
        tags[tag.tag.getName()] = tag.ratifications.length;
      });
      return tags;
    },
  },
};

const tagAppAccessors = {
  ratifications: {
    getterName: 'ratifications',
    get: function () {
      const { entity, store } = this;
      return store.getEntities((compareEntity) => compareEntity.type === ENTITY_TYPE_TAG_APPLICATION_RATIFICATION && compareEntity.subjectId === entity.id);
    },
    view: function () {
      const { entity, store } = this;
      return this.getRatifications().map((rat) => rat.getDate());
    },
  },
  tag: {
    getterName: 'tag',
    get: function () {
      const { entity, store } = this;
      return store.getEntityById(entity.tagId);
    },
    view: function () {
      return this.getTag().getName();
    },
  },
  subject: {
    getterName: 'subject',
    get: function () {
      const { entity, store } = this;
      return store.getEntityById(entity.subjectId);
    },
    view: function () {
      return this.getSubject().getText();
    },
  },
};

const accessors = {
  ...generalAccessors,
  ...tagAppAccessors,
};

module.exports = accessors;

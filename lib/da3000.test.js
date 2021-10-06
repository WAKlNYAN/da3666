const {
  ENTITY_TYPE_COMMENT,
  ENTITY_TYPE_USER,
} = require('../constants');
const {
  addUser,
  addComment,
  getEntityById,
  store,
} = require('./da3000');

test('Create Bob', () => {
  return addUser('Bob').then(({
    success,
    affectedEntity: {
      type,
      userName,
      sources,
      id,
      date: {
        created,
      },
    },
  }) => {
    expect(success).toBeTruthy();
    expect(type).toBe(0);
    expect(userName).toBe('Bob');
    expect(sources).toContain(0);
    expect(id).toBe(0);
    expect(created).toBeTruthy();
  });
});

test('Create Sue', () => {
  return addUser('Sue').then(({
    success,
    affectedEntity: {
      type,
      userName,
      sources,
      id,
      date: {
        created,
      },
    },
  }) => {
    expect(success).toBeTruthy();
    expect(type).toBe(0);
    expect(userName).toBe('Sue');
    expect(sources).toContain(0);
    expect(id).toBe(1);
    expect(created).toBeTruthy();
  });
});

test('Bob can comment', () => {
  const testText = 'Hello, sue.';
  const testParentId = 1; // Bob is commenting on Sue's user entity
  return addComment({
    text: testText,
    parentId: testParentId
  }).then(({
    success,
    affectedEntity: {
      type,
      text,
      sources,
      id,
      parentId,
      date: {
        created,
      },
    },
  }) => {
    expect(success).toBeTruthy();
    expect(type).toBe(ENTITY_TYPE_COMMENT);
    expect(text).toBe(testText);
    expect(sources).toContain(0);
    expect(id).toBe(2);
    expect(parentId).toBe(testParentId);
    expect(created).toBeTruthy();
  });
});

test('We can see Bob\'s comment', () => {
  const testText = 'Hello, sue.';
  const testParentId = 1; // Bob is commenting on Sue's user entity
  const entity = getEntityById(2);
  const {
    type,
    text,
    sources,
    id,
    parentId,
    date: { created },
  } = entity._entity;

  expect(type).toBe(ENTITY_TYPE_COMMENT);
  expect(text).toBe(testText);
  expect(sources).toContain(0);
  expect(id).toBe(2);
  expect(parentId).toBe(testParentId);
  expect(created).toBeTruthy();
});

test('Entity snapshot is correct', () => {
  expect(store.entities.length).toBe(3);
  store.entities.forEach((entity) => {
    const snapshotMatchers = {
      date: {
        created: expect.any(Date),
      }
    };
    expect(entity).toMatchSnapshot(
      snapshotMatchers
    );
  });
});

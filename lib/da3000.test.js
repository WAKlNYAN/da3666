const {
  addUser,
  addComment,
  store,
} = require('./da3000');

test('User can be created', () => {
  return addUser('Bob').then(data => {
    const {
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
    } = data;

    expect(success).toBeTruthy();
    expect(type).toBe(0);
    expect(userName).toBe('Bob');
    expect(sources).toContain(0);
    expect(id).toBe(0);
    expect(created).toBeTruthy();
  });
});

test('Second user can be created', () => {
  return addUser('Sue').then(data => {
    const {
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
    } = data;

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
    expect(type).toBe(0);
    expect(text).toBe(testText);
    expect(sources).toContain(0);
    expect(id).toBe(2);
    expect(parentId).toBe(testParentId);
    expect(created).toBeTruthy();
  });
});

test('Entity snapshot is correct', () => {
  store.entities.forEach((entity) => {
    expect(entity).toMatchSnapshot(
      {
        date: {
          created: expect.any(Date),
        }
      }
    );
  });
});

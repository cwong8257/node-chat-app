const { Users } = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: '1',
        name: 'Mike',
        room: 'Node Course',
      },
      {
        id: '2',
        name: 'Jen',
        room: 'React Course',
      },
      {
        id: '3',
        name: 'Julie',
        room: 'Node Course',
      },
    ];
  });

  it('should add new user', () => {
    const customUsers = new Users();
    const user = {
      id: '123',
      name: 'Chris',
      room: 'Friends',
    };
    const resUser = customUsers.addUser(user.id, user.name, user.room);

    expect(customUsers.users).toEqual([user]);
    expect(resUser).toEqual(user);
  });

  it('should remove a user', () => {
    const removedUser = users.removeUser('1');

    expect(removedUser).toEqual({
      id: '1',
      name: 'Mike',
      room: 'Node Course',
    });

    expect(users.users.length).toBe(2);
  });

  it('should not remove user', () => {
    const removedUser = users.removeUser('4');

    expect(removedUser).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it('should find user', () => {
    const foundUser = users.getUser('3');

    expect(foundUser).toEqual(users.users[2]);
  });

  it('should not find user', () => {
    const foundUser = users.getUser('5');

    expect(foundUser).toBe(undefined);
  });

  it('should return names for node course', () => {
    const names = users.getUserList('Node Course');

    expect(names).toEqual(['Mike', 'Julie']);
  });

  it('should return names for react course', () => {
    const names = users.getUserList('React Course');

    expect(names).toEqual(['Jen']);
  });
});

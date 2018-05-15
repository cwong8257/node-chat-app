class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users.push(user);

    return user;
  }

  removeUser(id) {
    const { users } = this;
    const { length } = users;

    for (let i = 0; i < length; i += 1) {
      if (users[i].id === id) {
        return users.splice(i, 1)[0];
      }
    }

    return undefined;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    return this.users.filter(user => user.room === room).map(user => user.name);
  }
}

module.exports = { Users };

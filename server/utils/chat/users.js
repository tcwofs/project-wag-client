const users = [];

const addUser = ({ id, username, room }) => {
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => user.username === username && user.room === room);

  if (existingUser) {
    return { error: 'Username is taken. Please reload page' };
  }

  const user = { id, username, room };

  users.push(user);

  return { user };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };

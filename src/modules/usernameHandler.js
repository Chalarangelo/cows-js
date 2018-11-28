const usernameHandler = {
  users: [],
  checkUsername(username) {
    return !this.users.map(u => u.username).includes(username) && username.trim();
  },
  addUsername(username, ip) {
    this.users.push({
      username: username.trim(),
      ip: ip
    });
  },
  removeUsername(username) {
    this.users = this.users.filter(u => u.username !== username);
  },
  findUsername(ip){
    console.log(this.users);
    return this.users.filter(u => u.ip === ip)[0].username;
  }
}

module.exports = usernameHandler;
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
    let previousLength = this.users.length;
    this.users = this.users.filter(u => u.username !== username);
    return this.users.length !== previousLength;
  },
  findUsername(ip){
    let results = this.users.filter(u => u.ip === ip);
    return results.length ? results[0].username : null;
  }
}

module.exports = usernameHandler;
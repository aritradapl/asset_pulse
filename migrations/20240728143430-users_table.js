module.exports = {
  async up(db, client) {
    await db.createCollection("users");
  },

  async down(db, client) {
    db.dropCollection("users");
  }
};

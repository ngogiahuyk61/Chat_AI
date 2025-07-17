module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('conversations', [
      { id: 1, user_id: 1, title: 'Demo hội thoại', created_at: new Date() },
    ]);
    await queryInterface.bulkInsert('messages', [
      { id: 1, conversation_id: 1, sender: 'user', message: 'Xin chào!', created_at: new Date() },
      { id: 2, conversation_id: 1, sender: 'bot', message: 'Chào bạn! Tôi có thể giúp gì?', created_at: new Date() },
    ]);
    await queryInterface.bulkInsert('documents', [
      { id: 1, title: 'Demo PDF', file_path: '/files/demo.pdf', embedded: true },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('messages', null, {});
    await queryInterface.bulkDelete('conversations', null, {});
    await queryInterface.bulkDelete('documents', null, {});
  },
}; 
module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('roles', [
      { 
        id: queryInterface.sequelize.fn('gen_random_uuid'),
        name: 'USER', 
        description: 'Authenticated user with basic access' 
      },
      { 
        id: queryInterface.sequelize.fn('gen_random_uuid'),
        name: 'CREATOR', 
        description: 'User with content creation permissions' 
      },
      { 
        id: queryInterface.sequelize.fn('gen_random_uuid'),
        name: 'ADMIN', 
        description: 'Administrator with full authority' 
      }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', { name: ['USER', 'CREATOR', 'ADMIN'] });
  }
};

const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../config/db');

const Contact = db.define(
  'contacts',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(15)
    },
    type: {
      type: Sequelize.STRING(50),
      defaultValue: 'personal'
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Date.now
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'users'
        }
      },
      key: 'id'
    }
  },
  {
    timestamps: false
  }
);

Contact.sync();

module.exports = Contact;

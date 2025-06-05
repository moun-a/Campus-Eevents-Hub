const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('academic', 'social', 'sports', 'cultural'),
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    maxAttendees: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    currentAttendees: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'upcoming'
    },
    organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
});

// Define relationships
Event.belongsTo(User, { as: 'organizer', foreignKey: 'organizerId' });
Event.belongsToMany(User, { 
    through: 'EventAttendees',
    as: 'attendees',
    foreignKey: 'eventId',
    otherKey: 'userId'
});

User.hasMany(Event, { as: 'organizedEvents', foreignKey: 'organizerId' });
User.belongsToMany(Event, {
    through: 'EventAttendees',
    as: 'attendingEvents',
    foreignKey: 'userId',
    otherKey: 'eventId'
});

module.exports = Event; 
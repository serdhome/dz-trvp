const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Plane = sequelize.define('plane', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Flight = sequelize.define('flight', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    target: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Booking = sequelize.define('booking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Plane.hasMany(Flight, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});
Flight.belongsTo(Plane, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});

Flight.hasMany(Booking, {
    foreignKey: 'flightId',
    as: 'bookings',
    onDelete: 'CASCADE',
});
Booking.belongsTo(Flight, {
    foreignKey: 'flightId',
    as: 'flight',
    onDelete: 'CASCADE',
});

const initializeDatabase = async () => {
    try {
        await sequelize.sync();
        const existingPlanes = await Plane.findAll();
        if (existingPlanes.length === 0) {
            const planesData = [
                { name: 'Боинг 720', value: 100 },
                { name: 'Боинг 221', value: 282 },
            ];
            await Plane.bulkCreate(planesData);
        }
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
    }
};
initializeDatabase();
module.exports = { Plane, Flight, Booking };
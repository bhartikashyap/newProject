const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        nationality: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        // defaultScope: {
        //     // exclude hash by default
        //     attributes: { attributes: {} }
        // },
        // scopes: {
        //     // include hash with this scope
        //     withHash: { attributes: {}, }
        // }
    };
    return sequelize.define('user', attributes, options);
}
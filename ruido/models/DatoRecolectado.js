'use strict';
module.exports = (sequelize, DataTypes) => {
    const DatoRecolectado = sequelize.define('DatoRecolectado', {
        dato: {type: DataTypes.DECIMAL(10, 2), allowNull: false },
        fecha: {type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW},
        hora: {type: DataTypes.STRING(10), allowNull: false, defaultValue: "NO DATA"},
        external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false},
    }, { 
        freezeTableName: true 
    });
    return DatoRecolectado;
};

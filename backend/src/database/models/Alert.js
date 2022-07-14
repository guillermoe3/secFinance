module.exports = (sequelize, DataTypes) => {

    const Alert = sequelize.define("Alert", {
        id_alerta: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_user: {
            type: DataTypes.INTEGER
        },
        category: {
            type: DataTypes.STRING,
        },
        titulo: {
            type: DataTypes.STRING
        },
        severity: {
            type: DataTypes.STRING
        },
        body1: {
            type: DataTypes.STRING
        },
        body2: {
            type: DataTypes.STRING
        },
        business: {
            type: DataTypes.STRING
        }
     

    }, {
        tableName: "alerts",
        timestamps: false
    });


    return Alert;
}
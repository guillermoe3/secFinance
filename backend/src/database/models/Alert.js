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
        description: {
            type: DataTypes.STRING
        }
     

    }, {
        tableName: "alerts",
        timestamps: false
    });


    return Alert;
}
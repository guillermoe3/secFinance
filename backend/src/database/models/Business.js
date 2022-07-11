module.exports = (sequelize, DataTypes) => {

    const Business = sequelize.define("Business", {
        id_business: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        active: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
        },
        razonsocial: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "business",
        timestamps: false
    });


    return Business;
}
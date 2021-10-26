module.exports = (sequelize, DataTypes) => {

    const AlertDetail = sequelize.define("AlertDetail", {
        id_alertDetail: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_alert: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING
        }
     

    }, {
        tableName: "alerts_detail",
        timestamps: false
    });


    return AlertDetail;
}
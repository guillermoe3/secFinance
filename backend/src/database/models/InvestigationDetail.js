module.exports = (sequelize, DataTypes) => {

    const InvestigationDetail = sequelize.define("InvestigationDetail", {
        id_investigationDetail: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_investigation: {
            type: DataTypes.INTEGER
        },
        description: {
            type: DataTypes.STRING,
        },
        ioc: {
            type: DataTypes.STRING
        },
        result: {
            type: DataTypes.STRING
        }
     

    }, {
        tableName: "investigation_detail",
        timestamps: false
    });


    return InvestigationDetail;
}
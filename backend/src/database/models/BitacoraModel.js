module.exports = (sequelize, DataTypes) => {

const Bitacora = sequelize.define('Bitacora',{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date:{
        type: DataTypes.DATE
    },
    severity:{
        type: DataTypes.STRING
    },
    event:{
        type: DataTypes.STRING
    },
    userEmail:{
        type: DataTypes.STRING
    }

},{
    tableName: "bitacora",
    timestamps: false,
    //freezeTableName:true
});
 
    return Bitacora;
}

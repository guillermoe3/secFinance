module.exports = (sequelize, DataTypes) => {

const Users = sequelize.define('Users',{
    id_usuario:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataTypes.STRING
    },
    lastname:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.STRING
    },
    id_business:{
        type: DataTypes.STRING
    },
    refresh_token:{
        type: DataTypes.TEXT
    },
    active: {
        type: DataTypes.BOOLEAN
    }
},{
    tableName: "users",
    timestamps: false,
    //freezeTableName:true
});
 
    return Users;
}

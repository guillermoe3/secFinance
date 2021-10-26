module.exports = (sequelize, DataTypes) => {

    const Investigation = sequelize.define("Investigation", {
        id_investigation: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_analyst: {
            type: DataTypes.INTEGER},
        id_user: {
            type: DataTypes.INTEGER},
        closed: {
            type: DataTypes.BOOLEAN,  
        },
        description: {
            type: DataTypes.STRING,
        },
        likes: {
            type: DataTypes.STRING
        },
        dislikes: {
            type: DataTypes.STRING
        },
        date_creation: {
            type: DataTypes.DATE
        },
        isPublic: {
            type: DataTypes.BOOLEAN,  
        },
        isShared: {
            type: DataTypes.BOOLEAN,  
        },
        title: {
            type: DataTypes.STRING
        },
        validated: {
            type: DataTypes.BOOLEAN,  
        }

    }, {
        tableName: "investigations",
        timestamps: false
    });


    return Investigation;
}
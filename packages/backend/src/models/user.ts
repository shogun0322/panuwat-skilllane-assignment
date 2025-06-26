import { v4 as uuid } from "uuid";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export default (sequelize: Sequelize) => {
  const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
    "users",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  User.beforeCreate((user: any) => {
    user.id = uuid();
  });

  return User;
};

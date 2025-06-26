import { v4 as uuid } from "uuid";
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface TaskAttributes {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image?: string;
  status: "INCOMPLETE" | "COMPLETE";
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

type TaskCreationAttributes = Optional<
  TaskAttributes,
  "id" | "image" | "status"
>;

export default (sequelize: Sequelize) => {
  const Task = sequelize.define<Model<TaskAttributes, TaskCreationAttributes>>(
    "tasks",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("INCOMPLETE", "COMPLETE"),
        defaultValue: "INCOMPLETE",
        allowNull: false,
      },
    },
    {
      tableName: "tasks",
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
      paranoid: true,
    }
  );

  Task.beforeCreate((task: any) => {
    task.id = uuid();
  });

  (Task as any).associate = (models: any) => {
    Task.belongsTo(models.users, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
  };

  return Task;
};

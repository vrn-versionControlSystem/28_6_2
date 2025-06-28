const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../configs/database");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    pattern_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    material_grade_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drawing_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    row_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    pump_model: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_measurement: {
      type: DataTypes.ENUM("no", "kg", "mm"),
      validate: {
        isInEnum(value) {
          if (!["no", "kg", "mm"].includes(value)) {
            throw new Error("Invalid product unit measurement yo manssss");
          }
        },
      },
      defaultValue: "no",
    },
    hsn_code: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      set(value) {
        if (!value) {
          this.setDataValue("hsn_code", null);
        } else {
          this.setDataValue("hsn_code", value);
        }
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    standard_lead_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    raw_lead_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    machine_lead_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    quality_lead_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    // gst_percentage: {
    //     type: DataTypes.DOUBLE,
    //     allowNull: false,
    //     defaultValue: 0,
    // },
    standard_lead_time_type: {
      type: DataTypes.ENUM("days", "weeks", "months", "years"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["days", "weeks", "months", "years"].includes(value)) {
            throw new Error("Invalid product standard lead time");
          }
        },
      },
      defaultValue: "days",
    },

    raw_lead_time_type: {
      type: DataTypes.ENUM("days", "weeks", "months", "years"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["days", "weeks", "months", "years"].includes(value)) {
            throw new Error("Invalid product raw lead time");
          }
        },
      },
      defaultValue: "days",
    },

    machine_lead_time_type: {
      type: DataTypes.ENUM("days", "weeks", "months", "years"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["days", "weeks", "months", "years"].includes(value)) {
            throw new Error("Invalid product machine lead time");
          }
        },
      },
      defaultValue: "days",
    },

    quality_lead_time_type: {
      type: DataTypes.ENUM("days", "weeks", "months", "years"),
      allowNull: false,
      validate: {
        isInEnum(value) {
          if (!["days", "weeks", "months", "years"].includes(value)) {
            throw new Error("Invalid product quality lead time");
          }
        },
      },
      defaultValue: "days",
    },
    added_by_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    added_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["product_id"],
      },
    ],
    tableName: "products",
  }
);

Product.beforeCreate(async (product) => {
  const productCode = await generateUniqueProductCode(product.name[0]);
  return (product.product_code = productCode);
});

const generateUniqueProductCode = async (product) => {
  const productCode = `${product}${Math.floor(Math.random() * 100000)}`;
  const customerWithSameCustomerCode = await Product.findOne({
    where: { product_code: productCode },
  });
  if (customerWithSameCustomerCode) {
    return generateUniqueCustomerCode(product);
  }

  return productCode;
};

// Product.hasOne(Pattern,{foreignKey: 'pattern_id'})
// Product.hasOne(MaterialGrade,{foreignKey: 'material_grade_id'})
// Product.hasOne(Category,{foreignKey: 'category_id'})

Product.sync({ alter: false }).then().catch();

module.exports = Product;

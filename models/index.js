import sequelize from '../config/database.js';
import Product from './product.js';
import Tag from './tag.js';

Product.belongsToMany(Tag, { 
  through: 'ProductTag',
  foreignKey: 'productId',
  otherKey: 'tagId',
  as: 'tags'
});

Tag.belongsToMany(Product, { 
  through: 'ProductTag',
  foreignKey: 'tagId',
  otherKey: 'productId',
  as: 'products'
});

export { sequelize, Product, Tag };
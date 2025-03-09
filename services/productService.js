import { Op } from 'sequelize';
import { Product, Tag, sequelize } from '../models/index.js';

class ProductService {
  async advancedSearch({ category, tags, minPrice, maxPrice, minRating, maxRating, limit = 10, offset = 0, sortBy = 'price', sortOrder = 'ASC' }) {
    try {
      const whereClause = {};
      if (category) whereClause.category = category;
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
      }
      if (minRating || maxRating) {
        whereClause.rating = {};
        if (minRating) whereClause.rating[Op.gte] = parseFloat(minRating);
        if (maxRating) whereClause.rating[Op.lte] = parseFloat(maxRating);
      }
      
      const parsedLimit = parseInt(limit, 10);
      const parsedOffset = parseInt(offset, 10);
      const normalizedSortOrder = sortOrder.toUpperCase();
      const includeClause = tags ? [{
        model: Tag,
        as: 'tags',
        where: { name: { [Op.in]: Array.isArray(tags) ? tags : [tags] } },
        attributes: ['id', 'name'],
        through: { attributes: [] }
      }] : [{
        model: Tag,
        as: 'tags',
        attributes: ['id', 'name'],
        through: { attributes: [] },
        required: false
      }];

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: includeClause,
        limit: parsedLimit,
        offset: parsedOffset,
        order: [[sortBy, normalizedSortOrder]],
        distinct: true
      });
      
      const categoryCounts = await Product.findAll({
        where: whereClause,
        attributes: ['category', [sequelize.fn('COUNT', sequelize.col('Product.id')), 'count']],
        include: tags ? [{
          model: Tag,
          as: 'tags',
          where: { name: { [Op.in]: Array.isArray(tags) ? tags : [tags] } },
          attributes: [],
          through: { attributes: [] }
        }] : [],
        group: ['category'],
        raw: true
      });
      
      const avgRating = await Product.findOne({
        where: whereClause,
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']],
        include: tags ? [{
          model: Tag,
          as: 'tags',
          where: { name: { [Op.in]: Array.isArray(tags) ? tags : [tags] } },
          attributes: [],
          through: { attributes: [] }
        }] : [],
        raw: true
      });
      
      return {
        products,
        pagination: {
          total: count,
          limit: parsedLimit,
          offset: parsedOffset,
          hasMore: count > parsedOffset + parsedLimit
        },
        aggregations: {
          categories: categoryCounts.map(({ category, count }) => ({ category, count: parseInt(count, 10) })),
          averageRating: avgRating?.averageRating ? parseFloat(avgRating.averageRating).toFixed(1) : null
        }
      };
    } catch (error) {
      console.error('Advance searching error:', error);
      throw error;
    }
  }
}

export default new ProductService();

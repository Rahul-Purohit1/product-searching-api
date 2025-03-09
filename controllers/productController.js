import productService from '../services/productService.js';

class ProductController {
  async advancedSearch(req, res) {
    try {
      const result = await productService.advancedSearch(req.query);
      return res.status(200).json({
        status: 'success',
        data: result.products,
        pagination: result.pagination,
        aggregations: result.aggregations
      });
    } catch (error) {
      console.error('Error in searching products:', error);
      return res.status(500).json({ status: 'error', message: 'Something went wrong while searching for products --->>' });
    }
  }
}

export default new ProductController();

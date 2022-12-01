const Joi = require("joi");
const { InternalServerError } = require("../../helpers/errors");
const { db, jwt } = require("../providers");

class Category {
  constructor(category) {
    this.category_id = category.category_id;
    this.name =         category.name;
    this.image_src =    category.image_src;
    this.is_available = category.is_available? category.is_available:1;
  }
  tokenize(){
    return jwt.sign({
      name: this.name,
      image_src: this.image_src,
    })
  }

  async save(){
    let retVal = null;

    try {
      const conn = await db.connect();
      const [data] = await conn.execute(
        `INSERT INTO category (
          category_id, 
          name, 
          image_src, 
          is_available) 
        VALUES (
          NULL, 
          :name, 
          :image_src, 
          :is_available
        )`,
        this
      );

      this.category_id = data.indertId;
      retVal = this;
    } catch (error) {
      console.log("[CATEGORY DB ERROR]", err.message);
      throw new InternalServerError(err);
    }
    return retVal;
  }

  static validate(category){
    const schema = Joi.object({
      name: Joi.string().label("Name").min(2).max(100).required(),
      image_src: Joi.string().label("Image Source"),
    })
    return schema.validate;
  }
}

module.exports = Category;
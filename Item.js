function Item(x, y, type, owner)
{
    VisualGameObject.call(this, x, y, type);

    this.owner = owner;
}

Item.prototype =
{                               
   // item owner
   owner : null,

   destroyItem : function()
   {
      this.destroyVisualGameObject();
   },

   pickUp : function(creature)
   {
      this.owner = creature;

      // only works for @ at the moment
      creature.inventory.add(this.getCategory(), this);

      g_level.getTile(this.x, this.y).item = null;
   },

   drop : function(x, y)
   {
      this.x = x;
      this.y = y;

      this.owner = null;
      g_level.getTile(x, y).item = this;
   },

   /**
    * return a string representing the name of the category that
    * the current item belongs to. This information comes from g_itemsCategories.
    *
    */
   getCategory : function()
   {
      for(var i = 0; i < g_itemsCategories.length; i++)
      {
         if(g_itemsCategories[i][0][this.type])
         {
            return g_itemsCategories[i][1];
         }
      }
   }
};

extend(Item, VisualGameObject);

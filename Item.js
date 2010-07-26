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

   getCategory : function()
   {
      if(g_weaponInfo[this.type])
      {
         return 'WEAPON';
      }
      else if(g_armorInfo[this.type])
      {
         return 'ARMOR';
      }
      else if(g_edibleItemInfo[this.type])
      {
         return 'EDIBLE';
      }
      // ...
   }
};

extend(Item, VisualGameObject);

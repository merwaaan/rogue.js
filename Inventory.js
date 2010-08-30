function Inventory()
{
   this.items = new Array();
}

Inventory.prototype =
{
   // inventory content
   items : null,

   /**
    * add an item to the inventory
    */
   add : function(item)
   {
      this.items.push(item);
   },

   /**
    * remove an item from the inventory
    */
   remove : function(item)
   {
      this.items.removeObject(item);
   },

   /**
    *  returns true if there is enough space for the item in the inventory
    */
   enoughSpace : function(item)
   {
      return true;
   },

   /**
    * open a menu letting the player choose and use his items
    */
   open : function()
   {
      g_menu.openInventoryFrame();
   },

   /**
    * drop the content of the inventory on the tile the owner is standing on
    */
   drop : function()
   {
      // check if there really are items to drop
      if(this.items.length > 0)
      {
         var owner = this.items[0].owner;

         for(var i = 0; i < this.items.length; i++)
            owner.getTile().dropItem(this.items[i]);
      }
   }
}

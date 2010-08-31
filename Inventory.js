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
    * open a menu letting the player directly use his items
    */
   open : function()
   {
      g_menu.openInventoryMenu();
   },

   /**
    * Drop all the content of the inventory on the tile the owner is standing on.
    */
   drop : function()
   {
      for(var i = 0; i < this.items.length; i++)
         this.items[i].drop();
   }
}

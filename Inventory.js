function Inventory()
{
   this.items = new Array();
}

Inventory.prototype =
{
   // inventory content
   items : null,

   add : function(item)
   {
      this.items.push(item);
   },

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

   open : function()
   {
      g_menu.openInventoryFrame();
   }
}

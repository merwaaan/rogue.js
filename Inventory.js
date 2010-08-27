const MAX_WEAPON = 3;
const MAX_ARMOR = 2;
const MAX_FOOD = 5;

function Inventory()
{
   this.weapons = new Array();
   this.armors = new Array();
   this.food = new Array();

   this.shortcuts = new Array();
}

Inventory.prototype =
{
   // inventory content
   weapons : null,
   armors : null,
   food : null,

   /**
    * Array listing all of the shortcuts and the items associated to
    * each one of them.
    *
    * [[keycode, item], ...]
    */
   shortcuts : null,

   add : function(category, item)
   {
      if(category == 'WEAPON')
      {
         this.weapons.push(item);
      }
      else if(category == 'ARMOR')
      {
         this.armors.push(item);
      }
      else if(category == 'FOOD')
      {
         this.food.push(item);
      }
   },

   remove : function(item)
   {
      if(item.getCategory() == 'WEAPON')
      {
         this.weapons.removeObject(item);
      }
      else if(item.getCategory() == 'ARMOR')
      {
         this.armors.removeObject(item);
      }
      else if(item.getCategory() == 'FOOD')
      {
         this.food.removeObject(item);
      }
   },

   // returns true if there is a free slot for the item in the inventory
   hasFreeSlot : function(item)
   {
      if(item.getCategory() == 'WEAPON')
      {
         return this.weapons.length < MAX_WEAPON;
      }
      else if(item.getCategory() == 'ARMOR')
      {
         return this.armors.length < MAX_ARMOR;
      }
      else if(item.getCategory() == 'FOOD')
      {
         return this.food.length < MAX_FOOD;
      }
   },

   open : function()
   {
      g_menu.openInventoryFrame();
   }
}

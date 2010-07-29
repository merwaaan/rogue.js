function Armor(x, y, type, owner)
{
   WieldableItem.call(this, x, y, type, owner);

   this.info = g_armorInfo[type];
}

Armor.prototype =
{
   getProtection : function()
   {
      return this.info['PWR'];
   },

   wield : function()
   {
      this.owner.armor = this; 
   },

   unwield : function()
   {
      this.owner.armor = null;
   },

   isWielded : function()               
   {
      if(this == this.owner.armor)
      {
         return true;
      }

      return false;
   }
};

extend(Armor, WieldableItem);

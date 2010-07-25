function Armor(x, y, type, owner)
{
   Item.call(this, x, y, type, owner);

   this.info = g_armorInfo[type];
}

Armor.prototype =
{
   getProtection : function()
   {
      return this.info['PWR'];
   }
};

extend(Armor, Item);

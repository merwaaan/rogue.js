function Weapon(x, y, type, owner)
{
   WieldableItem.call(this, x, y, type, owner);

   this.info = g_weaponInfo[type];
}

Weapon.prototype =
{
   getDamage : function()
   {
      return this.info['PWR'];
   },

   wield : function()
   {
      this.owner.weapon = this; 
   },

   unwield : function()
   {
      this.owner.weapon = null;
   },

   isWielded : function()               
   {
      if(this == this.owner.weapon)
      {
         return true;
      }

      return false;
   }
};

extend(Weapon, WieldableItem);

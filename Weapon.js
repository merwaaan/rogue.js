function Weapon(x, y, type, owner)
{
   Item.call(this, x, y, type, owner);

   this.info = g_weaponInfo[type];
}

Weapon.prototype =
{
   getDamage : function()
   {
      return this.info['PWR'];
   }
};

extend(Weapon, Item);

function Weapon(x, y, type, owner)
{
   Item.apply(this, [x, y, type, owner]);

   this.info = g_weaponInfo[type];
}

Weapon.prototype =
{
   getDamage : function()
   {
      return this.info['damage'];
   }
};

extend(Weapon, Item);


// MELEE WEAPON

function MeleeWeapon(x, y, type, owner)
{
   Weapon.apply(this, [x, y, type, owner]);
}

MeleeWeapon.prototype =
{
   use : function()
   {
      var targets = this.owner.getMeleeTargets();

      if(targets.length == 0)
         writeMessage('No enemy to attack with ' + this.getName());
      // only one enemy : attack
      else if(targets.length == 1)
         this.owner.attack(targets[0]);
      // several enemies : let the user choose the target
      else
         g_targetingInterface.selectTarget(targets);
   }
};

extend(MeleeWeapon, Weapon);

// DISTANCE WEAPON

function DistanceWeapon(x, y, type, owner)
{
   Weapon.apply(this, [x, y, type, owner]);

   this.minDistance = this.info['minDistance'];
   this.maxDistance = this.info['maxDistance'];
}

DistanceWeapon.prototype =
{
   // range
   minDistance : null,
   maxDistance : null,

   use : function()
   {
      g_targetingInterface.open(new Projectile('ARROW', this), this.maxDistance, this.minDistance);
   }
};

extend(DistanceWeapon, Weapon);

// PROJECTILE

function Projectile(type, weapon)
{
   Item.apply(this, [null, null, type, weapon.owner]);

   this.info = g_projectileInfo[type];
   this.weapon = weapon;
}

Projectile.prototype =
{
   // weapon which launched the projectile
   weapon : null,

   afterThrow : function()
   {
      var creature = g_level.getTile(this.x, this.y).creature;

      // if there is a creature where the projectile has been thrown, hurt it
      if(creature)   
         this.weapon.owner.attack(g_level.getTile(this.x, this.y).creature);
   }
};

extend(Projectile, Item);

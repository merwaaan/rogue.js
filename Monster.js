function Monster(type)
{
    Creature.call(this, type);

    this.info = g_monsterInfo[type];

    this.HP = 3;

    this.brain = new StateMachine(this, g_roamerBehavior);

    this.inventory = new Inventory();
    this.inventory.add(new Weapon(null, null, 'SWORD', this));
}

Monster.prototype =
{
   // status
   HP : null,
   maxHP : null,

   brain : null,

   // tracked enemy
   targetedEnemy : null,

   destroyMonster : function()
   {
       this.destroyCreature();
   },

   update : function()
   {
      if(this.brain)
         this.brain.think();
   },

   /**********************
    * Stimulus functions
    **********************/

   /**
    * Check if the creature can detect a potential enemy within its FOV.
    * If it is the case, return an array containing the seen creature, else
    * return null.
    */
   seeEnemy : function()
   {
      // TEMPORARY !!!
      if(Math.sqrt(Math.pow(this.x - g_player.x, 2) + Math.pow(this.y - g_player.y, 2)) < 5)
         return [g_player];

      return null;
   },

   /**
    * Check if the creature is currently targeting another creature and if
    * it is positionned next to it. If it is the case, return an array
    * containing the targeted creature, else null.
    */
   nextToTarget : function()
   {
      var target = this.getTarget();

      if(target && this.nextTo(target))
         return [target];

      return null;
   },

   /**
    * Check if the creature is positionned far from its target, ie not next to it.
    */
   farFromTarget : function()
   {
      if(!this.nextToTarget())
         return [this.brain.state.target];

      return null;
   },

   /**
    * Check if the creature is currently targeting another object. If
    * it is the case return the targeted object, else return null.
    */
   getTarget : function()
   {
      if(this.brain && this.brain.state && this.brain.state.target)
         return this.brain.state.target;

      return null;
   }
}

extend(Monster, Creature);

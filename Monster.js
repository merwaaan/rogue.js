function Monster(type)
{
    Creature.call(this, type);

    this.info = g_monsterInfo[type];

    this.HP = 3;

    this.brain = new StateMachine(this, g_roamerBehavior);

    this.inventory.push(new Weapon(null, null, 'RUSTY_SWORD', this));
}

Monster.prototype =
{
   // status
   HP : null,
   maxHP : null,

   // state machine controlling the creature
   brain : null,

   // tracked enemy
   target : null,

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
    * Check if the creature's health if critically low.
    */
   hasCriticalHealth : function()
   {
      if(this.HP == 1)
         return true;

      return false;
   },

   /**
    * Check if the creature can detect a potential enemy within its FOV.
    * If it is the case, return true and record the enemy.
    */
   seeEnemy : function()
   {
      // TEMPORARY!!!
      if(Math.sqrt(Math.pow(this.x - g_player.x, 2) + Math.pow(this.y - g_player.y, 2)) < 5)
      {
         this.target = g_player;

         return true;
      }

      return false;
   },

   /**
    * Check if the creature is positionned next to its target.
    */
   nextToTarget : function()
   {
      var target = this.getTarget();

      if(target && this.nextTo(target))
         return true;

      return false;
   },

   /**
    * Check if the creature is positionned far from its target.
    */
   farFromTarget : function()
   {
      if(Math.sqrt(Math.pow(this.x - g_player.x, 2) + Math.pow(this.y - g_player.y, 2)) > 10)
         return true;

      return false;
   },

   /**
    * Return the current target of the creature, null if it is not currently
    * targeting anything.
    */
   getTarget : function()
   {
      if(this.target)
         return this.target;

      return null;
   }
};

extend(Monster, Creature);

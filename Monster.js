function Monster(type)
{
    Creature.call(this, type);

    this.info = g_monsterInfo[type];

    this.HP = 3;

    this.brain = new FiniteStateMachine(this, g_followerBehavior);
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
      {
         this.brain.think();
      }
   },

   getName : function()
   {
       return 'the ' + this.info['name'];
   },

   /**
    * Stimulus functions
    */

   // TODO
   /**
    * @returns an enemy creature to follow
    */
   seeEnemy : function()
   {
      return [g_player];
   },

   /**
    * @returns the targeted enemy if the current monster is positionned next to it,
    * null if it is still far away or if it doesn't exist
    */
   nextToTargetedEnemy : function()
   {
      if(this.targetedEnemy && this.nextTo(this.targetedEnemy))
      {
         return [this.targetedEnemy];
      }

      return null;
   },

   /**
    * @returns the targeted enemy if the current monster is far away from it,
    * null if it is next to it or if it doesn't exist
    */
   farFromTargetedEnemy : function()
   {
      if(this.targetedEnemy && !this.nextToTargetedEnemy())
      {
         return [this.targetedEnemy];
      }

      return null;
   }
}

extend(Monster, Creature);

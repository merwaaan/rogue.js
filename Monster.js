function Monster(type)
{
    Creature.call(this, type);

    this.info = g_monsterInfo[type];

    this.HP = 5;
    this.XP = g_monsterInfo[this.type]['XP'];

    this.STR = this.info['STR'];
    this.DEF = this.info['DEF'];

    this.brain = new FiniteStateMachine(this, g_followerBehavior);
}

Monster.prototype =
{
   brain : null,

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
    * @returns the enemy currently targeted by the monster,
    *  if there is none, or if he has no brain, returns null.
    *
    *  note : this means that targetted enemy must be called 'target'
    *  in each state they appear in.
    */
   getTargetedEnemy : function()
   {
      if(this.brain && this.brain.state && this.brain.state.target)
      {
         return this.brain.state.target;
      }

      return null;
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
    * @returns the target enemy if the current monster is positionned next to it,
    * null if it is still far away
    */
   nextToTargetedEnemy : function()
   {
      if(this.nextTo(this.getTargetedEnemy()))
      {
         return [this.getTargetedEnemy()];
      }

      return null;
   },

   /**
    * @returns the target enemy if the current monster is far away from it,
    * null if it is next to it
    */
   farFromTargetedEnemy : function()
   {
      if(!this.nextToTargetedEnemy())
      {
         return [this.getTargetedEnemy()];
      }

      return null;
   }
}

extend(Monster, Creature);

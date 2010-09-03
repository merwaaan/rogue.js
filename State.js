function State(host)
{
   this.host = host;
}

State.prototype =
{
   host: null,

   enter : null,
   update : null,
   exit : null
}

// IDLE

function IdleState(host, args)
{
   State.call(this, host);
}

IdleState.prototype =
{
   update : function()
   {
   },

   toString : function()
   {
      return 'IdleState';
   }
};

extend(IdleState, State);

// ROAM

function RoamState(host, args)
{
   State.call(this, host);

   // get a random destination
   this.getNewDestination();
}

RoamState.prototype =
{
   // targeted tile
   destination : null,

   // path to the targeted tile
   path : null,

   update : function()
   {
      // if the destination is reached, find a new destination
      if(this.path.length == 0)
         this.getNewDestination();
      // else walk to the destination
      else
      {
         this.host.move(this.path[0].x, this.path[0].y);
         this.path.shift();
      }
   },

   /**
    * Randomly find a new destination tile for the creature and compute
    * a path to it.
    */
   getNewDestination : function()
   {
      this.destination = g_level.getRandomTile('FLOOR');
      this.path = new AStar().getInBetweenPath(this.host.getTile(), this.destination);
   },

   toString : function()
   {
      return 'RoamState';
   }
};

extend(RoamState, State);

// FOLLOW

function FollowState(host, args)
{
   State.call(this, host);

   this.target = args[0];
   this.targetLastTile = this.target.getTile();
}

FollowState.prototype =
{
   target : null,

   targetLastTile : null,

   path : null,

   update : function()
   {
      // if it has not been made yet or if the target moved since the last update, compute the path
      if(!this.path || this.target.getTile() != this.targetLastTile)
         this.path = new AStar().getInBetweenPath(this.host.getTile(), this.target.getTile());

      // move to the first step of the path
      if(this.path)
      {
         this.host.move(this.path[0].x, this.path[0].y);
         this.targetLastTile = this.target.getTile();
      }
   },

   toString : function()
   {
      return 'FollowState';
   }
};

extend(FollowState, State);

// ATTACK

function AttackState(host, args)
{
   State.call(this, host);

   this.target = args[0];
}

AttackState.prototype =
{
   target : null,

   update : function()
   {
      this.host.attack(this.target);
   },

   toString : function()
   {
      return 'AttackState';
   }
};

extend(AttackState, State);

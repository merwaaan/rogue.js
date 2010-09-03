function State(host)
{
   this.host = host;
}

State.prototype =
{
   host: null,

   update : null,
}

// IDLE

function IdleState(host)
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

function RoamState(host)
{
   State.call(this, host);
}

RoamState.prototype =
{
   // targeted tile
   destination : null,

   // path to the targeted tile
   path : null,

   enter : function()
   {
      this.getNewDestination();
   },

   update : function()
   {
      // if the destination is reached, find a new destination
      if(this.path.length == 0)
         this.getNewDestination();
      
      // walk to the destination and remove the tile we moved on from the path
      this.host.move(this.path[0].x, this.path[0].y);
      this.path.shift();
   },

   /**
    * Randomly find a new destination tile for the creature and compute
    * a path to it.
    */
   getNewDestination : function()
   {
      do
      {
         this.destination = g_level.getRandomTile('FLOOR');
         this.path = new AStar().getInBetweenPath(this.host.getTile(), this.destination);
      } while(!this.path);
   },

   toString : function()
   {
      return 'RoamState';
   }
};

extend(RoamState, State);

// FOLLOW

function FollowState(host)
{
   State.call(this, host);
}

FollowState.prototype =
{
   targetLastTile : null,

   path : null,

   enter : function()
   {
      this.targetLastTile = this.host.target.getTile();
   },

   update : function()
   {
      // if it has not been made yet or if the target moved since the last update, compute the path
      if(!this.path || this.host.target.getTile() != this.targetLastTile)
         this.path = new AStar().getInBetweenPath(this.host.getTile(), this.host.target.getTile());

      if(this.path)
      {
         // walk to the destination and remove the tile we moved on from the path
         this.host.move(this.path[0].x, this.path[0].y);
         this.path.shift();

         this.targetLastTile = this.host.target.getTile();
      }
   },

   toString : function()
   {
      return 'FollowState';
   }
};

extend(FollowState, State);

// ATTACK

function AttackState(host)
{
   State.call(this, host);
}

AttackState.prototype =
{
   enter : function()
   {
      this.target = this.host.target;
   },

   update : function()
   {
      this.host.attack(this.host.target);
   },

   toString : function()
   {
      return 'AttackState';
   }
};

extend(AttackState, State);

// FLEE

// For the moment FleeState is a simple copy and paste of RoamState
function FleeState(host, args)
{
   State.call(this, host);

   // get a random destination
   this.getNewDestination();
}

FleeState.prototype =
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
      return 'FleeState';
   }
};

extend(FleeState, State);

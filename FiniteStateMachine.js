function FiniteStateMachine(host, behavior)
{
   this.host = host;

   this.behavior = behavior;

   // for the moment, the first state is always IDLE
   this.changeState(new IdleState(this));
}

FiniteStateMachine.prototype =
{
   // 'owner' of the FSM
   host : null,
   
   // current state    
   state : null,

   think : function()
   {
      this.checkPossibleTransitions();
      this.state.update();
   },

   /**
    * change the current state of the state machine,
    * exit()ing the previous state and enter()ing the new one
    */
   changeState : function(state)
   {
      if(this.state && this.state.exit)
      {
         this.state.exit();
      }
      
      this.state = state;
      
      if(this.state && this.state.enter)
      {
         this.state.enter();
      }
   },

   /**
    * change the current state if there is an opportunity
    */
   checkPossibleTransitions : function()
   {
      // get all the possible transitions from the current state
      var transitions = this.behavior[this.state.toString()];

      // holds the array returned by the stimulus functions
      var args = null;

      // check each condition likely to trigger a transition
      for(var stimulus in transitions)
      {
         if(args = eval('this.host.' + stimulus + '()'))
         {
            // change the state and pass the arguments received from the stimulus function
            this.changeState(eval('new ' + transitions[stimulus] + '(this.host, args)'));   
         }
      }
   }
};

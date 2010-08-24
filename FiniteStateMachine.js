function FiniteStateMachine(host, behavior)
{
   // creature whose actions are controlled by this FSM
   this.host = host;

   // transition table
   this.behavior = behavior;

   // for the moment, the first state is always IDLE
   this.changeState(new IdleState(this.host));
}

FiniteStateMachine.prototype =
{
   host : null,
   
   behavior : null,

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
      var currentState = this.behavior[this.state];

      // holds the array returned by the stimulus functions
      var args = null;

      // check each possible transition
      for(var transition in currentState)
      {
         if(args = eval('this.host.' + currentState[transition]['check'] + '()'))
         {
            // change the state and pass the arguments received from the stimulus function
            this.changeState(new currentState[transition]['next'](this.host, args));   

            return;
         }
      }
   }
};

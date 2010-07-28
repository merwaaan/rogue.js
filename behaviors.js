/**
 * This file describes various behaviors usable by creatures
 *
 * Each of these is a nested object containing this kind of behavioral mapping :
 *
 * current state : { stimulus function : next state }
 *
 * - 'current state' requires to be a string representing the name of a state,
 *   without parenthesis.
 * 
 * - 'stimulus function' requires to be a string representing the name of a member
 *   function of the creature holding the behavior, without parenthesis or argument.
 *   As the function will be called by eval()uation as a generic stimulus function, it
 *   must return an simple array containing the data that will be transmitted to the next state.
 *   If the stimulus is not verified, it must return null.
 * 
 * - 'next state' requires to be a string representing the name of a state,
 *   without parenthesis.
 *
 * The principle of this system can be summed up as follows :
 * If in the current state, the stimulus is verified, switch to the next state
 */

// here is a basic example

var g_followerBehavior =
{
   IdleState :
   {
      'A' : {'check' : 'seeEnemy', 'next' : FollowState}
   },
   FollowState : 
   {
      'A' : { 'check' : 'nextToTargetedEnemy' , 'next' : AttackState }
   },
   AttackState :
   {
      'A' : { 'check' : 'farFromTargetedEnemy' , 'next' : FollowState }
   }
};

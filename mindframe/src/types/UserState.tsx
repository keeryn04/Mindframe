export interface UserState {
  stressLevel: number;   //0–100
  energyLevel: number;   //0–100
  focusLevel: number;    //0–100
  momentum: number;      //0–100 — streaks, flow state
  confidence: number;    //0–100 — success/failure history
}
 
export const initialState: UserState = {
  stressLevel: 0,
  energyLevel: 100,
  focusLevel: 100,
  momentum: 50,
  confidence: 50,
};
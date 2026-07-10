export interface CharacterStatus {
  "discord-id": number | string;
  tarot: string;
  "char-name": string;
  "char-call": string;
  age: number;
  class: string;
  background: string;
  room: string;
  address: string;
  keyword: string;
  Level: number;
  "สำรวจ": number;
  EXP: number;
  FR: number;
  Health: string;
  HP: number;
  Sanity: string;
  SP: number;
}

export interface CharacterSkill {
  "discord-id": number | string;
  tarot: string;
  "char-name": string;
  "char-call": string;
  class: string;
  background: string;
  ATB: number;
  S: number | null;
  "S1-1": string | null;
  "S1-2": string | null;
  "S1-3": string | null;
  "S2-1": string | null;
  "S2-2": string | null;
  "S2-3": string | null;
  "S3-1": string | null;
  "S3-2": string | null;
  "S3-3": string | null;
  D: number | null;
  "D1-1": string | null;
  "D1-2": string | null;
  "D1-3": string | null;
  "D2-1": string | null;
  "D2-2": string | null;
  "D2-3": string | null;
  "D3-1": string | null;
  "D3-2": string | null;
  "D3-3": string | null;
  I: number | null;
  "I1-1": string | null;
  "I1-2": string | null;
  "I1-3": string | null;
  "I2-1": string | null;
  "I2-2": string | null;
  "I2-3": string | null;
  "I3-1": string | null;
  "I3-2": string | null;
  "I3-3": string | null;
  W: number | null;
  "W1-1": string | null;
  "W1-2": string | null;
  "W1-3": string | null;
  "W2-1": string | null;
  "W2-2": string | null;
  "W2-3": string | null;
  "W3-1": string | null;
  "W3-2": string | null;
  "W3-3": string | null;
  C: number | null;
  "C1-1": string | null;
  "C1-2": string | null;
  "C1-3": string | null;
  "C2-1": string | null;
  "C2-2": string | null;
  "C2-3": string | null;
  "C3-1": string | null;
  "C3-2": string | null;
  "C3-3": string | null;
  L: number | null;
  "L1-1": string | null;
  "L1-2": string | null;
  "L1-3": string | null;
  "L2-1": string | null;
  "L2-2": string | null;
  "L2-3": string | null;
  "L3-1": string | null;
  "L3-2": string | null;
  "L3-3": string | null;
}

export interface CharacterBag {
  "discord-id": number | string;
  tarot: string;
  "char-name": string;
  "char-call": string;
  class: string;
  background: string;
  "1": string | null;
  "2": string | null;
  "3": string | null;
  "4": string | null;
  "5": string | null;
  "6": string | null;
  Slot: number;
  "Add-Ons": number;
}

export interface MergedCharacter {
  status: CharacterStatus;
  skill: CharacterSkill;
  bag: CharacterBag;
}

export type DefaultOption = {
  value: string;
  label: string;
};

export type UserInfo = {
  activeName: string;
  activeCost: DefaultOption | null;
  employerFio: string;
  //код угрозы
  dangerCode: string;
  //код уязвимости
  vulnerabilityCode: string;
  //вероятность ущерба
  damageProbability: DefaultOption | null;
};
